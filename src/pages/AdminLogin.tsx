// src/pages/AdminLogin.tsx

import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

const AdminLogin = () => {
  const { adminLogin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // calls the adminLogin function from useAuth
      await adminLogin(email, password);
      // on success, adminLogin navigates to /admin/dashboard
    } catch (err: any) {
      // adminLogin already fires a toast on error
      console.error("Admin login error:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-6">Admin Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-health-primary text-white py-2 rounded hover:bg-health-secondary disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login as Admin"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
