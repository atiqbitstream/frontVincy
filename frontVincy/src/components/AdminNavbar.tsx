
import { Link } from "react-router-dom";
import { LogOut, Menu, X, PanelLeft, Newspaper, Phone, Video, Radio } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

interface AdminNavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const AdminNavbar = ({ activeSection, setActiveSection }: AdminNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    setIsOpen(false);
  };

  return (
    <nav className="bg-health-secondary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <button onClick={() => handleNavClick("dashboard")} className="text-white text-xl font-bold">
                W.O.M.B Admin
              </button>
              <span className="ml-2 text-xs text-gray-200">Control Panel</span>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <button 
              onClick={() => handleNavClick("dashboard")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeSection === "dashboard" 
                  ? "bg-white/20 text-white" 
                  : "text-gray-200 hover:text-white"
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => handleNavClick("about")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeSection === "about" 
                  ? "bg-white/20 text-white" 
                  : "text-gray-200 hover:text-white"
              }`}
            >
              <span className="flex items-center">
                <PanelLeft size={16} className="mr-1" />
                About
              </span>
            </button>
            <button 
              onClick={() => handleNavClick("news")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeSection === "news" 
                  ? "bg-white/20 text-white" 
                  : "text-gray-200 hover:text-white"
              }`}
            >
              <span className="flex items-center">
                <Newspaper size={16} className="mr-1" />
                News
              </span>
            </button>
            <button 
              onClick={() => handleNavClick("contact")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeSection === "contact" 
                  ? "bg-white/20 text-white" 
                  : "text-gray-200 hover:text-white"
              }`}
            >
              <span className="flex items-center">
                <Phone size={16} className="mr-1" />
                Contact Us
              </span>
            </button>
            <button 
              onClick={() => handleNavClick("hub")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeSection === "hub" 
                  ? "bg-white/20 text-white" 
                  : "text-gray-200 hover:text-white"
              }`}
            >
              <span className="flex items-center">
                <Radio size={16} className="mr-1" />
                Hub
              </span>
            </button>
            <button 
              onClick={() => handleNavClick("live-session")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeSection === "live-session" 
                  ? "bg-white/20 text-white" 
                  : "text-gray-200 hover:text-white"
              }`}
            >
              <span className="flex items-center">
                <Video size={16} className="mr-1" />
                Live Session
              </span>
            </button>
            
            <button 
              onClick={logout}
              className="ml-4 flex items-center gap-1 text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-health-secondary hover:bg-white"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden animate-fade-in bg-health-secondary">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => handleNavClick("dashboard")}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                activeSection === "dashboard" 
                  ? "bg-white/20 text-white" 
                  : "text-gray-200 hover:text-white"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNavClick("about")}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                activeSection === "about" 
                  ? "bg-white/20 text-white" 
                  : "text-gray-200 hover:text-white"
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleNavClick("news")}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                activeSection === "news" 
                  ? "bg-white/20 text-white" 
                  : "text-gray-200 hover:text-white"
              }`}
            >
              News
            </button>
            <button
              onClick={() => handleNavClick("contact")}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                activeSection === "contact" 
                  ? "bg-white/20 text-white" 
                  : "text-gray-200 hover:text-white"
              }`}
            >
              Contact Us
            </button>
            <button
              onClick={() => handleNavClick("hub")}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                activeSection === "hub" 
                  ? "bg-white/20 text-white" 
                  : "text-gray-200 hover:text-white"
              }`}
            >
              Hub
            </button>
            <button
              onClick={() => handleNavClick("live-session")}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                activeSection === "live-session" 
                  ? "bg-white/20 text-white" 
                  : "text-gray-200 hover:text-white"
              }`}
            >
              Live Session
            </button>
            
            <button 
              onClick={logout}
              className="flex w-full items-center gap-1 mt-2 px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/20"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
