import { Link } from 'wouter';
import { LucideIcon } from 'lucide-react';

interface PDFToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

const PDFToolCard: React.FC<PDFToolCardProps> = ({ title, description, icon: Icon, href }) => {
  // Determine tool-specific colors based on title
  const getGradient = () => {
    switch(true) {
      case title.includes("Merge"):
        return {
          bg: "from-blue-50 to-blue-100",
          iconBg: "from-blue-400 to-blue-500",
          textColor: "text-blue-800",
          descColor: "text-blue-600"
        };
      case title.includes("Split"):
        return {
          bg: "from-purple-50 to-purple-100",
          iconBg: "from-purple-400 to-purple-500",
          textColor: "text-purple-800",
          descColor: "text-purple-600"
        };
      case title.includes("Compress"):
        return {
          bg: "from-green-50 to-green-100",
          iconBg: "from-green-400 to-green-500",
          textColor: "text-green-800",
          descColor: "text-green-600"
        };
      case title.includes("Convert"):
        return {
          bg: "from-orange-50 to-orange-100",
          iconBg: "from-orange-400 to-orange-500",
          textColor: "text-orange-800",
          descColor: "text-orange-600"
        };
      case title.includes("Edit"):
        return {
          bg: "from-amber-50 to-amber-100",
          iconBg: "from-amber-400 to-amber-500",
          textColor: "text-amber-800",
          descColor: "text-amber-600"
        };
      case title.includes("Secure"):
        return {
          bg: "from-red-50 to-red-100",
          iconBg: "from-red-400 to-red-500",
          textColor: "text-red-800",
          descColor: "text-red-600"
        };
      default:
        return {
          bg: "from-indigo-50 to-indigo-100",
          iconBg: "from-indigo-400 to-indigo-500",
          textColor: "text-indigo-800",
          descColor: "text-indigo-600"
        };
    }
  };
  
  const colors = getGradient();
  
  return (
    <div className="overflow-hidden shadow-md rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
      <div className={`px-6 py-5 bg-gradient-to-br ${colors.bg}`}>
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-lg p-3 bg-gradient-to-r ${colors.iconBg} shadow-md group-hover:shadow-lg transition-all duration-300`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-5">
            <h3 className={`text-lg font-semibold ${colors.textColor}`}>{title}</h3>
            <p className={`mt-1 text-sm ${colors.descColor}`}>{description}</p>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-white flex justify-end group-hover:bg-gradient-to-r group-hover:from-gray-50 group-hover:to-gray-100 transition-all duration-300">
        <Link href={href}>
          <a className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group-hover:text-primary-600">
            Use Tool
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default PDFToolCard;
