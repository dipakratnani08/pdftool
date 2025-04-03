import { Bell, HelpCircle, Lightbulb, Download, FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import ThemeSelector from "@/components/ThemeSelector";
import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileMenu }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  
  const { data: user } = useQuery({
    queryKey: ["/api/user/current"],
    staleTime: Infinity
  });
  
  // PDF tool paths and their descriptions for search
  const pdfTools = [
    { path: "/merge", name: "Merge PDFs", description: "Combine multiple PDF files into one document" },
    { path: "/split", name: "Split PDF", description: "Separate a PDF into multiple documents by pages" },
    { path: "/compress", name: "Compress PDF", description: "Reduce PDF file size while preserving quality" },
    { path: "/edit", name: "Edit PDF", description: "Modify PDF content, add text, images and annotations" },
    { path: "/secure", name: "Protect PDF", description: "Add password and encryption to your PDF files" },
    { path: "/rotate", name: "Rotate PDF", description: "Change page orientation in your PDF documents" },
    { path: "/pdf-to-word", name: "PDF to Word", description: "Convert PDF files to editable Word documents" },
    { path: "/pdf-to-excel", name: "PDF to Excel", description: "Convert PDF files to Excel spreadsheets" },
    { path: "/pdf-to-html", name: "PDF to HTML", description: "Convert PDF files to HTML web pages" },
    { path: "/pdf-to-jpg", name: "PDF to JPG", description: "Convert PDF files to JPG images" },
    { path: "/pdf-to-text", name: "PDF to Text", description: "Extract text content from PDF files" },
    { path: "/word-to-pdf", name: "Word to PDF", description: "Convert Word documents to PDF format" },
    { path: "/excel-to-pdf", name: "Excel to PDF", description: "Convert Excel spreadsheets to PDF format" },
    { path: "/jpg-to-pdf", name: "JPG to PDF", description: "Convert JPG images to PDF documents" },
    { path: "/html-to-pdf", name: "HTML to PDF", description: "Convert HTML web pages to PDF documents" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: "Search query is empty",
        description: "Please enter a search term to find PDF tools",
        variant: "destructive",
      });
      return;
    }
    
    // Simple search through tool names and descriptions
    const lowerQuery = searchQuery.toLowerCase();
    const matchedTool = pdfTools.find(tool => 
      tool.name.toLowerCase().includes(lowerQuery) || 
      tool.description.toLowerCase().includes(lowerQuery)
    );
    
    if (matchedTool) {
      navigate(matchedTool.path);
      toast({
        title: `Found: ${matchedTool.name}`,
        description: matchedTool.description,
      });
    } else {
      toast({
        title: "No matches found",
        description: "Try another search term or browse our tools in the sidebar",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-white shadow-sm lg:border-b lg:border-gray-200">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Mobile Logo & Menu Button */}
        <div className="flex items-center lg:hidden">
          <Button variant="ghost" size="icon" className="text-gray-500" onClick={toggleMobileMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
          <div className="ml-3 lg:hidden">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded bg-primary-500 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h1 className="ml-2 text-xl font-bold text-gray-900">PDFCore</h1>
            </div>
          </div>
        </div>

        {/* Desktop Logo - Hidden on mobile */}
        <div className="hidden lg:flex lg:items-center">
          <div className="w-10 h-10 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h1 className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">PDFCore</h1>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:ml-6">
          <div className="max-w-lg w-full">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search 
                className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
              />
              <Input
                type="search"
                placeholder="Search for PDF tools or files..."
                className="block w-full pl-10 pr-12 py-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                size="sm" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
              >
                Search
              </Button>
            </form>
          </div>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center space-x-3">
          <ThemeSelector />
          
          <Button variant="ghost" size="icon" className="text-blue-500">
            <Download className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-amber-500">
            <Lightbulb className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-purple-500">
            <HelpCircle className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-red-500">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
