
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, RequireAuth, RequireAdmin } from "./hooks/useAuth";
import { ThemeProvider } from "./hooks/useTheme";

import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

// Pages to create later
import About from "./pages/About";
import News from "./pages/News";
import Contact from "./pages/Contact";
import LiveSession from "./pages/LiveSession";
import Landing from "./pages/Landing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/signup" element={<SignUp />} />
              <Route 
                path="/dashboard" 
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  <RequireAdmin>
                    <AdminDashboard />
                  </RequireAdmin>
                } 
              />
              <Route 
                path="/about" 
                element={<About />} 
              />
              <Route 
                path="/news" 
                element={<News />} 
              />
              <Route 
                path="/contact" 
                element={<Contact />} 
              />
              <Route 
                path="/live-session" 
                element={<LiveSession />} 
              />
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard-redirect" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
