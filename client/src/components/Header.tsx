import { Bell, HelpCircle, Lightbulb, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import ThemeSelector from "@/components/ThemeSelector";

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileMenu }) => {
  const { data: user } = useQuery({
    queryKey: ["/api/user/current"],
    staleTime: Infinity
  });

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
            <div className="relative w-full">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                type="search"
                placeholder="Search for PDF tools or files..."
                className="block w-full pl-10 pr-3 py-2"
              />
            </div>
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
