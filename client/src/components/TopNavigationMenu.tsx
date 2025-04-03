import { useState, Fragment } from 'react';
import { Link, useLocation } from "wouter";
import { 
  FilePlus2, Scissors, FileOutput, FileSearch, Edit, Lock, 
  Image, PanelLeft, FileType, FileText, RotateCw, 
  FileCode, Shield, File, Download, ChevronDown,
  Trash2, Wrench, ScanLine, Hash, Text, FileSignature,
  FileMinus, Pen, LifeBuoy, Mail
} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItemType {
  title: string;
  path: string;
  icon: JSX.Element;
  description?: string;
}

interface NavGroupType {
  title: string;
  items: NavItemType[];
  accentColor: string;
  hoverGradient: string;
}

const navGroups: NavGroupType[] = [
  {
    title: "Organize",
    accentColor: "text-blue-600",
    hoverGradient: "from-blue-500 to-blue-600",
    items: [
      {
        title: "Merge PDF",
        path: "/merge",
        icon: <FilePlus2 className="h-5 w-5 text-blue-500" />,
        description: "Combine multiple PDFs into one document"
      },
      {
        title: "Split PDF",
        path: "/split",
        icon: <Scissors className="h-5 w-5 text-blue-500" />,
        description: "Separate a PDF into multiple documents"
      },
      {
        title: "Remove Pages",
        path: "/remove-pages",
        icon: <Trash2 className="h-5 w-5 text-blue-500" />,
        description: "Delete unwanted pages from your PDF"
      },
      {
        title: "Extract Pages",
        path: "/extract-pages",
        icon: <FileMinus className="h-5 w-5 text-blue-500" />,
        description: "Extract specific pages from your PDF"
      },
      {
        title: "Scan to PDF",
        path: "/scan-to-pdf",
        icon: <ScanLine className="h-5 w-5 text-blue-500" />,
        description: "Convert scanned documents to PDFs"
      }
    ]
  },
  {
    title: "Optimize",
    accentColor: "text-green-600",
    hoverGradient: "from-green-500 to-green-600",
    items: [
      {
        title: "Compress PDF",
        path: "/compress",
        icon: <FileOutput className="h-5 w-5 text-green-500" />,
        description: "Reduce PDF file size while preserving quality"
      },
      {
        title: "Repair PDF",
        path: "/repair",
        icon: <Wrench className="h-5 w-5 text-green-500" />,
        description: "Fix corrupted PDF files"
      },
      {
        title: "OCR PDF",
        path: "/ocr",
        icon: <FileSearch className="h-5 w-5 text-green-500" />,
        description: "Make scanned PDFs searchable"
      }
    ]
  },
  {
    title: "Convert",
    accentColor: "text-purple-600",
    hoverGradient: "from-purple-500 to-purple-600",
    items: [
      {
        title: "PDF to Word",
        path: "/pdf-to-word",
        icon: <FileText className="h-5 w-5 text-purple-500" />,
        description: "Convert PDF to editable Word documents"
      },
      {
        title: "PDF to Excel",
        path: "/pdf-to-excel",
        icon: <PanelLeft className="h-5 w-5 text-purple-500" />,
        description: "Convert PDF to Excel spreadsheets"
      },
      {
        title: "PDF to JPG",
        path: "/pdf-to-jpg",
        icon: <Image className="h-5 w-5 text-purple-500" />,
        description: "Convert PDF pages to JPG images"
      },
      {
        title: "PDF to HTML",
        path: "/pdf-to-html",
        icon: <FileType className="h-5 w-5 text-purple-500" />,
        description: "Convert PDF to HTML web pages"
      },
      {
        title: "Word to PDF",
        path: "/word-to-pdf",
        icon: <FileText className="h-5 w-5 text-purple-500" />,
        description: "Convert Word documents to PDF"
      },
      {
        title: "Excel to PDF",
        path: "/excel-to-pdf",
        icon: <PanelLeft className="h-5 w-5 text-purple-500" />,
        description: "Convert Excel spreadsheets to PDF"
      },
      {
        title: "JPG to PDF",
        path: "/jpg-to-pdf",
        icon: <Image className="h-5 w-5 text-purple-500" />,
        description: "Convert JPG images to PDF"
      },
      {
        title: "HTML to PDF",
        path: "/html-to-pdf",
        icon: <FileType className="h-5 w-5 text-purple-500" />,
        description: "Convert HTML to PDF documents"
      }
    ]
  },
  {
    title: "Edit",
    accentColor: "text-amber-600",
    hoverGradient: "from-amber-500 to-amber-600",
    items: [
      {
        title: "Edit PDF",
        path: "/edit",
        icon: <Edit className="h-5 w-5 text-amber-500" />,
        description: "Modify text, add images and annotate PDFs"
      },
      {
        title: "Rotate PDF",
        path: "/rotate",
        icon: <RotateCw className="h-5 w-5 text-amber-500" />,
        description: "Change page orientation in your PDF"
      },
      {
        title: "Add Page Numbers",
        path: "/add-page-numbers",
        icon: <Hash className="h-5 w-5 text-amber-500" />,
        description: "Add page numbers to your PDF"
      },
      {
        title: "Add Watermark",
        path: "/add-watermark",
        icon: <FileSignature className="h-5 w-5 text-amber-500" />,
        description: "Add text or image watermarks to PDFs"
      }
    ]
  },
  {
    title: "Security",
    accentColor: "text-red-600",
    hoverGradient: "from-red-500 to-red-600",
    items: [
      {
        title: "Protect PDF",
        path: "/secure",
        icon: <Shield className="h-5 w-5 text-red-500" />,
        description: "Add password protection to your PDFs"
      },
      {
        title: "Unlock PDF",
        path: "/unlock",
        icon: <Lock className="h-5 w-5 text-red-500" />,
        description: "Remove password protection from PDFs"
      }
    ]
  }
];

interface TopNavigationMenuProps {
  isDrawerOpen?: boolean;
  setIsDrawerOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopNavigationMenu: React.FC<TopNavigationMenuProps> = ({ 
  isDrawerOpen = false, 
  setIsDrawerOpen = () => {} 
}) => {
  const [location] = useLocation();
  
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="w-10 h-10 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">PDFCore</h1>
            <div className="ml-2 px-2 py-0.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-medium rounded-full">
              100% Free
            </div>
          </div>
          
          {/* Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/">
                    <NavigationMenuLink className={navigationMenuTriggerStyle({
                      className: location === "/" ? "bg-gray-100" : ""
                    })}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                {navGroups.map((group) => (
                  <NavigationMenuItem key={group.title}>
                    <NavigationMenuTrigger className={group.accentColor}>
                      {group.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {group.items.map((item) => (
                          <li key={item.path}>
                            <Link href={item.path}>
                              <NavigationMenuLink asChild>
                                <a
                                  className={cn(
                                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gradient-to-r",
                                    `hover:${group.hoverGradient} hover:text-white`,
                                    location === item.path
                                      ? `bg-gradient-to-r ${group.hoverGradient} text-white`
                                      : "hover:bg-accent hover:text-accent-foreground"
                                  )}
                                >
                                  <div className="flex items-center">
                                    {item.icon}
                                    <span className="text-sm font-medium ml-2">{item.title}</span>
                                  </div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {item.description}
                                  </p>
                                </a>
                              </NavigationMenuLink>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}

                <NavigationMenuItem>
                  <Link href="/contact">
                    <NavigationMenuLink className={navigationMenuTriggerStyle({
                      className: location === "/contact" ? "bg-gray-100" : ""
                    })}>
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 px-3 mobile-menu-button"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
          
          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <Download className="h-4 w-4 mr-2" />
              Download App
            </Button>
            <Button variant="outline" size="icon">
              <LifeBuoy className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="outline" size="icon">
              <Mail className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation for PDF Tools - Always visible on mobile */}
      <div className="md:hidden overflow-x-auto whitespace-nowrap px-4 py-2 border-t border-gray-200 bg-white">
        <div className="inline-flex space-x-2">
          {navGroups.map((group) => (
            <button
              key={group.title}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border bg-gradient-to-r ${group.hoverGradient} text-white`}
            >
              {group.title}
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopNavigationMenu;