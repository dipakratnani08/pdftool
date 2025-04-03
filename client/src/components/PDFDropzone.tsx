import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileUp, Check, AlertCircle, Loader2 } from 'lucide-react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface PDFDropzoneProps {
  onUploadComplete: (files: any[]) => void;
  maxSize?: number; // in MB
}

const PDFDropzone: React.FC<PDFDropzoneProps> = ({ 
  onUploadComplete,
  maxSize = 50 // Default 50MB
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  
  // Simulate progress for better UX
  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + (Math.random() * 5);
      });
    }, 200);
    
    return () => clearInterval(interval);
  };
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsUploading(true);
    const cleanup = simulateProgress();
    
    try {
      // Filter only PDF files
      const pdfFiles = acceptedFiles.filter(file => 
        file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
      );
      
      if (pdfFiles.length === 0) {
        toast({
          title: "Invalid files",
          description: "Only PDF files are allowed",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size
      const oversizedFiles = pdfFiles.filter(file => file.size > maxSize * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast({
          title: "Files too large",
          description: `Maximum file size is ${maxSize}MB`,
          variant: "destructive"
        });
        return;
      }
      
      // Create form data
      const formData = new FormData();
      pdfFiles.forEach(file => {
        formData.append('files', file);
      });
      
      // Upload files
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Complete the progress
      setUploadProgress(100);
      
      toast({
        title: "Files uploaded",
        description: `Successfully uploaded ${result.files.length} file(s)`,
      });
      
      // Call the callback with the uploaded files info
      onUploadComplete(result.files);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your files",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        cleanup();
      }, 500);
    }
  }, [maxSize, onUploadComplete, toast]);
  
  const { 
    getRootProps, 
    getInputProps, 
    isDragActive, 
    isDragAccept, 
    isDragReject 
  } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: maxSize * 1024 * 1024, // Convert to bytes
    disabled: isUploading
  });
  
  let dropzoneClasses = "relative mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md";
  
  if (isDragActive && isDragAccept) {
    dropzoneClasses += " border-primary-500 bg-primary-50 shadow-md";
  } else if (isDragReject) {
    dropzoneClasses += " border-red-500 bg-red-50";
  } else if (isUploading) {
    dropzoneClasses += " border-primary-300 bg-primary-50 cursor-not-allowed";
  } else {
    dropzoneClasses += " border-gray-300 hover:border-primary-300";
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <div 
        {...getRootProps()} 
        className={dropzoneClasses}
      >
        <div className="space-y-3 text-center">
          {!isUploading ? (
            <div className="bg-primary-100 p-3 rounded-full mx-auto w-16 h-16 flex items-center justify-center">
              {isDragReject ? (
                <AlertCircle className="h-8 w-8 text-red-500" />
              ) : (
                <FileUp className="h-8 w-8 text-primary-500" />
              )}
            </div>
          ) : (
            <div className="bg-primary-100 p-3 rounded-full mx-auto w-16 h-16 flex items-center justify-center">
              {uploadProgress === 100 ? (
                <Check className="h-8 w-8 text-green-500" />
              ) : (
                <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
              )}
            </div>
          )}
          
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-medium text-gray-800">
              {isDragActive ? "Drop files here" : "Upload PDFs"}
            </h3>
            {!isUploading ? (
              <>
                <p className="text-sm text-gray-600">Drag & drop or click to browse</p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF files up to {maxSize}MB each
                </p>
              </>
            ) : (
              <div className="w-full px-4">
                <Progress value={uploadProgress} className="h-2 mt-2" />
                <p className="text-xs text-primary-600 mt-1 font-medium">
                  {uploadProgress < 100 ? "Uploading..." : "Upload complete!"}
                </p>
              </div>
            )}
          </div>
          <input {...getInputProps()} className="sr-only" />
        </div>
      </div>
    </div>
  );
};

export default PDFDropzone;
