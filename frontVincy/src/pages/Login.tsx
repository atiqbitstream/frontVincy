// File: src/pages/Login.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login, loading } = useAuth();

  // Enhanced validation functions
  const validateEmail = (email: string): string | null => {
    if (!email) return "Email address is required";
    if (email.length > 254) return "Email address is too long";
    
    // Professional email regex validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email.trim())) return "Please enter a valid email address";
    
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required";
    if (password.length < 1) return "Password cannot be empty";
    if (password.length > 128) return "Password is too long";
    if (password.trim() !== password) return "Password cannot start or end with spaces";
    
    return null;
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Real-time validation on blur
  const handleEmailBlur = () => {
    const emailError = validateEmail(email);
    setErrors(prev => ({
      ...prev,
      email: emailError || undefined
    }));
  };

  const handlePasswordBlur = () => {
    const passwordError = validatePassword(password);
    setErrors(prev => ({
      ...prev,
      password: passwordError || undefined
    }));
  };

  // Clear errors when user starts typing
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    // Clear error when user starts typing
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Calls FastAPI /login, stores access_token, fetches user :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}
      await login(email, password);
      // On success, useAuth redirects you (to "/dashboard") and toasts a success
    } catch (error) {
      // Errors (e.g. incorrect credentials) are already toasted inside useAuth
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-health-secondary">
            W.O.M.B
          </CardTitle>
          <CardDescription>Wellness Optimal Mind Body</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                className={errors.email ? "border-red-500" : ""}
                maxLength={254}
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="text-red-500">⚠</span>
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-health-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                className={errors.password ? "border-red-500" : ""}
                maxLength={128}
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="text-red-500">⚠</span>
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-health-primary hover:bg-health-secondary"
              disabled={loading || !email || !password}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center mt-2">
              <Link
                to="/admin-login"
                className="text-sm text-health-primary hover:underline"
              >
                Login as Admin
              </Link>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col">
          <div className="text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-health-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
