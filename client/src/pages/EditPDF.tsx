import { useState } from 'react';
import { Edit, HelpCircle, Save, Image, Type, Pencil } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import PDFDropzone from '@/components/PDFDropzone';
import FileList, { FileItem } from '@/components/FileList';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';

const EditPDF: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [activeTab, setActiveTab] = useState('text');
  
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
  
  // Handle save edited PDF
  const handleSave = () => {
    toast({
      title: "PDF editing feature coming soon",
      description: "This feature is under development. Check back later!",
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
                          
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm text-gray-600">
                              Click on the PDF where you want to add text, then type your content.
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="images" className="mt-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Add Image</h4>
                            <Button variant="outline">
                              <Image className="h-4 w-4 mr-2" />
                              Select Image
                            </Button>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm text-gray-600">
                              Click to select an image, then position it on the PDF document.
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="annotate" className="mt-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Annotation Tools</h4>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </Button>
                              <Button variant="outline" size="sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </Button>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm text-gray-600">
                              Select an annotation tool and draw on the PDF document.
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="border border-gray-200 rounded-md h-96 flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <Edit className="h-12 w-12 text-gray-300 mx-auto" />
                        <p className="mt-2 text-sm text-gray-500">PDF Editor Preview</p>
                        <p className="text-xs text-gray-400">PDF preview and editing coming soon</p>
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
