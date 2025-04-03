import { useState } from 'react';
import { FileText, HelpCircle, Download, Folder } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import PDFDropzone from '@/components/PDFDropzone';
import FileList, { FileItem } from '@/components/FileList';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { splitPdf, downloadFile, downloadSplitFilesAsZip } from '@/lib/pdf';
import { queryClient } from '@/lib/queryClient';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Type for split result
interface SplitResult {
  message: string;
  files: FileItem[];
  operation: {
    id: number;
    status: string;
    message: string;
  };
}

const SplitPDF: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [splitMode, setSplitMode] = useState('single');
  const [pageRanges, setPageRanges] = useState('');
  
  const { toast } = useToast();
  
  // Fetch all available PDFs
  const { data: allFiles, isLoading } = useQuery<FileItem[]>({
    queryKey: ['/api/files'],
    staleTime: 30000, // 30 seconds
  });
  
  // Split mutation
  const [splitResult, setSplitResult] = useState<SplitResult | null>(null);
  
  const splitMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) {
        throw new Error('Please select a file to split');
      }
      
      // Parse ranges if provided
      let ranges: string[] = [];
      if (splitMode === 'ranges' && pageRanges.trim() !== '') {
        ranges = pageRanges.split(',').map(r => r.trim());
      }
      
      // Call split API
      const result = await fetch('/api/split', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: selectedFile.id,
          options: {
            splitMode,
            ranges,
          }
        }),
        credentials: 'include',
      });
      
      if (!result.ok) {
        const error = await result.json();
        throw new Error(error.message || 'Failed to split PDF');
      }
      
      return await result.json();
    },
    onSuccess: (data) => {
      toast({
        title: "PDF split successfully",
        description: `Created ${data.files.length} new files`,
      });
      
      // Save split result for download
      setSplitResult(data);
      
      // Invalidate queries to refresh file list and activities
      queryClient.invalidateQueries({ queryKey: ['/api/files'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
    },
    onError: (error) => {
      toast({
        title: "Split failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle ZIP download
  const handleDownloadZip = async () => {
    if (!splitResult || !splitResult.files || splitResult.files.length === 0) {
      toast({
        title: "Download failed",
        description: "No split files available to download",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const fileIds = splitResult.files.map((file) => file.id);
      const originalFileName = selectedFile?.fileName || 'split-files';
      const zipFileName = `${originalFileName.replace('.pdf', '')}-split.zip`;
      
      await downloadSplitFilesAsZip(fileIds, zipFileName);
      
      toast({
        title: "Download started",
        description: "Your ZIP file is being downloaded",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to download ZIP file",
        variant: "destructive",
      });
    }
  };
  
  // Reset the form
  const handleReset = () => {
    setSelectedFile(null);
    setPageRanges('');
    setSplitResult(null);
  };
  
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
  
  // Handle page ranges change
  const handlePageRangesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageRanges(e.target.value);
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <div className="h-8 w-1.5 bg-gradient-to-b from-blue-400 to-purple-600 rounded-full mr-3"></div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Split PDF</h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mt-6 border-0 shadow-lg overflow-hidden">
          <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">Split PDF Files</CardTitle>
                <CardDescription className="text-gray-600">
                  Separate a PDF into multiple documents by pages or page ranges.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="bg-white hover:bg-gray-100">
                <HelpCircle className="h-4 w-4 mr-1 text-blue-500" />
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
                    <div className="h-4 w-1 bg-gradient-to-b from-green-400 to-cyan-400 rounded-full mr-2"></div>
                    <h3 className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-cyan-600">Or select from your files:</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {allFiles.map(file => (
                      <button
                        key={file.id}
                        className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 text-left shadow-sm transition-all duration-200 hover:shadow"
                        onClick={() => handleSelectFile(file)}
                      >
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <FileText className="h-4 w-4 text-blue-500" />
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
                      <div className="h-4 w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mr-2"></div>
                      <h3 className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Selected PDF to split:</h3>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-1 rounded-lg">
                      <FileList 
                        files={[selectedFile]} 
                        onRemove={() => setSelectedFile(null)}
                        allowReordering={false}
                      />
                    </div>
                  </div>
                  
                  {/* Options */}
                  <div className="mt-8">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="h-5 w-5 rounded-full bg-gradient-to-r from-amber-400 to-red-400 flex items-center justify-center mr-2 shadow-sm">
                          <div className="h-2 w-2 bg-white rounded-full"></div>
                        </div>
                        <h4 className="text-base font-semibold text-gray-800">Split Options</h4>
                      </div>
                      <div className="grid grid-cols-1 gap-5">
                        <div>
                          <Label htmlFor="split-mode" className="text-sm font-medium text-gray-700">Split Mode</Label>
                          <Select value={splitMode} onValueChange={setSplitMode}>
                            <SelectTrigger id="split-mode" className="mt-2 border-gray-300 bg-white">
                              <SelectValue placeholder="Select split mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">Split into single pages</SelectItem>
                              <SelectItem value="ranges">Split by page ranges</SelectItem>
                              <SelectItem value="every">Split every X pages</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {splitMode === 'ranges' && (
                          <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                            <Label htmlFor="page-ranges" className="text-sm font-medium text-gray-700">Page Ranges</Label>
                            <Input
                              id="page-ranges"
                              placeholder="e.g. 1-3,4-8,9-12"
                              value={pageRanges}
                              onChange={handlePageRangesChange}
                              className="mt-2 border-gray-300"
                            />
                            <div className="flex items-center mt-2">
                              <div className="h-3 w-3 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                                <div className="h-1.5 w-1.5 bg-amber-500 rounded-full"></div>
                              </div>
                              <p className="text-xs text-gray-600">
                                Enter page ranges separated by commas (e.g. 1-3,4-8,9-12)
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {splitMode === 'every' && (
                          <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                            <Label htmlFor="every-pages" className="text-sm font-medium text-gray-700">Split every</Label>
                            <div className="flex items-center mt-2">
                              <Input
                                id="every-pages"
                                type="number"
                                min="1"
                                defaultValue="2"
                                className="w-24 border-gray-300"
                              />
                              <span className="ml-3 text-sm text-gray-700 font-medium">pages</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
          
          {selectedFile && !splitResult && (
            <CardFooter className="flex justify-center border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-6">
              <Button 
                onClick={() => splitMutation.mutate()}
                disabled={splitMutation.isPending}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FileText className="h-5 w-5 mr-2" />
                {splitMutation.isPending ? 'Splitting...' : 'Split PDF'}
              </Button>
            </CardFooter>
          )}
          
          {splitResult && splitResult.files && splitResult.files.length > 0 && (
            <CardFooter className="flex flex-col items-center justify-center border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-6">
              <div className="mb-5">
                <div className="flex items-center justify-center bg-green-100 text-green-800 rounded-full px-4 py-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                  <p className="text-sm font-medium">
                    Successfully split into {splitResult.files.length} files
                  </p>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button
                  onClick={handleDownloadZip}
                  variant="default"
                  className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Folder className="h-5 w-5 mr-2" />
                  Download All as ZIP
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="px-5 py-2.5 border-gray-300 hover:bg-gray-100"
                >
                  Start Over
                </Button>
              </div>
              
              {splitResult.files.length > 0 && (
                <div className="mt-8 w-full">
                  <div className="flex items-center mb-3">
                    <div className="h-4 w-1 bg-gradient-to-b from-green-400 to-teal-400 rounded-full mr-2"></div>
                    <h3 className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">Split Files:</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {splitResult.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-md hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200"
                      >
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 truncate">{file.fileName}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => downloadFile(file.id)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SplitPDF;
