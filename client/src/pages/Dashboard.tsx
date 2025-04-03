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
  
  // Get corresponding icon for operation type with feature-specific colors
  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'merge':
        return <FilePlus2 className="h-5 w-5 text-blue-500" />;
      case 'split':
        return <FileText className="h-5 w-5 text-purple-500" />;
      case 'compress':
        return <FileOutput className="h-5 w-5 text-green-500" />;
      case 'convert':
        return <ConvertIcon className="h-5 w-5 text-orange-500" />;
      case 'edit':
        return <Edit className="h-5 w-5 text-amber-500" />;
      case 'secure':
        return <Lock className="h-5 w-5 text-red-500" />;
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
        <div className="flex items-center">
          <div className="h-8 w-1.5 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full mr-3 animate-pulse-slow"></div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 animate-gradient-text">Dashboard</h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 -mt-20 -mr-20 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-600">
              <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
            </svg>
          </div>
          
          <div className="relative">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Welcome to PDFCore Tools</h2>
            <p className="text-blue-700 max-w-2xl">
              Your all-in-one platform for managing, editing, and converting PDF documents. 
              Use our comprehensive toolkit to manipulate your PDFs with just a few clicks.
            </p>
            <div className="mt-4 flex space-x-3">
              <Link href="/merge">
                <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 btn-animation hover-card-lift">
                  <FilePlus2 className="mr-2 h-4 w-4" />
                  Start Merging
                </a>
              </Link>
              <Link href="/compress">
                <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover-card-lift">
                  <FileOutput className="mr-2 h-4 w-4" />
                  Compress a PDF
                </a>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <div className="h-4 w-1 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-full mr-2"></div>
            <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Your Statistics</h2>
          </div>
          
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
                  icon={<FileText className="h-5 w-5 text-blue-500" />}
                  trend={{
                    value: stats?.increasePercentage || 0,
                    label: "more than last week"
                  }}
                />
                
                <StatsCard 
                  title="Storage Used"
                  value={`${stats?.storageUsedMB.toFixed(1) || 0} MB`}
                  icon={<FileOutput className="h-5 w-5 text-green-500" />}
                  progressBar={{
                    current: stats?.storageUsedMB || 0,
                    max: stats?.storageLimitMB || 2048,
                    label: `${stats?.storageUsedMB.toFixed(1) || 0} MB of ${stats?.storageLimitMB / 1024 || 2} GB used`
                  }}
                />
                
                <StatsCard 
                  title="Current Plan"
                  value="Free"
                  icon={<ArrowUp className="h-5 w-5 text-purple-500" />}
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
        <div className="mt-10">
          <div className="flex items-center mb-4">
            <div className="h-4 w-1 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-full mr-2"></div>
            <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">PDF Tools</h2>
          </div>
          
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="flex items-center mb-4">
            <div className="h-4 w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mr-2"></div>
            <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Recent Activity</h2>
          </div>
          
          <div className="mt-4 bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
            {isLoadingActivities ? (
              <div className="p-4 space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : activities && activities.length > 0 ? (
              <ul role="list" className="divide-y divide-gray-100">
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
              <div className="p-6 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-3">
                  <FileText className="h-8 w-8 text-indigo-300" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">No activity yet</h3>
                <p className="text-sm text-gray-500">
                  Start processing PDFs to track your activity here.
                </p>
              </div>
            )}
            
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 text-right sm:px-6 border-t border-gray-200">
              <Link href="/activities">
                <a className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                  View all activity
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
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
