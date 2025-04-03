import { useState } from 'react';
import { FileSearch, HelpCircle, ArrowRightLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import PDFDropzone from '@/components/PDFDropzone';
import FileList, { FileItem } from '@/components/FileList';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ConvertPDF: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [targetFormat, setTargetFormat] = useState('docx');
  const [conversionMode, setConversionMode] = useState('toPdf'); // toPdf or fromPdf
  
  const { toast } = useToast();
  
  // Fetch all available PDFs
  const { data: allFiles, isLoading } = useQuery({
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
  
  // Handle conversion
  const handleConvert = () => {
    toast({
      title: "Conversion feature coming soon",
      description: "This feature is under development. Check back later!",
    });
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Convert PDF</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mt-10">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Convert PDF</CardTitle>
                <CardDescription>
                  Convert PDFs to and from other file formats like Word, Excel, and images.
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
              <Tabs defaultValue="fromPdf" onValueChange={setConversionMode} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="fromPdf">PDF to Other Format</TabsTrigger>
                  <TabsTrigger value="toPdf">Other Format to PDF</TabsTrigger>
                </TabsList>
                
                <TabsContent value="fromPdf" className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Convert your PDF document to another format</h3>
                  
                  {/* Dropzone */}
                  {!selectedFile && (
                    <PDFDropzone onUploadComplete={handleUploadComplete} />
                  )}
                  
                  {/* Format selection */}
                  <div className="mt-6">
                    <Label htmlFor="target-format">Target Format</Label>
                    <Select value={targetFormat} onValueChange={setTargetFormat}>
                      <SelectTrigger id="target-format" className="mt-1">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="docx">Word Document (.docx)</SelectItem>
                        <SelectItem value="xlsx">Excel Spreadsheet (.xlsx)</SelectItem>
                        <SelectItem value="pptx">PowerPoint Presentation (.pptx)</SelectItem>
                        <SelectItem value="jpg">JPG Image (.jpg)</SelectItem>
                        <SelectItem value="png">PNG Image (.png)</SelectItem>
                        <SelectItem value="txt">Text File (.txt)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                
                <TabsContent value="toPdf" className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Convert your document to PDF format</h3>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <FileSearch className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Upload your document to convert to PDF
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: DOCX, XLSX, PPTX, JPG, PNG, TXT
                    </p>
                    <Button className="mt-4" variant="outline">
                      Select File
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Selected file */}
              {selectedFile && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Selected file to convert:</h3>
                  <FileList 
                    files={[selectedFile]} 
                    onRemove={() => setSelectedFile(null)}
                    allowReordering={false}
                  />
                </div>
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
                        <FileSearch className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm truncate">{file.fileName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          
          {selectedFile && (
            <CardFooter className="flex justify-center border-t border-gray-200 px-6 py-4">
              <Button 
                onClick={handleConvert}
                className="px-4 py-2"
              >
                <ArrowRightLeft className="h-5 w-5 mr-2" />
                Convert {conversionMode === 'fromPdf' ? 'to ' + targetFormat.toUpperCase() : 'to PDF'}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ConvertPDF;
