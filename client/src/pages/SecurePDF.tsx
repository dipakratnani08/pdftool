import { useState } from 'react';
import { Lock, HelpCircle, Shield, Eye, Key } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import PDFDropzone from '@/components/PDFDropzone';
import FileList, { FileItem } from '@/components/FileList';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SecurePDF: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [securityMode, setSecurityMode] = useState('encrypt');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [permissions, setPermissions] = useState<string[]>(['print', 'copy']);
  const [encryptionLevel, setEncryptionLevel] = useState('128');
  
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
  
  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  
  // Handle confirm password change
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };
  
  // Toggle permission
  const togglePermission = (permission: string) => {
    if (permissions.includes(permission)) {
      setPermissions(permissions.filter(p => p !== permission));
    } else {
      setPermissions([...permissions, permission]);
    }
  };
  
  // Handle secure PDF action
  const handleSecurePDF = () => {
    // Validate inputs
    if (securityMode === 'encrypt' && (!password || password !== confirmPassword)) {
      toast({
        title: "Password error",
        description: password ? "Passwords don't match" : "Password is required",
        variant: "destructive"
      });
      return;
    }
    
    // This would connect to the backend in a full implementation
    toast({
      title: "PDF security feature coming soon",
      description: "This feature is under development. Check back later!",
    });
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Secure PDF</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mt-10">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Secure PDF</CardTitle>
                <CardDescription>
                  Protect your PDF with encryption, password, or add digital signatures.
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
                        <Lock className="h-5 w-5 text-gray-400 mr-2" />
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
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Selected PDF to secure:</h3>
                    <FileList 
                      files={[selectedFile]} 
                      onRemove={() => setSelectedFile(null)}
                      allowReordering={false}
                    />
                  </div>
                  
                  {/* Security options */}
                  <div className="mt-6">
                    <Tabs defaultValue="encrypt" onValueChange={setSecurityMode} className="mb-6">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
                        <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
                        <TabsTrigger value="sign">Digital Signature</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="encrypt" className="mt-4">
                        <div className="space-y-6">
                          <div className="bg-gray-50 p-4 rounded-md">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Password Protection</h4>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="password">Set Password</Label>
                                <div className="relative mt-1">
                                  <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter password"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full"
                                    onClick={() => {
                                      const input = document.getElementById('password') as HTMLInputElement;
                                      if (input) {
                                        input.type = input.type === 'password' ? 'text' : 'password';
                                      }
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div>
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input
                                  id="confirm-password"
                                  type="password"
                                  value={confirmPassword}
                                  onChange={handleConfirmPasswordChange}
                                  placeholder="Confirm password"
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <h4 className="text-sm font-medium text-gray-700">Encryption Options</h4>
                            <div>
                              <Label htmlFor="encryption-level">Encryption Level</Label>
                              <Select value={encryptionLevel} onValueChange={setEncryptionLevel}>
                                <SelectTrigger id="encryption-level" className="mt-1">
                                  <SelectValue placeholder="Select encryption level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="40">40-bit (Acrobat 3.0 and later)</SelectItem>
                                  <SelectItem value="128">128-bit (Acrobat 5.0 and later)</SelectItem>
                                  <SelectItem value="256">256-bit AES (Acrobat 9.0 and later)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Document Permissions</h5>
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id="permission-print"
                                    checked={permissions.includes('print')}
                                    onCheckedChange={() => togglePermission('print')}
                                  />
                                  <Label htmlFor="permission-print">Allow printing</Label>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id="permission-copy"
                                    checked={permissions.includes('copy')}
                                    onCheckedChange={() => togglePermission('copy')}
                                  />
                                  <Label htmlFor="permission-copy">Allow copying text</Label>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id="permission-edit"
                                    checked={permissions.includes('edit')}
                                    onCheckedChange={() => togglePermission('edit')}
                                  />
                                  <Label htmlFor="permission-edit">Allow editing</Label>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id="permission-annotate"
                                    checked={permissions.includes('annotate')}
                                    onCheckedChange={() => togglePermission('annotate')}
                                  />
                                  <Label htmlFor="permission-annotate">Allow annotations</Label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="decrypt" className="mt-4">
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-md">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Remove Password</h4>
                            <p className="text-sm text-gray-600 mb-4">
                              Enter the current password to unlock and remove protection from your PDF.
                            </p>
                            <div>
                              <Label htmlFor="decrypt-password">Current Password</Label>
                              <div className="relative mt-1">
                                <Input
                                  id="decrypt-password"
                                  type="password"
                                  placeholder="Enter current password"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full"
                                  onClick={() => {
                                    const input = document.getElementById('decrypt-password') as HTMLInputElement;
                                    if (input) {
                                      input.type = input.type === 'password' ? 'text' : 'password';
                                    }
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="sign" className="mt-4">
                        <div className="space-y-4">
                          <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-md">
                            <div className="flex items-start">
                              <Shield className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
                              <p className="text-sm text-yellow-800">
                                Digital signatures require a certificate. Premium feature coming soon.
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-md">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Signature Information</h4>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="signature-name">Name</Label>
                                <Input
                                  id="signature-name"
                                  placeholder="Your name"
                                  className="mt-1"
                                  disabled
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="signature-reason">Reason for Signing</Label>
                                <Input
                                  id="signature-reason"
                                  placeholder="e.g. I approve this document"
                                  className="mt-1"
                                  disabled
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="signature-location">Location</Label>
                                <Input
                                  id="signature-location"
                                  placeholder="e.g. New York"
                                  className="mt-1"
                                  disabled
                                />
                              </div>
                              
                              <Button variant="outline" disabled>
                                <Key className="h-4 w-4 mr-2" />
                                Select Certificate
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </>
              )}
            </div>
          </CardContent>
          
          {selectedFile && (
            <CardFooter className="flex justify-center border-t border-gray-200 px-6 py-4">
              <Button 
                onClick={handleSecurePDF}
                className="px-4 py-2"
              >
                <Lock className="h-5 w-5 mr-2" />
                {securityMode === 'encrypt' ? 'Encrypt PDF' : 
                 securityMode === 'decrypt' ? 'Decrypt PDF' : 
                 'Sign PDF'}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SecurePDF;
