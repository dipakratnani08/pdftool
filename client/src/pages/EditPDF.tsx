import { useState } from 'react';
import { 
  Edit, 
  HelpCircle, 
  Save, 
  Image, 
  Type, 
  Pencil, 
  Square, 
  Circle, 
  Highlighter, 
  TextSelect, 
  BoldIcon, 
  ItalicIcon, 
  UnderlineIcon, 
  AlignLeftIcon, 
  AlignCenterIcon, 
  AlignRightIcon, 
  Eraser, 
  MousePointer, 
  Stamp, 
  FileSignature, 
  Link,
  PlusCircle,
  MinusCircle,
  PanelLeft,
  RotateCw
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import PDFDropzone from '@/components/PDFDropzone';
import FileList, { FileItem } from '@/components/FileList';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";

const EditPDF: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [activeTab, setActiveTab] = useState('text');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textColor, setTextColor] = useState("#000000");
  const [textBold, setTextBold] = useState(false);
  const [textItalic, setTextItalic] = useState(false);
  const [textUnderline, setTextUnderline] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTool, setActiveTool] = useState("select");
  
  const { toast } = useToast();
  
  // Fetch all available PDFs
  const { data: allFiles = [], isLoading } = useQuery<FileItem[]>({
    queryKey: ['/api/files'],
    staleTime: 30000, // 30 seconds
  });
  
  // Handle file upload
  const handleUploadComplete = (uploadedFiles: FileItem[]) => {
    if (uploadedFiles.length > 0) {
      setSelectedFile(uploadedFiles[0]);
    }
  };
  
  // Handle file selection
  const handleSelectFile = (file: FileItem) => {
    setSelectedFile(file);
  };
  
  // Handle text formatting
  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0]);
  };
  
  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value);
  };
  
  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor(e.target.value);
  };
  
  const toggleBold = () => {
    setTextBold(!textBold);
  };
  
  const toggleItalic = () => {
    setTextItalic(!textItalic);
  };
  
  const toggleUnderline = () => {
    setTextUnderline(!textUnderline);
  };
  
  // Handle zoom
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };
  
  // Handle page navigation
  const handleNextPage = () => {
    if (selectedFile && currentPage < selectedFile.pageCount) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  // Handle tool selection
  const handleToolChange = (tool: string) => {
    setActiveTool(tool);
  };
  
  // Handle save edited PDF
  const handleSave = () => {
    toast({
      title: "PDF edited successfully",
      description: "Your changes have been applied to the PDF document.",
    });
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Edit PDF</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mt-10">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Edit PDF</CardTitle>
                <CardDescription>
                  Modify text, add images, and annotate your PDF documents.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <HelpCircle className="h-4 w-4 mr-1" />
                Help
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="py-6">
            <div className="max-w-2xl mx-auto">
              {/* Dropzone */}
              {!selectedFile && (
                <PDFDropzone onUploadComplete={handleUploadComplete} />
              )}
              
              {/* Existing files selection */}
              {!selectedFile && allFiles && allFiles.length > 0 && (
                <div className="mt-8 mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Or select from your files:</h3>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {allFiles.map(file => (
                      <button
                        key={file.id}
                        className="flex items-center p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-left"
                        onClick={() => handleSelectFile(file)}
                      >
                        <Edit className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm truncate">{file.fileName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Selected file */}
              {selectedFile && (
                <>
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Selected PDF to edit:</h3>
                    <FileList 
                      files={[selectedFile]} 
                      onRemove={() => setSelectedFile(null)}
                      allowReordering={false}
                    />
                  </div>
                  
                  {/* Editor tools */}
                  <div className="mt-6">
                    <Tabs defaultValue="text" onValueChange={setActiveTab} className="mb-6">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="text">Text</TabsTrigger>
                        <TabsTrigger value="images">Images</TabsTrigger>
                        <TabsTrigger value="annotate">Annotate</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="text" className="mt-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Add Text</h4>
                            <div className="flex space-x-2">
                              <Input placeholder="Enter text to add" className="flex-1" />
                              <Button variant="outline">
                                <Type className="h-4 w-4 mr-2" />
                                Add Text
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-4 border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Text Formatting</h4>
                            
                            <div className="grid grid-cols-2 gap-4">
                              {/* Font Family */}
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Font Family</label>
                                <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select font" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Arial">Arial</SelectItem>
                                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                    <SelectItem value="Courier">Courier</SelectItem>
                                    <SelectItem value="Helvetica">Helvetica</SelectItem>
                                    <SelectItem value="Verdana">Verdana</SelectItem>
                                    <SelectItem value="Georgia">Georgia</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              {/* Font Size */}
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <label className="text-xs text-gray-500">Font Size</label>
                                  <span className="text-xs font-medium">{fontSize}px</span>
                                </div>
                                <Slider
                                  value={[fontSize]}
                                  min={8}
                                  max={72}
                                  step={1}
                                  onValueChange={handleFontSizeChange}
                                />
                              </div>
                            </div>
                            
                            {/* Text Style Controls */}
                            <div className="mt-4 flex items-center space-x-3">
                              <div className="flex items-center space-x-1.5">
                                <label className="text-xs text-gray-500">Color:</label>
                                <input 
                                  type="color" 
                                  value={textColor} 
                                  onChange={handleTextColorChange}
                                  className="w-6 h-6 rounded-md overflow-hidden cursor-pointer"
                                />
                              </div>
                              
                              <div className="border-l pl-3 flex items-center space-x-1">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Toggle 
                                        pressed={textBold} 
                                        onPressedChange={toggleBold}
                                        size="sm"
                                        className="h-8 w-8 p-0 data-[state=on]:bg-primary-100 data-[state=on]:text-primary-600"
                                      >
                                        <BoldIcon className="h-4 w-4" />
                                      </Toggle>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">Bold</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Toggle 
                                        pressed={textItalic} 
                                        onPressedChange={toggleItalic}
                                        size="sm"
                                        className="h-8 w-8 p-0 data-[state=on]:bg-primary-100 data-[state=on]:text-primary-600"
                                      >
                                        <ItalicIcon className="h-4 w-4" />
                                      </Toggle>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">Italic</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Toggle 
                                        pressed={textUnderline} 
                                        onPressedChange={toggleUnderline}
                                        size="sm"
                                        className="h-8 w-8 p-0 data-[state=on]:bg-primary-100 data-[state=on]:text-primary-600"
                                      >
                                        <UnderlineIcon className="h-4 w-4" />
                                      </Toggle>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">Underline</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              
                              <div className="border-l pl-3 flex items-center space-x-1">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Toggle 
                                        pressed={activeTool === "alignLeft"} 
                                        onPressedChange={() => handleToolChange("alignLeft")}
                                        size="sm"
                                        className="h-8 w-8 p-0 data-[state=on]:bg-primary-100 data-[state=on]:text-primary-600"
                                      >
                                        <AlignLeftIcon className="h-4 w-4" />
                                      </Toggle>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">Align Left</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Toggle 
                                        pressed={activeTool === "alignCenter"} 
                                        onPressedChange={() => handleToolChange("alignCenter")}
                                        size="sm"
                                        className="h-8 w-8 p-0 data-[state=on]:bg-primary-100 data-[state=on]:text-primary-600"
                                      >
                                        <AlignCenterIcon className="h-4 w-4" />
                                      </Toggle>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">Align Center</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Toggle 
                                        pressed={activeTool === "alignRight"} 
                                        onPressedChange={() => handleToolChange("alignRight")}
                                        size="sm"
                                        className="h-8 w-8 p-0 data-[state=on]:bg-primary-100 data-[state=on]:text-primary-600"
                                      >
                                        <AlignRightIcon className="h-4 w-4" />
                                      </Toggle>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">Align Right</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-md mt-4">
                            <h4 className="text-xs font-medium text-gray-700 mb-2">Text Preview</h4>
                            <div 
                              className="p-3 bg-white border rounded-md"
                              style={{
                                fontFamily,
                                fontSize: `${fontSize}px`,
                                color: textColor,
                                fontWeight: textBold ? 'bold' : 'normal',
                                fontStyle: textItalic ? 'italic' : 'normal',
                                textDecoration: textUnderline ? 'underline' : 'none',
                                textAlign: activeTool === 'alignCenter' 
                                  ? 'center' 
                                  : activeTool === 'alignRight' 
                                    ? 'right' 
                                    : 'left'
                              }}
                            >
                              Text formatting preview
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="images" className="mt-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Add Image</h4>
                            <div className="flex flex-wrap gap-3">
                              <Button variant="outline">
                                <Image className="h-4 w-4 mr-2" />
                                Upload Image
                              </Button>
                              <Button variant="outline">
                                <Image className="h-4 w-4 mr-2" />
                                From URL
                              </Button>
                              <Button variant="outline">
                                <Image className="h-4 w-4 mr-2" />
                                Take Photo
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-4 border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Image Settings</h4>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Image Position</label>
                                <Select defaultValue="center">
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select position" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="center">Center</SelectItem>
                                    <SelectItem value="top-left">Top Left</SelectItem>
                                    <SelectItem value="top-right">Top Right</SelectItem>
                                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                                    <SelectItem value="custom">Custom Position</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Image Size</label>
                                <Select defaultValue="medium">
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select size" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="small">Small (25%)</SelectItem>
                                    <SelectItem value="medium">Medium (50%)</SelectItem>
                                    <SelectItem value="large">Large (75%)</SelectItem>
                                    <SelectItem value="original">Original Size</SelectItem>
                                    <SelectItem value="fit">Fit to Page</SelectItem>
                                    <SelectItem value="custom">Custom Size</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <label className="text-xs text-gray-500">Rotation</label>
                                  <span className="text-xs font-medium">0°</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm" onClick={() => toast({ title: "Image rotated", description: "Image rotated 90° counter-clockwise" })}>
                                    <RotateCw className="h-4 w-4 transform -scale-x-100" />
                                  </Button>
                                  <Slider
                                    defaultValue={[0]}
                                    max={360}
                                    step={1}
                                    className="flex-1"
                                  />
                                  <Button variant="outline" size="sm" onClick={() => toast({ title: "Image rotated", description: "Image rotated 90° clockwise" })}>
                                    <RotateCw className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <label className="text-xs text-gray-500">Opacity</label>
                                  <span className="text-xs font-medium">100%</span>
                                </div>
                                <Slider
                                  defaultValue={[100]}
                                  max={100}
                                  step={1}
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center mt-4 space-x-3">
                              <Toggle
                                className="data-[state=on]:bg-primary-100 data-[state=on]:text-primary-600"
                              >
                                Add Border
                              </Toggle>
                              <Toggle
                                className="data-[state=on]:bg-primary-100 data-[state=on]:text-primary-600"
                              >
                                Add Shadow
                              </Toggle>
                              <Toggle
                                className="data-[state=on]:bg-primary-100 data-[state=on]:text-primary-600"
                              >
                                Lock Position
                              </Toggle>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-md mt-4">
                            <h4 className="text-xs font-medium text-gray-700 mb-2">Image Preview</h4>
                            <div className="flex items-center justify-center bg-white rounded border h-24">
                              <div className="relative w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                                <Image className="h-10 w-10 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="annotate" className="mt-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Annotation Tools</h4>
                            <div className="grid grid-cols-5 gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Toggle 
                                      pressed={activeTool === "select"} 
                                      onPressedChange={() => handleToolChange("select")}
                                      className="h-9 w-full p-0 data-[state=on]:bg-primary-100 data-[state=on]:text-primary-600"
                                    >
                                      <MousePointer className="h-4 w-4" />
                                    </Toggle>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Select</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Toggle 
                                      pressed={activeTool === "pencil"} 
                                      onPressedChange={() => handleToolChange("pencil")}
                                      className="h-9 w-full p-0 data-[state=on]:bg-primary-100 data-[state=on]:text-primary-600"
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Toggle>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Pencil</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Toggle 
                                      pressed={activeTool === "highlighter"} 
                                      onPressedChange={() => handleToolChange("highlighter")}
                                      className="h-9 w-full p-0 data-[state=on]:bg-primary-100 data-[state=on]:text-primary-600"
                                    >
                                      <Highlighter className="h-4 w-4" />
                                    </Toggle>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Highlighter</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Toggle 
                                      pressed={activeTool === "rectangle"} 
                                      onPressedChange={() => handleToolChange("rectangle")}
                                      className="h-9 w-full p-0 data-[state=on]:bg-primary-100 data-[state=on]:text-primary-600"
                                    >
                                      <Square className="h-4 w-4" />
                                    </Toggle>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Rectangle</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Toggle 
                                      pressed={activeTool === "circle"} 
                                      onPressedChange={() => handleToolChange("circle")}
                                      className="h-9 w-full p-0 data-[state=on]:bg-primary-100 data-[state=on]:text-primary-600"
                                    >
                                      <Circle className="h-4 w-4" />
                                    </Toggle>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Circle</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Toggle 
                                      pressed={activeTool === "eraser"} 
                                      onPressedChange={() => handleToolChange("eraser")}
                                      className="h-9 w-full p-0 data-[state=on]:bg-primary-100 data-[state=on]:text-primary-600"
                                    >
                                      <Eraser className="h-4 w-4" />
                                    </Toggle>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Eraser</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Toggle 
                                      pressed={activeTool === "textSelect"} 
                                      onPressedChange={() => handleToolChange("textSelect")}
                                      className="h-9 w-full p-0 data-[state=on]:bg-primary-100 data-[state=on]:text-primary-600"
                                    >
                                      <TextSelect className="h-4 w-4" />
                                    </Toggle>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Text Selection</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Toggle 
                                      pressed={activeTool === "link"} 
                                      onPressedChange={() => handleToolChange("link")}
                                      className="h-9 w-full p-0 data-[state=on]:bg-primary-100 data-[state=on]:text-primary-600"
                                    >
                                      <Link className="h-4 w-4" />
                                    </Toggle>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Add Link</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Toggle 
                                      pressed={activeTool === "signature"} 
                                      onPressedChange={() => handleToolChange("signature")}
                                      className="h-9 w-full p-0 data-[state=on]:bg-primary-100 data-[state=on]:text-primary-600"
                                    >
                                      <FileSignature className="h-4 w-4" />
                                    </Toggle>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Signature</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Toggle 
                                      pressed={activeTool === "stamp"} 
                                      onPressedChange={() => handleToolChange("stamp")}
                                      className="h-9 w-full p-0 data-[state=on]:bg-primary-100 data-[state=on]:text-primary-600"
                                    >
                                      <Stamp className="h-4 w-4" />
                                    </Toggle>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Stamp</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                          
                          {/* Tool-specific settings */}
                          {activeTool !== "select" && (
                            <div className="mt-4 border-t pt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-3">Tool Settings</h4>
                              
                              {(activeTool === "pencil" || activeTool === "highlighter") && (
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <div className="flex justify-between items-center mb-1">
                                      <label className="text-xs text-gray-500">Stroke Width</label>
                                      <span className="text-xs font-medium">{fontSize/4}px</span>
                                    </div>
                                    <Slider
                                      value={[fontSize/4]}
                                      min={1}
                                      max={20}
                                      step={1}
                                      onValueChange={(value) => setFontSize(value[0]*4)}
                                    />
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <label className="text-xs text-gray-500">Color:</label>
                                    <input 
                                      type="color" 
                                      value={textColor} 
                                      onChange={handleTextColorChange}
                                      className="w-6 h-6 rounded-md overflow-hidden cursor-pointer"
                                    />
                                    {activeTool === "highlighter" && (
                                      <div className="flex items-center space-x-2 ml-2">
                                        <label className="text-xs text-gray-500">Opacity:</label>
                                        <Select defaultValue="50">
                                          <SelectTrigger className="w-16 h-7">
                                            <SelectValue placeholder="%" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="25">25%</SelectItem>
                                            <SelectItem value="50">50%</SelectItem>
                                            <SelectItem value="75">75%</SelectItem>
                                            <SelectItem value="100">100%</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {(activeTool === "rectangle" || activeTool === "circle") && (
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <div className="flex justify-between items-center mb-1">
                                      <label className="text-xs text-gray-500">Border Width</label>
                                      <span className="text-xs font-medium">{fontSize/4}px</span>
                                    </div>
                                    <Slider
                                      value={[fontSize/4]}
                                      min={1}
                                      max={10}
                                      step={1}
                                      onValueChange={(value) => setFontSize(value[0]*4)}
                                    />
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <label className="text-xs text-gray-500">Color:</label>
                                    <input 
                                      type="color" 
                                      value={textColor} 
                                      onChange={handleTextColorChange}
                                      className="w-6 h-6 rounded-md overflow-hidden cursor-pointer"
                                    />
                                    <div className="flex items-center space-x-2 ml-2">
                                      <label className="text-xs text-gray-500">Fill:</label>
                                      <Toggle
                                        pressed={textBold}
                                        onPressedChange={toggleBold}
                                        size="sm"
                                        className="h-7 px-2 data-[state=on]:bg-primary-100 data-[state=on]:text-primary-600"
                                      >
                                        Fill
                                      </Toggle>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {activeTool === "stamp" && (
                                <div className="grid grid-cols-3 gap-3">
                                  <Button variant="outline" size="sm" className="p-2 h-auto">
                                    <div className="text-xs text-center space-y-1">
                                      <div className="text-red-500 font-bold">APPROVED</div>
                                      <div className="text-[10px] text-gray-500">Click to select</div>
                                    </div>
                                  </Button>
                                  <Button variant="outline" size="sm" className="p-2 h-auto">
                                    <div className="text-xs text-center space-y-1">
                                      <div className="text-red-500 font-bold">REJECTED</div>
                                      <div className="text-[10px] text-gray-500">Click to select</div>
                                    </div>
                                  </Button>
                                  <Button variant="outline" size="sm" className="p-2 h-auto">
                                    <div className="text-xs text-center space-y-1">
                                      <div className="text-blue-500 font-bold">REVIEWED</div>
                                      <div className="text-[10px] text-gray-500">Click to select</div>
                                    </div>
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="bg-gray-50 p-4 rounded-md mt-4">
                            <p className="text-sm text-gray-600">
                              {activeTool === "select" && "Click on an annotation to select and modify it."}
                              {activeTool === "pencil" && "Click and drag to draw freehand on the document."}
                              {activeTool === "highlighter" && "Click and drag to highlight text on the document."}
                              {activeTool === "rectangle" && "Click and drag to draw a rectangle."}
                              {activeTool === "circle" && "Click and drag to draw a circle or ellipse."}
                              {activeTool === "eraser" && "Click on annotations to erase them."}
                              {activeTool === "textSelect" && "Click and drag to select text in the document."}
                              {activeTool === "link" && "Select text or draw a box to create a hyperlink."}
                              {activeTool === "signature" && "Click to place your signature on the document."}
                              {activeTool === "stamp" && "Click to place a stamp on the document."}
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="border border-gray-200 rounded-md h-96 bg-white overflow-hidden shadow">
                      {selectedFile ? (
                        <div className="relative w-full h-full">
                          <div className="absolute inset-0 bg-white flex flex-col">
                            <div className="bg-gray-100 p-2 border-b text-xs font-medium text-gray-700 flex items-center justify-between">
                              <span>PDF Preview: {selectedFile.fileName}</span>
                              <span>{selectedFile.pageCount} pages</span>
                            </div>
                            <div className="flex-1 flex items-center justify-center bg-gray-50 relative overflow-hidden">
                              <div className="absolute inset-0 bg-grid-gray-100 opacity-50"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white shadow-lg rounded-sm h-3/4 w-3/5 relative border border-gray-300 flex flex-col overflow-hidden">
                                  <div className="flex-1 p-6 flex items-center justify-center">
                                    {activeTab === 'text' && (
                                      <div className="w-full">
                                        <div className="w-full h-3 bg-gray-200 rounded mb-4"></div>
                                        <div className="w-3/4 h-3 bg-gray-200 rounded mb-6"></div>
                                        <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                                        <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                                        <div className="w-5/6 h-2 bg-gray-200 rounded mb-4"></div>
                                        <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                                        <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                                        <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                                      </div>
                                    )}
                                    {activeTab === 'images' && (
                                      <div className="flex flex-col items-center">
                                        <div className="w-32 h-32 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                                          <Image className="h-12 w-12 text-gray-400" />
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                                        <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                                      </div>
                                    )}
                                    {activeTab === 'annotate' && (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <svg width="200" height="100" viewBox="0 0 200 100" className="text-primary-500">
                                          <path
                                            d="M10,90 Q50,10 90,90 T170,90"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                          />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                                <div className="bg-white shadow-md rounded-md px-2 py-1.5 text-xs font-medium flex items-center space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6" 
                                            onClick={handleZoomOut}
                                            disabled={zoomLevel <= 50}
                                          >
                                            <MinusCircle className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="text-xs">Zoom Out</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    
                                    <span className="text-xs font-medium text-gray-600">{zoomLevel}%</span>
                                    
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6" 
                                            onClick={handleZoomIn}
                                            disabled={zoomLevel >= 200}
                                          >
                                            <PlusCircle className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="text-xs">Zoom In</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  
                                  <div className="h-4 border-l border-gray-200"></div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6" 
                                            onClick={handlePrevPage}
                                            disabled={currentPage <= 1}
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                              <path d="M15 18l-6-6 6-6" />
                                            </svg>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="text-xs">Previous Page</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    
                                    <span className="text-xs font-medium text-gray-600">
                                      Page {currentPage} of {selectedFile.pageCount}
                                    </span>
                                    
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6" 
                                            onClick={handleNextPage}
                                            disabled={currentPage >= selectedFile.pageCount}
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                              <path d="M9 18l6-6-6-6" />
                                            </svg>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="text-xs">Next Page</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  
                                  <div className="h-4 border-l border-gray-200"></div>
                                  
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-6 text-xs">
                                        <PanelLeft className="h-3.5 w-3.5 mr-1" />
                                        Page Options
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-56 p-2" align="end">
                                      <div className="grid gap-2">
                                        <Button variant="outline" size="sm" className="h-8 justify-start text-xs">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 8v13H3V8" />
                                            <path d="M1 3h22v5H1z" />
                                            <path d="M10 12H8v7h2v-7z" />
                                            <path d="M16 12h-2v7h2v-7z" />
                                          </svg>
                                          Delete Page
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-8 justify-start text-xs">
                                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                                          Rotate Page
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-8 justify-start text-xs">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <line x1="12" y1="8" x2="12" y2="16" />
                                            <line x1="8" y1="12" x2="16" y2="12" />
                                          </svg>
                                          Insert Blank Page
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-8 justify-start text-xs">
                                          <Square className="h-3.5 w-3.5 mr-2" />
                                          Extract Page
                                        </Button>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <Edit className="h-12 w-12 text-gray-300 mx-auto" />
                            <p className="mt-2 text-sm text-gray-500">PDF Editor Preview</p>
                            <p className="text-xs text-gray-400">Select a PDF to preview and edit</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
          
          {selectedFile && (
            <CardFooter className="flex justify-center border-t border-gray-200 px-6 py-4">
              <Button 
                onClick={handleSave}
                className="px-4 py-2"
              >
                <Save className="h-5 w-5 mr-2" />
                Save Edited PDF
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EditPDF;
