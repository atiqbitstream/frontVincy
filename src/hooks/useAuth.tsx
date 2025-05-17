import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { toast } from "sonner";

// Environment variable for API base URL
const API_URL = import.meta.env.VITE_API_URL;

type User = {
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

interface SignupData {
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
  loading: boolean;
  signup: (data: SignupData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch current user if token exists on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchUser(token);
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const me: User = await res.json();
        setUser(me);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Fetch user failed:", error);
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
      await fetchUser(access_token);
      toast.success("Login successful!");
      navigate("/dashboard");
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
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { state: { from: location } });
    }
  }, [loading, user, navigate, location]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  return user ? <>{children}</> : null;
};

export const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      toast.error("You do not have permission to access this page");
      navigate("/dashboard");
    }
  }, [loading, user, navigate]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  return user && user.isAdmin ? <>{children}</> : null;
};
