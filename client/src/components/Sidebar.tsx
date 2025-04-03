import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  FileText, FilePlus2, FileOutput, FileSearch, Edit, Lock, LayoutDashboard, 
  Image, PanelLeft, FileType, FileJson, RotateCw, 
  FileCode, Shield, File, Download, Plus, Settings, LogOut,
  Home, Mail, HelpCircle, ChevronDown, ChevronRight, Trash2, 
  Scissors, Wrench, FileLock, FileSignature, FileX, FileMinus, 
  FilePlus, ScanLine, Hash, Text
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

interface SidebarCategoryProps {
  title: string;
  children: React.ReactNode;
  gradient: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
}

const SidebarCategory: React.FC<SidebarCategoryProps> = ({ 
  title, 
  children, 
  gradient, 
  icon,
  defaultOpen = false 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  // Extract colors from gradient string for the line decoration
  const getGradientColors = () => {
    if (gradient.includes('blue-purple')) {
      return {
        from: 'from-blue-400',
        to: 'to-purple-400',
        textFrom: 'from-blue-600',
        textTo: 'to-purple-600'
      };
    } else if (gradient.includes('amber-red')) {
      return {
        from: 'from-amber-400',
        to: 'to-red-400',
        textFrom: 'from-amber-600',
        textTo: 'to-red-600'
      };
    } else if (gradient.includes('green-cyan')) {
      return {
        from: 'from-green-400',
        to: 'to-cyan-400',
        textFrom: 'from-green-600',
        textTo: 'to-cyan-600'
      };
    } else if (gradient.includes('purple-pink')) {
      return {
        from: 'from-purple-400',
        to: 'to-pink-400',
        textFrom: 'from-purple-600',
        textTo: 'to-pink-600'
      };
    } else {
      // Default blue-purple
      return {
        from: 'from-blue-400',
        to: 'to-purple-400',
        textFrom: 'from-blue-600',
        textTo: 'to-purple-600'
      };
    }
  };
  
  const colors = getGradientColors();
  
  return (
    <div className="mb-1">
      <button 
        className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors group cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <div className="flex items-center mb-1">
            <div className={`h-0.5 w-2 bg-gradient-to-r ${colors.from} ${colors.to} rounded-full mr-1`}></div>
            <div className={`h-0.5 w-3 bg-gradient-to-r ${colors.from} ${colors.to} rounded-full mr-1`}></div>
          </div>
          <h3 className={`text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r ${colors.textFrom} ${colors.textTo} uppercase tracking-wider ml-1`}>
            {title}
          </h3>
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-500" />
        )}
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
        <div className="space-y-1 pl-2 pr-1">
          {children}
        </div>
      </div>
    </div>
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
        
        {/* ORGANIZE PDF SECTION */}
        <SidebarCategory 
          title="Organize PDF" 
          gradient="blue-purple" 
          defaultOpen={true}
        >
          <SidebarItem 
            href="/merge" 
            icon={<FilePlus2 />} 
            label="Merge PDF" 
            isActive={location === "/merge"} 
            onClick={handleItemClick}
          />
          
          <SidebarItem 
            href="/split" 
            icon={<Scissors />} 
            label="Split PDF" 
            isActive={location === "/split"} 
            onClick={handleItemClick}
          />
          
          <SidebarItem 
            href="/remove-pages" 
            icon={<Trash2 />} 
            label="Remove pages" 
            isActive={location === "/remove-pages"} 
            onClick={handleItemClick}
          />
          
          <SidebarItem 
            href="/extract-pages" 
            icon={<FileMinus />} 
            label="Extract pages" 
            isActive={location === "/extract-pages"} 
            onClick={handleItemClick}
          />
          
          <SidebarItem 
            href="/organize-pdf" 
            icon={<FileText />} 
            label="Organize PDF" 
            isActive={location === "/organize-pdf"} 
            onClick={handleItemClick}
          />
          
          <SidebarItem 
            href="/scan-to-pdf" 
            icon={<ScanLine />} 
            label="Scan to PDF" 
            isActive={location === "/scan-to-pdf"} 
            onClick={handleItemClick}
          />
        </SidebarCategory>
        
        {/* OPTIMIZE PDF SECTION */}
        <SidebarCategory 
          title="Optimize PDF" 
          gradient="green-cyan" 
          defaultOpen={false}
        >
          <SidebarItem 
            href="/compress" 
            icon={<FileOutput />} 
            label="Compress PDF" 
            isActive={location === "/compress"} 
            onClick={handleItemClick}
          />
          
          <SidebarItem 
            href="/repair" 
            icon={<Wrench />} 
            label="Repair PDF" 
            isActive={location === "/repair"} 
            onClick={handleItemClick}
          />
          
          <SidebarItem 
            href="/ocr" 
            icon={<FileSearch />} 
            label="OCR PDF" 
            isActive={location === "/ocr"} 
            onClick={handleItemClick}
          />
        </SidebarCategory>
        
        {/* CONVERT TO PDF SECTION */}
        <SidebarCategory 
          title="Convert to PDF" 
          gradient="purple-pink" 
          defaultOpen={false}
        >
          <SidebarItem 
            href="/jpg-to-pdf" 
            icon={<Image />} 
            label="JPG to PDF" 
            isActive={location === "/jpg-to-pdf"} 
            onClick={handleItemClick}
          />
          
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
            href="/powerpoint-to-pdf" 
            icon={<File />} 
            label="PowerPoint to PDF" 
            isActive={location === "/powerpoint-to-pdf"} 
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
            icon={<Text />} 
            label="Text to PDF" 
            isActive={location === "/text-to-pdf"} 
            onClick={handleItemClick}
          />
        </SidebarCategory>
        
        {/* CONVERT FROM PDF SECTION */}
        <SidebarCategory 
          title="Convert from PDF" 
          gradient="amber-red" 
          defaultOpen={false}
        >
          <SidebarItem 
            href="/pdf-to-jpg" 
            icon={<Image />} 
            label="PDF to JPG" 
            isActive={location === "/pdf-to-jpg"} 
            onClick={handleItemClick}
          />
          
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
            href="/pdf-to-powerpoint" 
            icon={<File />} 
            label="PDF to PowerPoint" 
            isActive={location === "/pdf-to-powerpoint"} 
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
            href="/pdf-to-text" 
            icon={<Text />} 
            label="PDF to Text" 
            isActive={location === "/pdf-to-text"} 
            onClick={handleItemClick}
          />
        </SidebarCategory>
        
        {/* EDIT PDF SECTION */}
        <SidebarCategory 
          title="Edit PDF" 
          gradient="blue-purple" 
          defaultOpen={false}
        >
          <SidebarItem 
            href="/edit" 
            icon={<Edit />} 
            label="Edit PDF" 
            isActive={location === "/edit"} 
            onClick={handleItemClick}
          />
          
          <SidebarItem 
            href="/rotate" 
            icon={<RotateCw />} 
            label="Rotate PDF" 
            isActive={location === "/rotate"} 
            onClick={handleItemClick}
          />
          
          <SidebarItem 
            href="/add-page-numbers" 
            icon={<Hash />} 
            label="Add page numbers" 
            isActive={location === "/add-page-numbers"} 
            onClick={handleItemClick}
          />
          
          <SidebarItem 
            href="/add-watermark" 
            icon={<FileSignature />} 
            label="Add watermark" 
            isActive={location === "/add-watermark"} 
            onClick={handleItemClick}
          />
        </SidebarCategory>
        
        {/* PDF SECURITY SECTION */}
        <SidebarCategory 
          title="PDF Security" 
          gradient="green-cyan" 
          defaultOpen={false}
        >
          <SidebarItem 
            href="/secure" 
            icon={<Shield />} 
            label="Protect PDF" 
            isActive={location === "/secure"} 
            onClick={handleItemClick}
          />
          
          <SidebarItem 
            href="/unlock-pdf" 
            icon={<Lock />} 
            label="Unlock PDF" 
            isActive={location === "/unlock-pdf"} 
            onClick={handleItemClick}
          />
          
          <SidebarItem 
            href="/sign-pdf" 
            icon={<FileSignature />} 
            label="Sign PDF" 
            isActive={location === "/sign-pdf"} 
            onClick={handleItemClick}
          />
          
          <SidebarItem 
            href="/redact-pdf" 
            icon={<FileX />} 
            label="Redact PDF" 
            isActive={location === "/redact-pdf"} 
            onClick={handleItemClick}
          />
        </SidebarCategory>
        
        {/* INFORMATION SECTION */}
        <SidebarCategory 
          title="Information" 
          gradient="blue-purple" 
          defaultOpen={false}
        >
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
        </SidebarCategory>
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
