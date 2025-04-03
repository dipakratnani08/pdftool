import { useState } from 'react';
import { FileOutput, HelpCircle, Download } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import PDFDropzone from '@/components/PDFDropzone';
import FileList, { FileItem } from '@/components/FileList';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { compressPdf, downloadFile } from '@/lib/pdf';
import { queryClient } from '@/lib/queryClient';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const CompressPDF: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [compressionLevel, setCompressionLevel] = useState(70); // Default to medium
  const [compressResult, setCompressResult] = useState<any>(null);
  
  const { toast } = useToast();
  
  // Fetch all available PDFs
  const { data: allFiles, isLoading } = useQuery({
    queryKey: ['/api/files'],
    staleTime: 30000, // 30 seconds
  });
  
  // Compress mutation
  const compressMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) {
        throw new Error('Please select a file to compress');
      }
      
      // Call compress API
      const result = await fetch('/api/compress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: selectedFile.id,
          options: {
            quality: compressionLevel,
          }
        }),
        credentials: 'include',
      });
      
      if (!result.ok) {
        const error = await result.json();
        throw new Error(error.message || 'Failed to compress PDF');
      }
      
      return await result.json();
    },
    onSuccess: (data) => {
      toast({
        title: "PDF compressed successfully",
        description: data.message,
      });
      
      setCompressResult(data);
      
      // Invalidate queries to refresh file list and activities
      queryClient.invalidateQueries({ queryKey: ['/api/files'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
    },
    onError: (error) => {
      toast({
        title: "Compression failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle file upload
  const handleUploadComplete = (uploadedFiles: FileItem[]) => {
    if (uploadedFiles.length > 0) {
      setSelectedFile(uploadedFiles[0]);
      setCompressResult(null); // Reset result when changing file
    }
  };
  
  // Handle file selection
  const handleSelectFile = (file: FileItem) => {
    setSelectedFile(file);
    setCompressResult(null); // Reset result when changing file
  };
  
  // Handle compression level change
  const handleCompressionLevelChange = (value: number[]) => {
    setCompressionLevel(value[0]);
  };
  
  // Handle download
  const handleDownload = () => {
    if (compressResult && compressResult.file) {
      downloadFile(compressResult.file.id);
    }
  };
  
  // Get compression level text
  const getCompressionLevelText = (level: number) => {
    if (level < 30) return 'Low (better quality, larger file)';
    if (level < 70) return 'Medium (balanced quality and size)';
    return 'High (smaller file, potentially lower quality)';
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <div className="h-8 w-1.5 bg-gradient-to-b from-green-400 to-emerald-600 rounded-full mr-3"></div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">Compress PDF</h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mt-6 border-0 shadow-lg overflow-hidden">
          <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">Optimize PDF Size</CardTitle>
                <CardDescription className="text-gray-600">
                  Reduce PDF file size while maintaining quality. Great for email attachments and saving storage.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="bg-white hover:bg-gray-100">
                <HelpCircle className="h-4 w-4 mr-1 text-green-500" />
                Help
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="py-8">
            <div className="max-w-2xl mx-auto">
              {/* Dropzone */}
              {!selectedFile && (
                <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gradient-to-b from-white to-gray-50 overflow-hidden">
                  <PDFDropzone onUploadComplete={handleUploadComplete} />
                </div>
              )}
              
              {/* Existing files selection */}
              {!selectedFile && allFiles && allFiles.length > 0 && (
                <div className="mt-8 mb-6">
                  <div className="flex items-center mb-3">
                    <div className="h-4 w-1 bg-gradient-to-b from-green-400 to-emerald-400 rounded-full mr-2"></div>
                    <h3 className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">Or select from your files:</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {allFiles.map(file => (
                      <button
                        key={file.id}
                        className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 text-left shadow-sm transition-all duration-200 hover:shadow"
                        onClick={() => handleSelectFile(file)}
                      >
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <FileOutput className="h-4 w-4 text-green-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 truncate">{file.fileName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Selected file */}
              {selectedFile && (
                <>
                  <div className="mt-6">
                    <div className="flex items-center mb-3">
                      <div className="h-4 w-1 bg-gradient-to-b from-green-400 to-emerald-400 rounded-full mr-2"></div>
                      <h3 className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">Selected PDF to compress:</h3>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-1 rounded-lg">
                      <FileList 
                        files={[selectedFile]} 
                        onRemove={() => {
                          setSelectedFile(null);
                          setCompressResult(null);
                        }}
                        allowReordering={false}
                      />
                    </div>
                  </div>
                  
                  {/* Compression Result */}
                  {compressResult && (
                    <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg p-5 shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="h-5 w-5 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center mr-2 shadow-sm">
                          <div className="h-2 w-2 bg-white rounded-full"></div>
                        </div>
                        <h4 className="text-base font-semibold text-gray-800">Compression Complete!</h4>
                      </div>
                      <div className="mb-4 pl-7">
                        <p className="text-sm text-green-700">{compressResult.message}</p>
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          variant="default" 
                          onClick={handleDownload}
                          className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Compressed PDF
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Options */}
                  <div className="mt-8">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="h-5 w-5 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center mr-2 shadow-sm">
                          <div className="h-2 w-2 bg-white rounded-full"></div>
                        </div>
                        <h4 className="text-base font-semibold text-gray-800">Compression Options</h4>
                      </div>
                      <div className="space-y-6 pl-7">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Compression Level: <span className="font-semibold text-green-600">{getCompressionLevelText(compressionLevel)}</span></Label>
                          <div className="pt-4 pb-2">
                            <Slider 
                              value={[compressionLevel]} 
                              onValueChange={handleCompressionLevelChange}
                              min={10} 
                              max={100} 
                              step={10}
                              className="[&>span:nth-child(3)]:bg-gradient-to-r [&>span:nth-child(3)]:from-green-500 [&>span:nth-child(3)]:to-emerald-500"
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-green-200 mr-1"></div>
                              Better Quality
                            </span>
                            <span className="flex items-center">
                              Smaller Size
                              <div className="h-2 w-2 rounded-full bg-emerald-400 ml-1"></div>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
          
          {selectedFile && !compressResult && (
            <CardFooter className="flex justify-center border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-6">
              <Button 
                onClick={() => compressMutation.mutate()}
                disabled={compressMutation.isPending}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FileOutput className="h-5 w-5 mr-2" />
                {compressMutation.isPending ? 'Compressing...' : 'Compress PDF'}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CompressPDF;
