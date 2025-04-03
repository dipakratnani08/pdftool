import { useState, useEffect } from 'react';
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
  Bold as BoldIcon, 
  Italic as ItalicIcon, 
  Underline as UnderlineIcon, 
  AlignLeft as AlignLeftIcon, 
  AlignCenter as AlignCenterIcon, 
  AlignRight as AlignRightIcon, 
  Eraser, 
  MousePointer, 
  Stamp, 
  FileSignature, 
  Link,
  PlusCircle,
  MinusCircle,
  PanelLeft,
  RotateCw,
  AlertCircle
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
import { getFileBlob, generatePdfPreview } from '@/lib/pdf';

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
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // Fetch all available PDFs
  const { data: allFiles = [], isLoading } = useQuery<FileItem[]>({
    queryKey: ['/api/files'],
    staleTime: 30000, // 30 seconds
  });
  
  // Generate PDF preview when selected file or page changes
  useEffect(() => {
    // Reset preview state when a file is deselected
    if (!selectedFile) {
      setPdfPreview(null);
      setPdfFile(null);
      setPreviewError(null);
      return;
    }
    
    const loadPdfPreview = async () => {
      try {
        setIsLoadingPreview(true);
        setPreviewError(null);
        
        // Get the PDF file from the server
        const blob = await getFileBlob(selectedFile.id);
        const file = new File([blob], selectedFile.fileName, { type: 'application/pdf' });
        setPdfFile(file);
        
        // Generate preview for the current page
        const dataUrl = await generatePdfPreview(file, currentPage);
        setPdfPreview(dataUrl);
      } catch (error) {
        console.error('Error generating PDF preview:', error);
        setPreviewError(error instanceof Error ? error.message : 'Failed to generate PDF preview');
        setPdfPreview(null);
      } finally {
        setIsLoadingPreview(false);
      }
    };
    
    loadPdfPreview();
  }, [selectedFile, currentPage]);
  
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
        
        <Card className="mt-6">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Edit PDF</CardTitle>
                <CardDescription>
                  Modify text, add images, and annotate your PDF documents. 100% Free!
                </CardDescription>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                Free Forever
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="py-6">
            <div className="max-w-5xl mx-auto">
              {/* Dropzone */}
              {!selectedFile && (
                <PDFDropzone onUploadComplete={handleUploadComplete} />
              )}
              
              {/* Selected file */}
              {selectedFile && (
                <>
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Selected PDF:</h3>
                    <FileList 
                      files={[selectedFile]} 
                      onRemove={() => setSelectedFile(null)}
                      allowReordering={false}
                    />
                  </div>
                  
                  {/* Editor interface */}
                  <div className="mt-6 border rounded-lg overflow-hidden">
                    {/* Toolbar */}
                    <div className="bg-gray-50 border-b border-gray-200 p-3 flex items-center space-x-4">
                      <Tabs defaultValue="text" onValueChange={setActiveTab} className="w-auto">
                        <TabsList>
                          <TabsTrigger value="text" className="text-xs">
                            <Type className="h-3.5 w-3.5 mr-1" />
                            Text
                          </TabsTrigger>
                          <TabsTrigger value="images" className="text-xs">
                            <Image className="h-3.5 w-3.5 mr-1" />
                            Images
                          </TabsTrigger>
                          <TabsTrigger value="annotate" className="text-xs">
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            Annotate
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                      
                      <div className="h-6 border-l border-gray-300"></div>
                      
                      {/* Text Formatting Controls - Only show when text tab is active */}
                      {activeTab === 'text' && (
                        <div className="flex items-center space-x-2">
                          <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
                            <SelectTrigger className="h-8 text-xs w-32">
                              <SelectValue placeholder="Font" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Arial">Arial</SelectItem>
                              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                              <SelectItem value="Courier">Courier</SelectItem>
                              <SelectItem value="Helvetica">Helvetica</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Select value={fontSize.toString()} onValueChange={(v) => setFontSize(parseInt(v))}>
                            <SelectTrigger className="h-8 text-xs w-16">
                              <SelectValue placeholder="Size" />
                            </SelectTrigger>
                            <SelectContent>
                              {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72].map(size => (
                                <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <div className="flex items-center space-x-1">
                            <Toggle 
                              pressed={textBold} 
                              onPressedChange={toggleBold}
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <BoldIcon className="h-3.5 w-3.5" />
                            </Toggle>
                            
                            <Toggle 
                              pressed={textItalic} 
                              onPressedChange={toggleItalic}
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <ItalicIcon className="h-3.5 w-3.5" />
                            </Toggle>
                            
                            <Toggle 
                              pressed={textUnderline} 
                              onPressedChange={toggleUnderline}
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <UnderlineIcon className="h-3.5 w-3.5" />
                            </Toggle>
                          </div>
                          
                          <input 
                            type="color" 
                            value={textColor} 
                            onChange={handleTextColorChange}
                            className="w-8 h-8 rounded-md overflow-hidden cursor-pointer"
                          />
                        </div>
                      )}
                      
                      {/* Image Controls - Only show when images tab is active */}
                      {activeTab === 'images' && (
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            <PlusCircle className="h-3.5 w-3.5 mr-1" />
                            Add Image
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            <Square className="h-3.5 w-3.5 mr-1" />
                            Crop
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            <RotateCw className="h-3.5 w-3.5 mr-1" />
                            Rotate
                          </Button>
                        </div>
                      )}
                      
                      {/* Annotation Controls - Only show when annotate tab is active */}
                      {activeTab === 'annotate' && (
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            Draw
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            <Highlighter className="h-3.5 w-3.5 mr-1" />
                            Highlight
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            <Stamp className="h-3.5 w-3.5 mr-1" />
                            Stamp
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            <FileSignature className="h-3.5 w-3.5 mr-1" />
                            Sign
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {/* PDF Preview Area */}
                    <div className="relative">
                      <div className="bg-gray-100 p-2 border-b text-xs font-medium text-gray-700 flex items-center justify-between">
                        <span>PDF Preview: {selectedFile.fileName}</span>
                        <span>{selectedFile.pageCount} pages</span>
                      </div>
                      
                      <div className="flex-1 h-[500px] flex items-center justify-center bg-gray-50 relative overflow-hidden">
                        {/* Grid background */}
                        <div className="absolute inset-0 bg-grid-gray-100 opacity-20"></div>
                        
                        {/* Preview content */}
                        <div className="relative flex items-center justify-center w-full h-full">
                          {/* Loading state */}
                          {isLoadingPreview && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                              <div className="flex flex-col items-center">
                                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                                <span className="text-sm text-gray-600">Loading PDF preview...</span>
                              </div>
                            </div>
                          )}
                          
                          {/* Error state */}
                          {previewError && (
                            <div className="flex flex-col items-center justify-center p-6 text-center">
                              <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
                              <h3 className="text-lg font-medium text-red-700 mb-1">Preview Error</h3>
                              <p className="text-sm text-gray-600 max-w-md">{previewError}</p>
                            </div>
                          )}
                          
                          {/* PDF Preview */}
                          {pdfPreview && !isLoadingPreview && !previewError && (
                            <div className="w-full h-full flex items-center justify-center p-4">
                              <iframe
                                src={pdfPreview}
                                title="PDF Preview"
                                className="shadow-lg border border-gray-300 rounded-sm"
                                style={{ 
                                  width: `${zoomLevel}%`, 
                                  height: `${zoomLevel}%`,
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  background: 'white'
                                }}
                              />
                            </div>
                          )}
                          
                          {/* Empty state */}
                          {!pdfPreview && !isLoadingPreview && !previewError && (
                            <div className="bg-white shadow-lg rounded-sm h-3/4 w-3/5 relative border border-gray-300 flex flex-col overflow-hidden">
                              <div className="flex-1 p-6 flex items-center justify-center">
                                <div className="text-center">
                                  <p className="text-sm text-gray-500">PDF preview not available</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Page controls */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                          <div className="bg-white shadow-md rounded-md px-2 py-1.5 text-xs font-medium flex items-center space-x-4">
                            {/* Zoom controls */}
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6" 
                                onClick={handleZoomOut}
                                disabled={zoomLevel <= 50}
                              >
                                <MinusCircle className="h-4 w-4" />
                              </Button>
                              
                              <span className="text-xs font-medium text-gray-600">{zoomLevel}%</span>
                              
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6" 
                                onClick={handleZoomIn}
                                disabled={zoomLevel >= 200}
                              >
                                <PlusCircle className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="h-4 border-l border-gray-200"></div>
                            
                            {/* Page navigation */}
                            <div className="flex items-center space-x-2">
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
                              
                              <span className="text-xs font-medium text-gray-600">
                                Page {currentPage} of {selectedFile.pageCount}
                              </span>
                              
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
                            </div>
                          </div>
                        </div>
                      </div>
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
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600"
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