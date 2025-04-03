import { ReactNode } from 'react';
import { TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  additionalInfo?: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  progressBar?: {
    current: number;
    max: number;
    label: string;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  additionalInfo,
  trend,
  progressBar 
}) => {
  return (
    <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
      <dt className="text-sm font-medium text-gray-500 truncate">
        {title}
      </dt>
      <dd className="mt-1 text-3xl font-semibold text-gray-900">
        {value}
      </dd>
      
      {trend && (
        <dd className="mt-2 text-sm text-success-500 flex items-center">
          <TrendingUp className="h-4 w-4 mr-1" />
          {trend.value}% {trend.label}
        </dd>
      )}
      
      {progressBar && (
        <dd className="mt-2 text-sm text-gray-500">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary-500 h-2.5 rounded-full" 
              style={{ width: `${(progressBar.current / progressBar.max) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs mt-1 inline-block">{progressBar.label}</span>
        </dd>
      )}
      
      {additionalInfo && (
        <dd className="mt-2">
          {additionalInfo}
        </dd>
      )}
    </div>
  );
};

export default StatsCard;
