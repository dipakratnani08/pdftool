import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItemProps {
  id: number;
  type: string;
  message: string;
  date: string;
  icon: React.ReactNode;
  resultFileId?: number | null;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ 
  id,
  type,
  message,
  date,
  icon,
  resultFileId
}) => {
  const handleDownload = () => {
    if (resultFileId) {
      window.open(`/api/download/${resultFileId}`, '_blank');
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  return (
    <li>
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary-100 rounded-md p-2">
              {icon}
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-gray-900">{type}</h4>
              <p className="text-xs text-gray-500">{message}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-xs text-gray-500">{formatDate(date)}</span>
            {resultFileId && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleDownload}
                className="p-1 text-gray-400 hover:text-gray-500"
              >
                <Download className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default ActivityItem;
