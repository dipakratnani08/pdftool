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
        <h1 className="text-2xl font-semibold text-gray-900">Compress PDF</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mt-10">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Compress PDF</CardTitle>
                <CardDescription>
                  Reduce PDF file size while maintaining quality. Great for email attachments and saving storage.
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
                        <FileOutput className="h-5 w-5 text-gray-400 mr-2" />
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
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Selected PDF to compress:</h3>
                    <FileList 
                      files={[selectedFile]} 
                      onRemove={() => {
                        setSelectedFile(null);
                        setCompressResult(null);
                      }}
                      allowReordering={false}
                    />
                  </div>
                  
                  {/* Compression Result */}
                  {compressResult && (
                    <div className="mt-6 bg-green-50 border border-green-100 rounded-md p-4">
                      <h4 className="text-sm font-medium text-green-800 mb-2">Compression Complete</h4>
                      <div className="mb-3">
                        <p className="text-sm text-green-700">{compressResult.message}</p>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" onClick={handleDownload}>
                          <Download className="h-4 w-4 mr-2" />
                          Download Compressed PDF
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Options */}
                  <div className="mt-6">
                    <div className="bg-gray-50 rounded-md p-4 mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Compression Options</h4>
                      <div className="space-y-6">
                        <div>
                          <Label>Compression Level: {getCompressionLevelText(compressionLevel)}</Label>
                          <div className="pt-4 pb-2">
                            <Slider 
                              value={[compressionLevel]} 
                              onValueChange={handleCompressionLevelChange}
                              min={10} 
                              max={100} 
                              step={10}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Better Quality</span>
                            <span>Smaller Size</span>
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
            <CardFooter className="flex justify-center border-t border-gray-200 px-6 py-4">
              <Button 
                onClick={() => compressMutation.mutate()}
                disabled={compressMutation.isPending}
                className="px-4 py-2"
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
