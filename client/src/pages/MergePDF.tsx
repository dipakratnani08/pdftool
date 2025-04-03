import { useState } from 'react';
import { FilePlus2, HelpCircle } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import PDFDropzone from '@/components/PDFDropzone';
import FileList, { FileItem } from '@/components/FileList';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { mergePdfs, downloadFile } from '@/lib/pdf';
import { queryClient } from '@/lib/queryClient';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const MergePDF: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
  const [mergeMode, setMergeMode] = useState('all');
  const [orientation, setOrientation] = useState('auto');
  const [includeBookmarks, setIncludeBookmarks] = useState(true);
  
  const { toast } = useToast();
  
  // Fetch all available PDFs
  const { data: allFiles, isLoading } = useQuery({
    queryKey: ['/api/files'],
    staleTime: 30000, // 30 seconds
  });
  
  // Merge mutation
  const mergeMutation = useMutation({
    mutationFn: async () => {
      if (selectedFiles.length < 2) {
        throw new Error('Please select at least 2 files to merge');
      }
      
      // Get array of file IDs
      const fileIds = selectedFiles.map(file => file.id);
      
      // Call merge API
      const result = await fetch('/api/merge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileIds,
          options: {
            mergeMode,
            orientation,
            includeBookmarks,
          }
        }),
        credentials: 'include',
      });
      
      if (!result.ok) {
        const error = await result.json();
        throw new Error(error.message || 'Failed to merge PDFs');
      }
      
      return await result.json();
    },
    onSuccess: (data) => {
      toast({
        title: "PDFs merged successfully",
        description: `Created a new PDF with ${data.file.pageCount} pages`,
      });
      
      // Download the merged file
      if (data.file && data.file.id) {
        downloadFile(data.file.id);
      }
      
      // Reset selection
      setSelectedFiles([]);
      
      // Invalidate queries to refresh file list and activities
      queryClient.invalidateQueries({ queryKey: ['/api/files'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
    },
    onError: (error) => {
      toast({
        title: "Merge failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle file upload
  const handleUploadComplete = (uploadedFiles: FileItem[]) => {
    // Add uploaded files to selected files
    setSelectedFiles(prev => [...prev, ...uploadedFiles]);
  };
  
  // Handle file removal
  const handleRemoveFile = (id: number) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== id));
  };
  
  // Handle file reordering
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    
    const newFiles = [...selectedFiles];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index - 1];
    newFiles[index - 1] = temp;
    
    setSelectedFiles(newFiles);
  };
  
  const handleMoveDown = (index: number) => {
    if (index >= selectedFiles.length - 1) return;
    
    const newFiles = [...selectedFiles];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index + 1];
    newFiles[index + 1] = temp;
    
    setSelectedFiles(newFiles);
  };
  
  // Add an existing file to selection
  const handleAddExistingFile = (file: FileItem) => {
    const isAlreadySelected = selectedFiles.some(sf => sf.id === file.id);
    
    if (!isAlreadySelected) {
      setSelectedFiles(prev => [...prev, file]);
    } else {
      toast({
        title: "File already selected",
        description: `${file.fileName} is already in your selection`,
        variant: "default",
      });
    }
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Merge PDFs</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mt-10">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Merge PDFs</CardTitle>
                <CardDescription>
                  Combine multiple PDF files into a single document. Drag and drop to reorder pages.
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
              <PDFDropzone onUploadComplete={handleUploadComplete} />
              
              {/* Existing files selection */}
              {allFiles && allFiles.length > 0 && (
                <div className="mt-8 mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Or select from your files:</h3>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {allFiles.map(file => (
                      <button
                        key={file.id}
                        className="flex items-center p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-left"
                        onClick={() => handleAddExistingFile(file)}
                      >
                        <FilePlus2 className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm truncate">{file.fileName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Selected files list */}
              {selectedFiles.length > 0 && (
                <>
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Selected files to merge ({selectedFiles.length}):</h3>
                    <FileList 
                      files={selectedFiles} 
                      onRemove={handleRemoveFile}
                      onMoveUp={handleMoveUp}
                      onMoveDown={handleMoveDown}
                    />
                  </div>
                  
                  {/* Options */}
                  <div className="mt-6">
                    <div className="bg-gray-50 rounded-md p-4 mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Merge Options</h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="merge-mode">Merge Mode</Label>
                          <Select value={mergeMode} onValueChange={setMergeMode}>
                            <SelectTrigger id="merge-mode" className="mt-1">
                              <SelectValue placeholder="Select merge mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All pages (default)</SelectItem>
                              <SelectItem value="selected">Selected pages only</SelectItem>
                              <SelectItem value="interleave">Interleave pages</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="orientation">Page Orientation</Label>
                          <Select value={orientation} onValueChange={setOrientation}>
                            <SelectTrigger id="orientation" className="mt-1">
                              <SelectValue placeholder="Select orientation" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="auto">Auto-detect</SelectItem>
                              <SelectItem value="portrait">Force portrait</SelectItem>
                              <SelectItem value="landscape">Force landscape</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-start">
                          <Checkbox 
                            id="bookmarks" 
                            checked={includeBookmarks}
                            onCheckedChange={(checked) => setIncludeBookmarks(!!checked)}
                            className="h-4 w-4 mt-1"
                          />
                          <div className="ml-3 text-sm">
                            <Label htmlFor="bookmarks" className="font-medium text-gray-700">Include bookmarks</Label>
                            <p className="text-gray-500">Transfer existing bookmarks to the merged PDF</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
          
          {selectedFiles.length > 0 && (
            <CardFooter className="flex justify-center border-t border-gray-200 px-6 py-4">
              <Button 
                onClick={() => mergeMutation.mutate()}
                disabled={selectedFiles.length < 2 || mergeMutation.isPending}
                className="px-4 py-2"
              >
                <FilePlus2 className="h-5 w-5 mr-2" />
                {mergeMutation.isPending ? 'Merging...' : 'Merge PDFs'}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MergePDF;
