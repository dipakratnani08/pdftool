import { Link, useLocation } from "wouter";
import { LayoutDashboard, Plus, FileText, User } from "lucide-react";

const MobileNavigation: React.FC = () => {
  const [location] = useLocation();

  return (
    <div className="lg:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around">
        <Link href="/">
          <a className={`flex flex-col items-center py-3 ${location === "/" ? "text-primary-500" : "text-gray-600"}`}>
            <LayoutDashboard className="h-6 w-6" />
            <span className="text-xs">Dashboard</span>
          </a>
        </Link>
        <Link href="/merge">
          <a className={`flex flex-col items-center py-3 ${location === "/merge" ? "text-primary-500" : "text-gray-600"}`}>
            <Plus className="h-6 w-6" />
            <span className="text-xs">Add</span>
          </a>
        </Link>
        <Link href="/files">
          <a className={`flex flex-col items-center py-3 ${location === "/files" ? "text-primary-500" : "text-gray-600"}`}>
            <FileText className="h-6 w-6" />
            <span className="text-xs">Files</span>
          </a>
        </Link>
        <Link href="/profile">
          <a className={`flex flex-col items-center py-3 ${location === "/profile" ? "text-primary-500" : "text-gray-600"}`}>
            <User className="h-6 w-6" />
            <span className="text-xs">Profile</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavigation;
