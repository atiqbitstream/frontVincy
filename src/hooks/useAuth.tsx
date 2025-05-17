
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  fullName: string;
  token: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll mock a successful login
      console.log('Logging in with:', email, password);
      
      // Mock successful login response
      const mockUser = {
        id: '1234',
        email: email,
        fullName: 'Test User',
        token: 'mock-jwt-token',
        isAdmin: false
      };
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      console.log('Admin logging in with:', email, password);
      
      // Check if this is an admin email (in a real app, this would be an API call)
      if (email === 'admin@example.com' && password === 'admin123') {
        const mockAdminUser = {
          id: 'admin-1',
          email: email,
          fullName: 'Admin User',
          token: 'mock-admin-jwt-token',
          isAdmin: true
        };
        
        localStorage.setItem('user', JSON.stringify(mockAdminUser));
        setUser(mockAdminUser);
        
        toast.success('Admin login successful!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid admin credentials.');
        throw new Error('Invalid admin credentials');
      }
    } catch (error) {
      console.error('Admin login failed:', error);
      toast.error('Admin login failed. Please check your credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: any) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      console.log('Signing up with:', userData);
      
      // Mock successful signup
      const mockUser = {
        id: '1234',
        email: userData.email,
        fullName: userData.full_name,
        token: 'mock-jwt-token',
        isAdmin: false
      };
      
      // Store user in localStorage but don't log them in right away
      // Just redirect to login page after successful signup
      toast.success('Signup successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error);
      toast.error('Signup failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.info('You have been logged out');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        adminLogin,
        signup,
        logout,
        isAuthenticated: !!user,
        isAdmin: !!user?.isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Route guard component
export const RequireAuth = ({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (adminOnly && !isAdmin) {
        toast.error('You do not have permission to access this page');
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, isAdmin, loading, navigate, adminOnly]);
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (adminOnly) {
    return isAuthenticated && isAdmin ? <>{children}</> : null;
  }
  
  return isAuthenticated ? <>{children}</> : null;
};

// Admin route guard component
export const RequireAdmin = ({ children }: { children: ReactNode }) => {
  return <RequireAuth adminOnly>{children}</RequireAuth>;
};
