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
  const { data: allFiles = [], isLoading } = useQuery<FileItem[]>({
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
                    
                    <div className="border border-gray-200 rounded-md h-96 bg-white overflow-hidden shadow">
                      {selectedFile ? (
                        <div className="relative w-full h-full">
                          <div className="absolute inset-0 bg-white flex flex-col">
                            <div className="bg-gray-100 p-2 border-b text-xs font-medium text-gray-700 flex items-center justify-between">
                              <span>PDF Preview: {selectedFile.fileName}</span>
                              <span>{selectedFile.pageCount} pages</span>
                            </div>
                            <div className="flex-1 flex items-center justify-center bg-gray-50 relative overflow-hidden">
                              <div className="absolute inset-0 bg-grid-gray-100 opacity-50"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white shadow-lg rounded-sm h-3/4 w-3/5 relative border border-gray-300 flex flex-col overflow-hidden">
                                  <div className="flex-1 p-6 flex items-center justify-center">
                                    {activeTab === 'text' && (
                                      <div className="w-full">
                                        <div className="w-full h-3 bg-gray-200 rounded mb-4"></div>
                                        <div className="w-3/4 h-3 bg-gray-200 rounded mb-6"></div>
                                        <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                                        <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                                        <div className="w-5/6 h-2 bg-gray-200 rounded mb-4"></div>
                                        <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                                        <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                                        <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                                      </div>
                                    )}
                                    {activeTab === 'images' && (
                                      <div className="flex flex-col items-center">
                                        <div className="w-32 h-32 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                                          <Image className="h-12 w-12 text-gray-400" />
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                                        <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                                      </div>
                                    )}
                                    {activeTab === 'annotate' && (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <svg width="200" height="100" viewBox="0 0 200 100" className="text-primary-500">
                                          <path
                                            d="M10,90 Q50,10 90,90 T170,90"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                          />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-md rounded-md px-3 py-1.5 text-xs font-medium flex items-center space-x-4">
                                <button className="flex items-center space-x-1 text-gray-600 hover:text-primary-500">
                                  <span>Zoom</span>
                                </button>
                                <button className="flex items-center space-x-1 text-gray-600 hover:text-primary-500">
                                  <span>Page 1 of {selectedFile.pageCount}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <Edit className="h-12 w-12 text-gray-300 mx-auto" />
                            <p className="mt-2 text-sm text-gray-500">PDF Editor Preview</p>
                            <p className="text-xs text-gray-400">Select a PDF to preview and edit</p>
                          </div>
                        </div>
                      )}
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
