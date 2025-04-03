import { Link, useLocation } from "wouter";
import { LayoutDashboard, FilePlus2, FileText, Wrench } from "lucide-react";

const MobileNavigation: React.FC = () => {
  const [location] = useLocation();

  const MobileNavItem = ({ href, icon, label, isActive }: { href: string, icon: React.ReactNode, label: string, isActive: boolean }) => {
    return (
      <Link href={href}>
        <div className={`flex flex-col items-center py-3 cursor-pointer ${isActive ? "text-primary-500" : "text-gray-600"}`}>
          {icon}
          <span className="text-xs mt-1">{label}</span>
        </div>
      </Link>
    );
  };

  return (
    <div className="lg:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-10 shadow-lg">
      <div className="flex justify-around">
        <MobileNavItem 
          href="/" 
          icon={<LayoutDashboard className="h-5 w-5" />} 
          label="Dashboard" 
          isActive={location === "/"} 
        />
        <MobileNavItem 
          href="/merge" 
          icon={<FilePlus2 className="h-5 w-5" />} 
          label="Merge PDF" 
          isActive={location === "/merge"} 
        />
        <MobileNavItem 
          href="/split" 
          icon={<FileText className="h-5 w-5" />} 
          label="Split PDF" 
          isActive={location === "/split"} 
        />
        <MobileNavItem 
          href="/compress" 
          icon={<Wrench className="h-5 w-5" />} 
          label="More Tools" 
          isActive={["/compress", "/edit", "/secure", "/rotate"].includes(location)} 
        />
      </div>
    </div>
  );
};

export default MobileNavigation;
