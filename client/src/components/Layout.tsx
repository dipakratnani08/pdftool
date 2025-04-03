import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNavigation from "./MobileNavigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Mobile Menu - Conditional render */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
            onClick={toggleMobileMenu}
          ></div>
          <div className="relative flex flex-col w-full max-w-xs bg-white h-full">
            <Sidebar mobile onClose={toggleMobileMenu} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleMobileMenu={toggleMobileMenu} />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
        <MobileNavigation />
      </div>
    </div>
  );
};

export default Layout;
