
import { Link } from "react-router-dom";
import { LogOut, Menu, X, Sun, Moon, Video } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const [liveStatus, setLiveStatus] = useState<{
    isLive: boolean;
    timeRemaining: string | null;
    label: string;
  }>({
    isLive: false,
    timeRemaining: null,
    label: ""
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Check live session status
  useEffect(() => {
    // In a real app, this would be an API call
    const mockLiveSessionData = {
      status: false, // Set to true to simulate an active session
      dateTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      label: "Introduction to Mind-Body Wellness"
    };

    const updateLiveStatus = () => {
      const { status, dateTime, label } = mockLiveSessionData;
      
      if (status) {
        setLiveStatus({
          isLive: true,
          timeRemaining: null,
          label
        });
        return;
      }
      
      const sessionTime = new Date(dateTime);
      const now = new Date();
      
      if (now >= sessionTime) {
        setLiveStatus({
          isLive: false,
          timeRemaining: null,
          label
        });
        return;
      }
      
      const diff = sessionTime.getTime() - now.getTime();
      
      // Calculate days, hours, minutes, seconds
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      // Format the time remaining string
      let timeString = '';
      if (days > 0) timeString += `${days}d `;
      if (hours > 0 || days > 0) timeString += `${hours}h `;
      timeString += `${minutes}m`;
      
      setLiveStatus({
        isLive: false,
        timeRemaining: timeString,
        label
      });
    };

    updateLiveStatus();
    const interval = setInterval(updateLiveStatus, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    toast.success(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated`);
  };

  return (
    <nav className="bg-card shadow-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-health-secondary text-xl font-bold">
                W.O.M.B
              </Link>
              <span className="ml-2 text-xs text-foreground/60">Wellness Optimal Mind Body</span>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to="/dashboard" className="text-foreground/70 hover:text-health-primary px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </Link>
            <Link to="/about" className="text-foreground/70 hover:text-health-primary px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link to="/news" className="text-foreground/70 hover:text-health-primary px-3 py-2 rounded-md text-sm font-medium">
              News
            </Link>
            <Link to="/contact" className="text-foreground/70 hover:text-health-primary px-3 py-2 rounded-md text-sm font-medium">
              Contact Us
            </Link>
            
            <Link 
              to="/live-session" 
              className={`text-foreground/70 hover:text-health-primary px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                liveStatus.isLive ? 'text-green-500 font-semibold' : ''
              }`}
            >
              {liveStatus.isLive ? (
                <>
                  <Video size={16} className="mr-1 animate-pulse" />
                  <span>Live Now!</span>
                </>
              ) : liveStatus.timeRemaining ? (
                <span>Live in {liveStatus.timeRemaining}</span>
              ) : (
                <span>Live Session</span>
              )}
            </Link>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted/50"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-yellow-500" />
              ) : (
                <Moon size={20} className="text-blue-700" />
              )}
            </button>
            
            {isAuthenticated ? (
              <button 
                onClick={logout}
                className="ml-4 flex items-center gap-1 text-sm px-4 py-2 leading-none border rounded text-destructive border-destructive hover:border-transparent hover:text-white hover:bg-destructive"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            ) : (
              <Link 
                to="/login"
                className="ml-4 text-sm px-4 py-2 leading-none border rounded text-health-primary border-health-primary hover:border-transparent hover:text-white hover:bg-health-primary"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted/50"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-yellow-500" />
              ) : (
                <Moon size={20} className="text-blue-700" />
              )}
            </button>
            
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground/70 hover:text-health-primary focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/dashboard" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:text-health-primary"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:text-health-primary"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/news" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:text-health-primary"
              onClick={() => setIsOpen(false)}
            >
              News
            </Link>
            <Link 
              to="/contact" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:text-health-primary"
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </Link>
            <Link 
              to="/live-session" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                liveStatus.isLive 
                  ? 'text-green-500 font-semibold flex items-center'
                  : 'text-foreground/70 hover:text-health-primary'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {liveStatus.isLive ? (
                <>
                  <Video size={16} className="mr-1 animate-pulse" />
                  <span>Live Now!</span>
                </>
              ) : liveStatus.timeRemaining ? (
                <span>Live in {liveStatus.timeRemaining}</span>
              ) : (
                <span>Live Session</span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <button 
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-1 mt-2 px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-muted/50"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            ) : (
              <Link 
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-health-primary hover:bg-muted/50"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
