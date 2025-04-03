import { useState, useEffect } from "react";
import TopNavigationMenu from "./TopNavigationMenu";
import MobileNavigation from "./MobileNavigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Mobile menu drawer implementation
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isDrawerOpen && !target.closest('.mobile-drawer') && !target.closest('.mobile-menu-button')) {
        setIsDrawerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDrawerOpen]);

  return (
    <div className="flex flex-col h-full">
      {/* Top Navigation Bar */}
      <TopNavigationMenu 
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />

      {/* Mobile Drawer Menu - Conditional render */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          ></div>
          <div className="relative flex flex-col w-full max-w-xs bg-white h-full mobile-drawer">
            {/* Mobile menu content here */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <h1 className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">PDFCore</h1>
                <div className="ml-2 px-2 py-0.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-medium rounded-full">
                  Free
                </div>
              </div>
            </div>
            
            {/* Mobile menu links */}
            <div className="flex-1 overflow-y-auto py-4 px-4">
              {/* Menu items will go here */}
              <div className="space-y-4">
                <a href="/" className="block px-4 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100">
                  Home
                </a>
                <a href="/merge" className="block px-4 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100">
                  Merge PDF
                </a>
                <a href="/split" className="block px-4 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100">
                  Split PDF
                </a>
                <a href="/compress" className="block px-4 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100">
                  Compress PDF
                </a>
                <a href="/edit" className="block px-4 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100">
                  Edit PDF
                </a>
                <a href="/secure" className="block px-4 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100">
                  Protect PDF
                </a>
                <a href="/contact" className="block px-4 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
        <MobileNavigation />
      </div>
    </div>
  );
};

export default Layout;
