// src/hooks/useAuth.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { setGlobalLogout, isTokenExpired } from "@/lib/api";

// Environment variable for API base URL
const API_URL = import.meta.env.VITE_API_URL;

// Our User shape now includes `role` and a non-optional `isAdmin`
export type User = {
  id: number;
  role: string;
  full_name: string;
  email: string;
  gender: string;
  dob: string;
  nationality: string;
  phone: string;
  city: string;
  country: string;
  occupation?: string;
  marital_status?: string;
  sleep_hours?: number;
  exercise_frequency?: string;
  smoking_status?: string;
  alcohol_consumption?: string;
  user_status: string;
  isAdmin: boolean;
};

export enum UserStatus {
  Active = "Active",
  Inactive = "Inactive",
  Pending = "Pending"
}

export interface SignupData {
  full_name: string;
  email: string;
  password: string;
  gender: string;
  dob: string;
  nationality: string;
  phone: string;
  city: string;
  country: string;
  occupation: string;
  marital_status: string;
  sleep_hours: number;
  exercise_frequency: string;
  smoking_status: string;
  alcohol_consumption: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  signup: (data: SignupData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // On mount, load token & fetch user
  useEffect(() => {
    // Set the global logout function for API helper
    setGlobalLogout(() => logout);
    
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      // Check if token is expired before using it
      if (isTokenExpired(storedToken)) {
        console.log("Token expired on load, logging out");
        logout(true); // Show session expired message
        return;
      }
      
      setToken(storedToken);
      fetchUser(storedToken);
    }
  }, []);

  // Periodic token validation (check every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      const storedToken = localStorage.getItem("token");
      if (storedToken && isTokenExpired(storedToken)) {
        console.log("Token expired during session, logging out");
        logout(true);
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const fetchUser = async (jwt: string): Promise<User | undefined> => {
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      
      if (res.status === 401) {
        // Token is invalid/expired
        console.log("Token validation failed, logging out");
        logout(true);
        return;
      }
      
      if (!res.ok) {
        console.error("Failed to fetch user:", res.status, res.statusText);
        logout();
        return;
      }

      const raw = await res.json();   // raw.role === "Admin" or "User", etc.
      const me: User = {
        ...raw,
        isAdmin: raw.role === "Admin", // ← derive the flag
      };
      setUser(me);
      return me;
    } catch (err) {
      console.error("Fetch user failed:", err);
      logout();
    }
  };

  const signup = async (data: SignupData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Signup failed");
      }
      toast.success("Signup successful! Please log in.");
      navigate("/login");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Signup failed. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const form = new URLSearchParams();
      form.append("username", email);
      form.append("password", password);

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      });
      if (!res.ok) throw new Error("Invalid credentials");

      const { access_token } = await res.json();
      localStorage.setItem("token", access_token);
      setToken(access_token);
      const user = await fetchUser(access_token); // Fetch user details
      toast.success("Login successful!");

      // Redirect based on user role
      if (user && user.role === "Admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const form = new URLSearchParams();
      form.append("username", email);
      form.append("password", password);

      const res = await fetch(`${API_URL}/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Admin login failed");
      }

      const { access_token, refresh_token } = await res.json();
      localStorage.setItem("token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      setToken(access_token);

      // re-use fetchUser → now sees role="Admin" and maps isAdmin=true
      await fetchUser(access_token);

      toast.success("Admin login successful!");
      navigate("/admin/dashboard", { replace: true });
    } catch (error: any) {
      console.error("Admin login error:", error);
      toast.error(error.message || "Admin login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (showMessage: boolean = false) => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    setToken(null);
    setUser(null);
    
    if (showMessage) {
      toast.error("Your session has expired. Please log in again.", {
        duration: 5000,
      });
    }
    
    navigate("/login");
  };

  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        signup,
        login,
        adminLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { state: { from: location } });
    }
  }, [loading, isAuthenticated, navigate, location]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : null;
};

export const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user?.isAdmin)) {
      toast.error("You do not have permission to access this page");
      navigate("/dashboard");
    }
  }, [loading, isAuthenticated, user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }
  return isAuthenticated && user?.isAdmin ? <>{children}</> : null;
};
