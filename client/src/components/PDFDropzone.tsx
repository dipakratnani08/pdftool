import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PDFDropzoneProps {
  onUploadComplete: (files: any[]) => void;
  maxSize?: number; // in MB
}

const PDFDropzone: React.FC<PDFDropzoneProps> = ({ 
  onUploadComplete,
  maxSize = 50 // Default 50MB
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsUploading(true);
    
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
      setIsUploading(false);
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
  });
  
  let dropzoneClasses = "mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors duration-150";
  
  if (isDragActive) {
    dropzoneClasses += " border-primary-500 bg-primary-50";
  } else if (isDragReject) {
    dropzoneClasses += " border-red-500 bg-red-50";
  } else {
    dropzoneClasses += " border-gray-300";
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <div 
        {...getRootProps()} 
        className={dropzoneClasses}
      >
        <div className="space-y-1 text-center">
          <Upload className={`mx-auto h-12 w-12 ${isUploading ? 'animate-pulse' : 'animate-[float_3s_ease-in-out_infinite]'} text-gray-400`} />
          <div className="flex text-sm text-gray-600">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
              <span>Upload PDFs</span>
              <input {...getInputProps()} className="sr-only" />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">
            PDF files up to {maxSize}MB each
          </p>
          {isUploading && (
            <p className="text-xs text-primary-500">
              Uploading files...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFDropzone;
