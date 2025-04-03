import { Link, useLocation } from "wouter";
import { 
  FileText, FilePlus2, FileOutput, FileSearch, Edit, Lock, LayoutDashboard, 
  Image, PanelLeft, FileType, FileJson, RotateCw, 
  FileCode, Shield, File, Download, Plus, Settings, LogOut
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "@shared/schema";

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

interface SidebarItemProps {
  href: string;
  icon: JSX.Element;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon, label, isActive, onClick }) => {
  return (
    <Link href={href}>
      <div
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md group cursor-pointer ${
          isActive
            ? "text-primary-500 bg-primary-50"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        onClick={onClick}
      >
        <span className={`mr-3 h-5 w-5 ${isActive ? "text-primary-500" : "text-gray-500"}`}>
          {icon}
        </span>
        {label}
      </div>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ mobile = false, onClose }) => {
  const [location] = useLocation();
  
  // We need to define the correct type based on what the API returns
  interface UserResponse {
    id: number;
    username: string;
    displayName: string | null;
    imageUrl: string | null;
    planType: string;
  }
  
  const { data: user } = useQuery<UserResponse>({
    queryKey: ["/api/user/current"],
    staleTime: Infinity
  });

  const handleItemClick = () => {
    if (mobile && onClose) {
      onClose();
    }
  };

  return (
    <aside className={`${mobile ? "flex" : "hidden lg:flex"} flex-col w-64 border-r border-gray-200 bg-white`}>
      {/* Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded bg-primary-500 flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <h1 className="ml-2 text-xl font-bold text-gray-900">PDFCore</h1>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <SidebarItem 
          href="/" 
          icon={<LayoutDashboard />} 
          label="Dashboard" 
          isActive={location === "/"} 
          onClick={handleItemClick}
        />
        
        <div className="mt-6 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Core PDF Tools
        </div>

        <SidebarItem 
          href="/merge" 
          icon={<FilePlus2 />} 
          label="Merge PDFs" 
          isActive={location === "/merge"} 
          onClick={handleItemClick}
        />
        
        <SidebarItem 
          href="/split" 
          icon={<FileText />} 
          label="Split PDF" 
          isActive={location === "/split"} 
          onClick={handleItemClick}
        />
        
        <SidebarItem 
          href="/compress" 
          icon={<FileOutput />} 
          label="Compress PDF" 
          isActive={location === "/compress"} 
          onClick={handleItemClick}
        />
        
        <SidebarItem 
          href="/edit" 
          icon={<Edit />} 
          label="Edit PDF" 
          isActive={location === "/edit"} 
          onClick={handleItemClick}
        />
        
        <SidebarItem 
          href="/secure" 
          icon={<Shield />} 
          label="Protect PDF" 
          isActive={location === "/secure"} 
          onClick={handleItemClick}
        />
        
        <SidebarItem 
          href="/rotate" 
          icon={<RotateCw />} 
          label="Rotate PDF" 
          isActive={location === "/rotate"} 
          onClick={handleItemClick}
        />
        
        <div className="mt-6 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Convert From PDF
        </div>
        
        <SidebarItem 
          href="/pdf-to-word" 
          icon={<FileText />} 
          label="PDF to Word" 
          isActive={location === "/pdf-to-word"} 
          onClick={handleItemClick}
        />
        
        <SidebarItem 
          href="/pdf-to-excel" 
          icon={<PanelLeft />} 
          label="PDF to Excel" 
          isActive={location === "/pdf-to-excel"} 
          onClick={handleItemClick}
        />
        
        <SidebarItem 
          href="/pdf-to-html" 
          icon={<FileType />} 
          label="PDF to HTML" 
          isActive={location === "/pdf-to-html"} 
          onClick={handleItemClick}
        />
        
        <SidebarItem 
          href="/pdf-to-jpg" 
          icon={<Image />} 
          label="PDF to JPG" 
          isActive={location === "/pdf-to-jpg"} 
          onClick={handleItemClick}
        />
        
        <SidebarItem 
          href="/pdf-to-text" 
          icon={<FileText />} 
          label="PDF to Text" 
          isActive={location === "/pdf-to-text"} 
          onClick={handleItemClick}
        />
        
        <SidebarItem 
          href="/pdf-to-json" 
          icon={<FileJson />} 
          label="PDF to JSON" 
          isActive={location === "/pdf-to-json"} 
          onClick={handleItemClick}
        />
        
        <div className="mt-6 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Convert To PDF
        </div>
        
        <SidebarItem 
          href="/word-to-pdf" 
          icon={<FileText />} 
          label="Word to PDF" 
          isActive={location === "/word-to-pdf"} 
          onClick={handleItemClick}
        />
        
        <SidebarItem 
          href="/excel-to-pdf" 
          icon={<PanelLeft />} 
          label="Excel to PDF" 
          isActive={location === "/excel-to-pdf"} 
          onClick={handleItemClick}
        />
        
        <SidebarItem 
          href="/jpg-to-pdf" 
          icon={<Image />} 
          label="JPG to PDF" 
          isActive={location === "/jpg-to-pdf"} 
          onClick={handleItemClick}
        />
        
        <SidebarItem 
          href="/html-to-pdf" 
          icon={<FileType />} 
          label="HTML to PDF" 
          isActive={location === "/html-to-pdf"} 
          onClick={handleItemClick}
        />
        
        <SidebarItem 
          href="/text-to-pdf" 
          icon={<FileText />} 
          label="Text to PDF" 
          isActive={location === "/text-to-pdf"} 
          onClick={handleItemClick}
        />
      </nav>
      
      {/* App Info */}
      <div className="flex items-center px-4 py-4 border-t border-gray-200">
        <div className="ml-2">
          <p className="text-sm font-medium text-gray-700">PDFCore Tools</p>
          <p className="text-xs font-medium text-gray-500">Free PDF Utilities</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
