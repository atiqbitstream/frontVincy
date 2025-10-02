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

// Hub API functions
export interface HubItem {
  id: string;
  page_heading: string;
  page_subtext: string;
  category: string;
  description: string | null;
  image_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface HubCreatePayload {
  page_heading: string;
  page_subtext: string;
  category: string;
  description: string | null;
  image_url: string | null;
}

export interface HubUpdatePayload {
  page_heading?: string;
  page_subtext?: string;
  category?: string;
  description?: string | null;
  image_url?: string | null;
}

// Get all hub categories
export const getHubCategories = async (): Promise<HubItem[]> => {
  const response = await apiGet('/admin/hub/');
  return response.json();
};

// Create new hub category
export const createHubCategory = async (data: HubCreatePayload): Promise<HubItem> => {
  const response = await apiPost('/admin/hub/', data);
  return response.json();
};

// Create hub category with image upload
export const createHubCategoryWithImage = async (
  category: string,
  pageHeading: string = "Hub",
  pageSubtext: string = "Explore Categories of Interest",
  description: string = "",
  imageFile: File
): Promise<HubItem> => {
  const formData = new FormData();
  formData.append('category', category);
  formData.append('page_heading', pageHeading);
  formData.append('page_subtext', pageSubtext);
  formData.append('description', description);
  formData.append('image', imageFile);

  const response = await apiRequest('/admin/hub/with-image', {
    method: 'POST',
    body: formData,
    headers: {}, // Let browser set content-type for FormData
  });
  
  return response.json();
};

// Update hub category
export const updateHubCategory = async (id: string, data: HubUpdatePayload): Promise<HubItem> => {
  const response = await apiPut(`/admin/hub/${id}`, data);
  return response.json();
};

// Update hub category with image upload
export const updateHubCategoryWithImage = async (
  id: string,
  category: string,
  pageHeading: string = "Hub",
  pageSubtext: string = "Explore Categories of Interest",
  description: string = "",
  imageFile?: File
): Promise<HubItem> => {
  const formData = new FormData();
  formData.append('category', category);
  formData.append('page_heading', pageHeading);
  formData.append('page_subtext', pageSubtext);
  formData.append('description', description);
  
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await apiRequest(`/admin/hub/${id}/with-image`, {
    method: 'PUT',
    body: formData,
    headers: {}, // Let browser set content-type for FormData
  });
  
  return response.json();
};

// Delete hub category
export const deleteHubCategory = async (id: string): Promise<void> => {
  await apiDelete(`/admin/hub/${id}`);
};

// Get specific hub category
export const getHubCategory = async (id: string): Promise<HubItem> => {
  const response = await apiGet(`/admin/hub/${id}`);
  return response.json();
};

// User Hub API functions
export interface UserHubItem {
  id: string;
  name: string;
  email: string;
  category: string;
  description: string | null;
  url: string | null;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserHubCreatePayload {
  name: string;
  email: string;
  category: string;
  description?: string | null;
  url?: string | null;
  status?: boolean;
}

// Get hub categories for public use (no auth required)
export const getHubCategoriesPublic = async (): Promise<HubItem[]> => {
  const response = await apiRequest('/public/hub-categories', { requiresAuth: false });
  return response.json();
};

// Create user hub entry
export const createUserHubEntry = async (data: UserHubCreatePayload): Promise<UserHubItem> => {
  const response = await apiPost('/user-hub/', data);
  return response.json();
};

// Get user hub entries
export const getUserHubEntries = async (): Promise<UserHubItem[]> => {
  const response = await apiGet('/user-hub/');
  return response.json();
};

// Admin: Get user hub entries by category
export const getUserHubEntriesByCategory = async (category: string): Promise<UserHubItem[]> => {
  const response = await apiGet(`/admin/user-hub/category/${encodeURIComponent(category)}`);
  return response.json();
};
