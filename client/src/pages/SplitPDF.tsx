import { useState } from 'react';
import { FileText, HelpCircle } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import PDFDropzone from '@/components/PDFDropzone';
import FileList, { FileItem } from '@/components/FileList';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { splitPdf, downloadFile } from '@/lib/pdf';
import { queryClient } from '@/lib/queryClient';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SplitPDF: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [splitMode, setSplitMode] = useState('single');
  const [pageRanges, setPageRanges] = useState('');
  
  const { toast } = useToast();
  
  // Fetch all available PDFs
  const { data: allFiles, isLoading } = useQuery({
    queryKey: ['/api/files'],
    staleTime: 30000, // 30 seconds
  });
  
  // Split mutation
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
      
      // Reset selection
      setSelectedFile(null);
      setPageRanges('');
      
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
        <h1 className="text-2xl font-semibold text-gray-900">Split PDF</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mt-10">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Split PDF</CardTitle>
                <CardDescription>
                  Separate a PDF into multiple documents by pages or page ranges.
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
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
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
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Selected PDF to split:</h3>
                    <FileList 
                      files={[selectedFile]} 
                      onRemove={() => setSelectedFile(null)}
                      allowReordering={false}
                    />
                  </div>
                  
                  {/* Options */}
                  <div className="mt-6">
                    <div className="bg-gray-50 rounded-md p-4 mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Split Options</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="split-mode">Split Mode</Label>
                          <Select value={splitMode} onValueChange={setSplitMode}>
                            <SelectTrigger id="split-mode" className="mt-1">
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
                          <div>
                            <Label htmlFor="page-ranges">Page Ranges</Label>
                            <Input
                              id="page-ranges"
                              placeholder="e.g. 1-3,4-8,9-12"
                              value={pageRanges}
                              onChange={handlePageRangesChange}
                              className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Enter page ranges separated by commas (e.g. 1-3,4-8,9-12)
                            </p>
                          </div>
                        )}
                        
                        {splitMode === 'every' && (
                          <div>
                            <Label htmlFor="every-pages">Split every</Label>
                            <div className="flex items-center mt-1">
                              <Input
                                id="every-pages"
                                type="number"
                                min="1"
                                defaultValue="2"
                                className="w-24"
                              />
                              <span className="ml-2">pages</span>
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
          
          {selectedFile && (
            <CardFooter className="flex justify-center border-t border-gray-200 px-6 py-4">
              <Button 
                onClick={() => splitMutation.mutate()}
                disabled={splitMutation.isPending}
                className="px-4 py-2"
              >
                <FileText className="h-5 w-5 mr-2" />
                {splitMutation.isPending ? 'Splitting...' : 'Split PDF'}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SplitPDF;
