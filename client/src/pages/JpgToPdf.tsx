import { useState } from 'react';
import { Image, HelpCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const JpgToPdf: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(80);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  const { toast } = useToast();
  
  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    
    const files: File[] = [];
    const newPreviewUrls: string[] = [];
    
    // Filter for JPG/JPEG files only
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        files.push(file);
        
        // Create preview URL
        const url = URL.createObjectURL(file);
        newPreviewUrls.push(url);
      }
    }
    
    setSelectedFiles(prev => [...prev, ...files]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    
    // Show toast if some files were filtered out
    if (files.length < fileList.length) {
      toast({
        title: "Some files were skipped",
        description: "Only JPG/JPEG images are supported for this conversion.",
        variant: "destructive"
      });
    }
  };
  
  // Remove a file
  const removeFile = (index: number) => {
    // Clean up preview URL
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles(files => files.filter((_, i) => i !== index));
    setPreviewUrls(urls => urls.filter((_, i) => i !== index));
  };
  
  // Convert to PDF
  const handleConvert = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No images selected",
        description: "Please select at least one JPG image to convert.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Conversion initiated",
      description: "Your images are being converted to PDF. This feature is coming soon!",
    });
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">JPG to PDF Converter</h1>
        <p className="mt-2 text-gray-600">
          Convert your JPG images to PDF with customizable quality and layout options.
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mt-6">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>JPG to PDF</CardTitle>
                <CardDescription>
                  Convert your JPG images to a PDF document
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <HelpCircle className="h-4 w-4 mr-1" />
                Help
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="py-6">
            <div className="max-w-3xl mx-auto">
              {/* File Selection */}
              <div className="mb-6">
                <Label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
                  Select JPG Images
                </Label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <Image className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag and drop JPG images here, or click to select files
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports multiple files
                  </p>
                  <label htmlFor="image-upload">
                    <Button variant="outline" className="mt-4" onClick={(e) => e.stopPropagation()}>
                      Select Images
                    </Button>
                    <input 
                      id="image-upload" 
                      type="file" 
                      multiple 
                      accept=".jpg,.jpeg" 
                      className="sr-only"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
              </div>
              
              {/* Selected Images Preview */}
              {selectedFiles.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Selected Images ({selectedFiles.length})</h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-w-3 aspect-h-4 rounded-md overflow-hidden border border-gray-300">
                          <img 
                            src={url} 
                            alt={`Preview ${index + 1}`} 
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeFile(index)}
                        >
                          &times;
                        </Button>
                        <p className="mt-1 text-xs text-center truncate">
                          {selectedFiles[index].name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Settings */}
              {selectedFiles.length > 0 && (
                <div className="mt-8 border-t border-gray-200 pt-8">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Conversion Settings</h3>
                  
                  <div className="mb-6">
                    <Label htmlFor="quality" className="flex justify-between mb-2">
                      <span>Image Quality ({quality}%)</span>
                    </Label>
                    <Slider
                      id="quality"
                      min={10}
                      max={100}
                      step={5}
                      defaultValue={[quality]}
                      onValueChange={(value) => setQuality(value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Lower quality, smaller file</span>
                      <span>Higher quality, larger file</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          
          {selectedFiles.length > 0 && (
            <CardFooter className="flex justify-center border-t border-gray-200 px-6 py-4">
              <Button 
                onClick={handleConvert}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                Convert to PDF
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default JpgToPdf;