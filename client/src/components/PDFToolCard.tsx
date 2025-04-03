import { Link } from 'wouter';
import { LucideIcon } from 'lucide-react';

interface PDFToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

const PDFToolCard: React.FC<PDFToolCardProps> = ({ title, description, icon: Icon, href }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg transition duration-200 hover:shadow-md">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
            <Icon className="h-6 w-6 text-primary-600" />
          </div>
          <div className="ml-5">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </div>
      <div className="px-4 py-4 sm:px-6 bg-gray-50 flex justify-end">
        <Link href={href}>
          <a className="text-primary-600 hover:text-primary-900 text-sm font-medium">Use Tool →</a>
        </Link>
      </div>
    </div>
  );
};

export default PDFToolCard;
