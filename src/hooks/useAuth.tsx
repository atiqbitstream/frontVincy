// src/hooks/useAuth.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { toast } from "sonner";

// Environment variable for API base URL
const API_URL = import.meta.env.VITE_API_URL;

export type User = {
  id: number;
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
  sleep_hours?: string;
  exercise_frequency?: string;
  smoking_status?: boolean;
  alcohol_consumption?: boolean;
  isAdmin?: boolean;
};

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
  sleep_hours: string;
  exercise_frequency: string;
  smoking_status: boolean;
  alcohol_consumption: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  signup: (data: SignupData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // On mount, load token from localStorage & fetch current user
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    }
  }, []);

  const fetchUser = async (jwt: string) => {
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (!res.ok) {
        logout();
        return;
      }
      const me: User = await res.json();
      setUser(me);
    } catch (err) {
      console.error("Fetch user failed:", err);
      logout();
    }
  };

  const signup = async (data: SignupData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/signup`, {
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

      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const { access_token } = await res.json();
      localStorage.setItem("token", access_token);
      setToken(access_token);
      await fetchUser(access_token);
      toast.success("Login successful!");
      // Redirect back to where we came from, or dashboard
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
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
  const { user, loading, isAuthenticated } = useAuth();
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
