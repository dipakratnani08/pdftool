import { useState } from 'react';
import { FileSearch, HelpCircle, ArrowRight, Image } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import PDFDropzone from '@/components/PDFDropzone';
import FileList, { FileItem } from '@/components/FileList';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const PdfToJpg: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [imageQuality, setImageQuality] = useState(80);
  const [conversionType, setConversionType] = useState('all-pages'); // all-pages or selected
  
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
    if (!selectedFile) {
      toast({
        title: "No PDF selected",
        description: "Please select a PDF file to convert.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Conversion initiated",
      description: "Your PDF is being converted to JPG images. This feature is coming soon!",
    });
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">PDF to JPG Converter</h1>
        <p className="mt-2 text-gray-600">
          Convert each page of your PDF to high-quality JPG images.
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mt-6">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>PDF to JPG</CardTitle>
                <CardDescription>
                  Extract JPG images from your PDF document
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
              
              {/* Selected file */}
              {selectedFile && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Selected PDF to convert:</h3>
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
              
              {/* Settings for conversion */}
              {selectedFile && (
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Conversion Settings</h3>
                  
                  <div className="mb-6">
                    <Label className="text-sm font-medium text-gray-700 mb-2">Pages to Convert</Label>
                    <RadioGroup 
                      defaultValue={conversionType} 
                      onValueChange={setConversionType}
                      className="flex flex-col space-y-2 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all-pages" id="all-pages" />
                        <Label htmlFor="all-pages">All Pages ({selectedFile.pageCount} pages)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="selected" id="selected" />
                        <Label htmlFor="selected">Selected Pages</Label>
                      </div>
                    </RadioGroup>
                    
                    {conversionType === 'selected' && (
                      <div className="ml-6 mt-2">
                        <p className="text-sm text-gray-600">
                          Enter page numbers separated by commas (e.g., 1,3,5-7)
                        </p>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="1,3,5-7"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <Label htmlFor="quality" className="flex justify-between mb-2">
                      <span>Image Quality ({imageQuality}%)</span>
                    </Label>
                    <Slider
                      id="quality"
                      min={10}
                      max={100}
                      step={5}
                      defaultValue={[imageQuality]}
                      onValueChange={(value) => setImageQuality(value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Lower quality, smaller files</span>
                      <span>Higher quality, larger files</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          
          {selectedFile && (
            <CardFooter className="flex justify-center border-t border-gray-200 px-6 py-4">
              <Button 
                onClick={handleConvert}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                <Image className="h-5 w-5 mr-2" />
                Convert to JPG
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PdfToJpg;