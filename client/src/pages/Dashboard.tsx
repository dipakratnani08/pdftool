import { useQuery } from "@tanstack/react-query";
import { FilePlus2, FileText, FileOutput, FileSearch, Edit, Lock, ArrowUp, Download, FileOutput as ConvertIcon } from 'lucide-react';
import StatsCard from "@/components/StatsCard";
import PDFToolCard from "@/components/PDFToolCard";
import ActivityItem from "@/components/ActivityItem";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  
  // Fetch user statistics
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/stats'],
    staleTime: 60000, // 1 minute
  });
  
  // Fetch recent activity
  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['/api/activities'],
    staleTime: 60000, // 1 minute
  });
  
  // Prepare tool cards data
  const pdfTools = [
    {
      title: "Merge PDFs",
      description: "Combine multiple PDF files into a single document.",
      icon: FilePlus2,
      href: "/merge"
    },
    {
      title: "Split PDF",
      description: "Separate PDF pages into individual files.",
      icon: FileText,
      href: "/split"
    },
    {
      title: "Compress PDF",
      description: "Reduce file size while maintaining quality.",
      icon: FileOutput,
      href: "/compress"
    },
    {
      title: "Convert PDF",
      description: "Transform PDFs to/from various formats.",
      icon: FileSearch,
      href: "/convert"
    },
    {
      title: "Edit PDF",
      description: "Modify text, add images, and annotate PDFs.",
      icon: Edit,
      href: "/edit"
    },
    {
      title: "Secure PDF",
      description: "Encrypt, unlock, and add digital signatures.",
      icon: Lock,
      href: "/secure"
    }
  ];
  
  // Get corresponding icon for operation type
  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'merge':
        return <FilePlus2 className="h-5 w-5 text-primary-600" />;
      case 'split':
        return <FileText className="h-5 w-5 text-primary-600" />;
      case 'compress':
        return <FileOutput className="h-5 w-5 text-primary-600" />;
      case 'convert':
        return <ConvertIcon className="h-5 w-5 text-primary-600" />;
      case 'edit':
        return <Edit className="h-5 w-5 text-primary-600" />;
      case 'secure':
        return <Lock className="h-5 w-5 text-primary-600" />;
      default:
        return <FileText className="h-5 w-5 text-primary-600" />;
    }
  };
  
  // Format operation type for display
  const formatOperationType = (type: string) => {
    switch (type) {
      case 'merge':
        return 'Merged PDFs';
      case 'split':
        return 'Split PDF';
      case 'compress':
        return 'Compressed PDF';
      case 'convert':
        return 'Converted PDF';
      case 'edit':
        return 'Edited PDF';
      case 'secure':
        return 'Secured PDF';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="mt-6">
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {isLoadingStats ? (
              <>
                <Skeleton className="h-36 w-full" />
                <Skeleton className="h-36 w-full" />
                <Skeleton className="h-36 w-full" />
              </>
            ) : (
              <>
                <StatsCard 
                  title="Files Processed"
                  value={stats?.filesProcessed || 0}
                  trend={{
                    value: stats?.increasePercentage || 0,
                    label: "more than last week"
                  }}
                />
                
                <StatsCard 
                  title="Storage Used"
                  value={`${stats?.storageUsedMB.toFixed(1) || 0} MB`}
                  progressBar={{
                    current: stats?.storageUsedMB || 0,
                    max: stats?.storageLimitMB || 2048,
                    label: `${stats?.storageUsedMB.toFixed(1) || 0} MB of ${stats?.storageLimitMB / 1024 || 2} GB used`
                  }}
                />
                
                <StatsCard 
                  title="Current Plan"
                  value="Free"
                  additionalInfo={
                    <Link href="/upgrade">
                      <a className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        Upgrade to Pro →
                      </a>
                    </Link>
                  }
                />
              </>
            )}
          </dl>
        </div>
        
        {/* Tools Grid */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">PDF Tools</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pdfTools.map((tool, index) => (
              <PDFToolCard 
                key={index}
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                href={tool.href}
              />
            ))}
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="mt-10">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
            {isLoadingActivities ? (
              <div className="p-4 space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : activities && activities.length > 0 ? (
              <ul role="list" className="divide-y divide-gray-200">
                {activities.slice(0, 3).map((activity) => (
                  <ActivityItem 
                    key={activity.id}
                    id={activity.id}
                    type={formatOperationType(activity.operationType)}
                    message={activity.message}
                    date={activity.createdAt}
                    icon={getOperationIcon(activity.operationType)}
                    resultFileId={activity.resultFileId}
                  />
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-gray-500">
                No recent activity to display
              </div>
            )}
            
            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
              <Link href="/activities">
                <a className="text-sm font-medium text-primary-600 hover:text-primary-500">
                  View all activity →
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
