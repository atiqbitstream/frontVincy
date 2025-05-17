// src/components/Navbar.tsx

import { Link } from "react-router-dom";
import { LogOut, Menu, X, Sun, Moon, Video } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const [liveStatus, setLiveStatus] = useState<{
    isLive: boolean;
    timeRemaining: string | null;
    label: string;
  }>({
    isLive: false,
    timeRemaining: null,
    label: "",
  });

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen((o) => !o);
  };

  // Theme toggle
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    toast.success(`${next.charAt(0).toUpperCase() + next.slice(1)} mode activated`);
  };

  // Mock live session check (replace with real API call as needed)
  useEffect(() => {
    const mock = {
      status: false,
      dateTime: new Date(Date.now() + 86400000).toISOString(),
      label: "Introduction to Mind-Body Wellness",
    };

    const update = () => {
      const now = new Date();
      const sessionTime = new Date(mock.dateTime);

      if (mock.status) {
        setLiveStatus({ isLive: true, timeRemaining: null, label: mock.label });
        return;
      }

      if (now >= sessionTime) {
        setLiveStatus({ isLive: false, timeRemaining: null, label: mock.label });
        return;
      }

      const diff = sessionTime.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      let str = "";
      if (days) str += `${days}d `;
      if (hours || days) str += `${hours}h `;
      str += `${minutes}m`;

      setLiveStatus({ isLive: false, timeRemaining: str, label: mock.label });
    };

    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav className="bg-card shadow-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-health-secondary text-xl font-bold">
              W.O.M.B
            </Link>
            <span className="ml-2 text-xs text-foreground/60">
              Wellness Optimal Mind Body
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="text-foreground/70 hover:text-health-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/about"
              className="text-foreground/70 hover:text-health-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              About
            </Link>
            <Link
              to="/news"
              className="text-foreground/70 hover:text-health-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              News
            </Link>
            <Link
              to="/contact"
              className="text-foreground/70 hover:text-health-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              Contact Us
            </Link>

            <Link
              to="/live-session"
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                liveStatus.isLive
                  ? "text-green-500 font-semibold"
                  : "text-foreground/70 hover:text-health-primary"
              }`}
            >
              {liveStatus.isLive ? (
                <>
                  <Video size={16} className="mr-1 animate-pulse" />
                  Live Now!
                </>
              ) : liveStatus.timeRemaining ? (
                <>Live in {liveStatus.timeRemaining}</>
              ) : (
                <>Live Session</>
              )}
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted/50"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun size={20} className="text-yellow-500" />
              ) : (
                <Moon size={20} className="text-blue-700" />
              )}
            </button>

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="ml-4 flex items-center gap-1 text-sm px-4 py-2 border rounded text-destructive border-destructive hover:border-transparent hover:text-white hover:bg-destructive"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="ml-4 text-sm px-4 py-2 border rounded text-health-primary border-health-primary hover:border-transparent hover:text-white hover:bg-health-primary"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted/50"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun size={20} className="text-yellow-500" />
              ) : (
                <Moon size={20} className="text-blue-700" />
              )}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-foreground/70 hover:text-health-primary focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden animate-fade-in bg-card border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:text-health-primary"
            >
              Dashboard
            </Link>
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:text-health-primary"
            >
              About
            </Link>
            <Link
              to="/news"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:text-health-primary"
            >
              News
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:text-health-primary"
            >
              Contact Us
            </Link>
            <Link
              to="/live-session"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                liveStatus.isLive
                  ? "text-green-500 font-semibold"
                  : "text-foreground/70 hover:text-health-primary"
              }`}
            >
              {liveStatus.isLive ? (
                <>
                  <Video size={16} className="mr-1 animate-pulse" />
                  Live Now!
                </>
              ) : liveStatus.timeRemaining ? (
                <>Live in {liveStatus.timeRemaining}</>
              ) : (
                <>Live Session</>
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
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-health-primary hover:bg-muted/50"
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
