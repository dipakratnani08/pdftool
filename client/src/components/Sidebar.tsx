import { Link, useLocation } from "wouter";
import { 
  FileText, FilePlus2, FileOutput, FileSearch, Edit, Lock, LayoutDashboard, 
  Image, PanelLeft, FileType, FileJson, RotateCw, 
  FileCode, Shield, File, Download, Plus, Settings, LogOut,
  Home, Mail, HelpCircle
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
  // Function to determine icon color based on label
  const getIconColor = () => {
    if (isActive) return "text-white";
    
    switch(true) {
      case label.includes("Merge"):
        return "text-blue-500";
      case label.includes("Split"):
        return "text-purple-500";
      case label.includes("Compress"):
        return "text-green-500";
      case label.includes("Edit"):
        return "text-amber-500";
      case label.includes("Protect"):
        return "text-red-500";
      case label.includes("Rotate"):
        return "text-indigo-500";
      case label.includes("Word"):
        return "text-blue-600";
      case label.includes("Excel"):
        return "text-green-600";
      case label.includes("HTML"):
        return "text-orange-500";
      case label.includes("JPG"):
      case label.includes("Image"):
        return "text-pink-500";
      case label.includes("Text"):
        return "text-gray-600";
      case label.includes("JSON"):
        return "text-yellow-500";
      case label.includes("Dashboard"):
        return "text-cyan-500";
      default:
        return "text-primary-400";
    }
  };
  
  // Function to get the gradient background based on label
  const getGradient = () => {
    if (!isActive) return "";
    
    switch(true) {
      case label.includes("Merge"):
        return "from-blue-500 to-blue-600";
      case label.includes("Split"):
        return "from-purple-500 to-purple-600";
      case label.includes("Compress"):
        return "from-green-500 to-green-600";
      case label.includes("Edit"):
        return "from-amber-500 to-amber-600";
      case label.includes("Protect"):
        return "from-red-500 to-red-600";
      case label.includes("Rotate"):
        return "from-indigo-500 to-indigo-600";
      case label.includes("Word"):
        return "from-blue-600 to-blue-700";
      case label.includes("Excel"):
        return "from-green-600 to-green-700";
      case label.includes("HTML"):
        return "from-orange-500 to-orange-600";
      case label.includes("JPG"):
      case label.includes("Image"):
        return "from-pink-500 to-pink-600";
      case label.includes("Text"):
        return "from-gray-600 to-gray-700";
      case label.includes("JSON"):
        return "from-yellow-500 to-yellow-600";
      case label.includes("Dashboard"):
        return "from-cyan-500 to-cyan-600";
      default:
        return "from-primary-500 to-primary-600";
    }
  };
  
  return (
    <a 
      href={href}
      onClick={(e) => {
        e.preventDefault();
        // Use manual navigation to prevent whitespace issue
        window.history.pushState({}, '', href);
        if (onClick) onClick();
      }}
      className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg group cursor-pointer transition-all duration-200 w-full ${
        isActive
          ? `text-white bg-gradient-to-r ${getGradient()} shadow-md`
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <div className={`mr-3 flex-shrink-0 h-5 w-5 transition-transform group-hover:scale-110 ${getIconColor()}`}>
        {icon}
      </div>
      <span className="transition-all duration-200 group-hover:translate-x-0.5">{label}</span>
    </a>
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
      <div className="px-6 py-6 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-md">
            <FileText className="h-6 w-6 text-primary-500" />
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-white">PDFCore</h1>
            <p className="text-xs text-primary-100">All-in-one PDF Tools</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <SidebarItem 
          href="/" 
          icon={<Home />} 
          label="Home" 
          isActive={location === "/"} 
          onClick={handleItemClick}
        />
        
        <SidebarItem 
          href="/dashboard" 
          icon={<LayoutDashboard />} 
          label="Dashboard" 
          isActive={location === "/dashboard"} 
          onClick={handleItemClick}
        />
        
        <div className="mt-6 mb-3 px-4">
          <div className="flex items-center mb-1">
            <div className="h-0.5 w-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-1"></div>
            <div className="h-0.5 w-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-1"></div>
            <div className="h-0.5 flex-grow bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
          </div>
          <h3 className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 uppercase tracking-wider">Core PDF Tools</h3>
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
        
        <div className="mt-6 mb-3 px-4">
          <div className="flex items-center mb-1">
            <div className="h-0.5 w-2 bg-gradient-to-r from-amber-400 to-red-400 rounded-full mr-1"></div>
            <div className="h-0.5 w-3 bg-gradient-to-r from-amber-400 to-red-400 rounded-full mr-1"></div>
            <div className="h-0.5 flex-grow bg-gradient-to-r from-amber-400 to-red-400 rounded-full"></div>
          </div>
          <h3 className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-red-600 uppercase tracking-wider">Convert From PDF</h3>
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
        
        <div className="mt-6 mb-3 px-4">
          <div className="flex items-center mb-1">
            <div className="h-0.5 w-2 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full mr-1"></div>
            <div className="h-0.5 w-3 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full mr-1"></div>
            <div className="h-0.5 flex-grow bg-gradient-to-r from-green-400 to-cyan-400 rounded-full"></div>
          </div>
          <h3 className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-cyan-600 uppercase tracking-wider">Convert To PDF</h3>
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
        
        <div className="mt-6 mb-3 px-4">
          <div className="flex items-center mb-1">
            <div className="h-0.5 w-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-1"></div>
            <div className="h-0.5 w-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-1"></div>
            <div className="h-0.5 flex-grow bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
          </div>
          <h3 className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 uppercase tracking-wider">Information</h3>
        </div>
        
        <SidebarItem 
          href="/contact" 
          icon={<Mail />} 
          label="Contact Us" 
          isActive={location === "/contact"} 
          onClick={handleItemClick}
        />
        
        <SidebarItem 
          href="/help" 
          icon={<HelpCircle />} 
          label="Help & FAQ" 
          isActive={location === "/help"} 
          onClick={handleItemClick}
        />
      </nav>
      
      {/* App Info */}
      <div className="flex items-center px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md animate-pulse-slow">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-gradient-text">PDFCore Tools</p>
            <div className="flex items-center mt-0.5">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                100% Free
              </span>
              <span className="text-xs font-medium text-gray-500 ml-1.5">No Registration Required</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
