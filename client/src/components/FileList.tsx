import { File, FileText, ArrowUp, ArrowDown, Trash2, FileDigit, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { downloadFile } from '@/lib/pdf';

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
  
  const getFileIcon = (fileName: string) => {
    if (fileName.toLowerCase().endsWith('.pdf')) {
      return <FileText className="h-8 w-8 text-primary-500" />;
    }
    return <File className="h-8 w-8 text-primary-500" />;
  };

  if (files.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-6 space-y-3">
      {files.map((file, index) => (
        <div 
          key={file.id} 
          className="relative bg-white rounded-lg border border-gray-200 mb-3 p-4 hover:shadow-md transition-shadow duration-200 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-50 p-2 rounded-lg">
                {getFileIcon(file.fileName)}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{file.fileName}</h4>
                <div className="flex items-center mt-1 gap-2">
                  <Badge variant="outline" className="text-xs px-2 py-0 text-primary-700 bg-primary-50 border-primary-100">
                    {formatFileSize(file.originalSize)}
                  </Badge>
                  <Badge variant="outline" className="text-xs px-2 py-0 text-indigo-700 bg-indigo-50 border-indigo-100">
                    {file.pageCount} {file.pageCount === 1 ? 'Page' : 'Pages'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => downloadFile(file.id)}
                className="text-gray-400 hover:text-primary-500 focus:ring-0"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </Button>

              {allowReordering && onMoveUp && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onMoveUp(index)}
                  disabled={index === 0}
                  className="text-gray-400 hover:text-gray-600 focus:ring-0"
                  title="Move up"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              )}
              
              {allowReordering && onMoveDown && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onMoveDown(index)}
                  disabled={index === files.length - 1}
                  className="text-gray-400 hover:text-gray-600 focus:ring-0"
                  title="Move down"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              )}
              
              {onRemove && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onRemove(file.id)}
                  className="text-gray-400 hover:text-red-500 focus:ring-0"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-1 scale-x-0 group-hover:scale-x-100 bg-gradient-to-r from-primary-400 to-primary-600 transition-transform duration-300 rounded-t-lg"></div>
        </div>
      ))}
    </div>
  );
};

export default FileList;
