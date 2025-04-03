import { File, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface FileItem {
  id: number;
  fileName: string;
  originalSize: number;
  pageCount: number;
}

interface FileListProps {
  files: FileItem[];
  onRemove?: (id: number) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  allowReordering?: boolean;
}

const FileList: React.FC<FileListProps> = ({ 
  files, 
  onRemove, 
  onMoveUp, 
  onMoveDown,
  allowReordering = true
}) => {
  // Format file size to human-readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };
  
  if (files.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-6">
      {files.map((file, index) => (
        <div key={file.id} className="relative bg-white rounded-lg border border-gray-300 mb-3 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <File className="h-10 w-10 text-primary-500" />
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">{file.fileName}</h4>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.originalSize)} • {file.pageCount} {file.pageCount === 1 ? 'Page' : 'Pages'}
                </p>
              </div>
            </div>
            <div className="flex">
              {allowReordering && onMoveUp && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onMoveUp(index)}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-500"
                >
                  <ArrowUp className="h-5 w-5" />
                </Button>
              )}
              
              {allowReordering && onMoveDown && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onMoveDown(index)}
                  disabled={index === files.length - 1}
                  className="ml-2 p-1 text-gray-400 hover:text-gray-500"
                >
                  <ArrowDown className="h-5 w-5" />
                </Button>
              )}
              
              {onRemove && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onRemove(file.id)}
                  className="ml-2 p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;
