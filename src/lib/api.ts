// src/lib/api.ts
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public response: Response
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Interface for API request options
interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

// Global reference to auth context functions - will be set by useAuth
let globalLogout: (() => void) | null = null;

export const setGlobalLogout = (logoutFn: () => void) => {
  globalLogout = logoutFn;
};

// Enhanced fetch wrapper with token expiration handling
export const apiRequest = async (
  endpoint: string, 
  options: ApiRequestOptions = {}
): Promise<Response> => {
  const { requiresAuth = true, ...fetchOptions } = options;
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // Check if auth is required but no token exists
  if (requiresAuth && !token) {
    if (globalLogout) {
      globalLogout();
      toast.error("Please log in to continue");
    }
    throw new APIError("No authentication token found", 401, new Response());
  }
  
  // Prepare headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };
  
  // Add auth token if required and available
  if (requiresAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Make the API request
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });
  
  // Handle token expiration (401 Unauthorized)
  if (response.status === 401 && requiresAuth) {
    // Remove invalid tokens
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    
    // Show session expired message
    toast.error("Your session has expired. Please log in again.", {
      duration: 5000,
    });
    
    // Trigger logout
    if (globalLogout) {
      globalLogout();
    }
    
    throw new APIError("Session expired", 401, response);
  }
  
  // Handle other HTTP errors
  if (!response.ok) {
    const errorMessage = await response.text().catch(() => 'Request failed');
    throw new APIError(errorMessage, response.status, response);
  }
  
  return response;
};

// Convenience methods for common HTTP operations
export const apiGet = (endpoint: string, options?: ApiRequestOptions) => 
  apiRequest(endpoint, { ...options, method: 'GET' });

export const apiPost = (endpoint: string, data?: any, options?: ApiRequestOptions) =>
  apiRequest(endpoint, { 
    ...options, 
    method: 'POST', 
    body: data ? JSON.stringify(data) : undefined 
  });

export const apiPut = (endpoint: string, data?: any, options?: ApiRequestOptions) =>
  apiRequest(endpoint, { 
    ...options, 
    method: 'PUT', 
    body: data ? JSON.stringify(data) : undefined 
  });

export const apiDelete = (endpoint: string, options?: ApiRequestOptions) =>
  apiRequest(endpoint, { ...options, method: 'DELETE' });

// Helper to check if token is still valid (optional: decode JWT and check exp)
export const isTokenExpired = (token: string): boolean => {
  try {
    // Decode JWT token (without verification - just to check expiration)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const payload = JSON.parse(jsonPayload);
    const currentTime = Math.floor(Date.now() / 1000);
    
    return payload.exp < currentTime;
  } catch (error) {
    // If we can't decode the token, consider it expired
    return true;
  }
};
