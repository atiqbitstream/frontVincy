// src/services/LiveSessionService.ts
import axios from 'axios';
import { useAuth } from '../hooks/useAuth'; // Import the useAuth hook

// API base URL - adjust this to match your backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backvincy.onrender.com'




// Types
export interface LiveSession {
  id: string;
  session_title: string;
  host: string;
  description: string;
  date_time: string;
  duration_minutes: number;
  youtube_link: string | null;
  livestatus: boolean;
  created_at: string;
  updated_at: string | null;
}

// Create a service instance with authentication
const createAuthenticatedService = (token: string | null) => {
  // Create axios instance with auth headers if token exists
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: token ? { 
      'Authorization': `Bearer ${token}` 
    } : {}
  });
  
  return {
    async getAllLiveSessions(): Promise<LiveSession[]> {
      const response = await api.get<LiveSession[]>(`/users/live-sessions`);
      return response.data;
    },
  
    async getLiveSession(id: string): Promise<LiveSession> {
      const response = await api.get<LiveSession>(`/users/live-sessions/${id}`);
      return response.data;
    },
  
    async getCurrentLiveSession(): Promise<LiveSession | null> {
      try {
        // Get all live sessions
        const sessions = await this.getAllLiveSessions();
        
        // First check if any session is currently live
        const liveSession = sessions.find(session => session.livestatus);
        if (liveSession) return liveSession;
        
        // If no live session, find the next upcoming session
        const now = new Date();
        const upcomingSessions = sessions
          .filter(session => new Date(session.date_time) > now)
          .sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime());
        
        return upcomingSessions.length > 0 ? upcomingSessions[0] : null;
      } catch (error) {
        console.error('Error fetching current live session:', error);
        return null;
      }
    },
    
    async getPastLiveSessions(limit = 6): Promise<LiveSession[]> {
      try {
        const sessions = await this.getAllLiveSessions();
        const now = new Date();
        
        return sessions
          .filter(session => new Date(session.date_time) < now && session.youtube_link)
          .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())
          .slice(0, limit);
      } catch (error) {
        console.error('Error fetching past sessions:', error);
        return [];
      }
    },
  
    // Helper method to convert LiveSession to PastSession format for UI
    formatAsPastSession(session: LiveSession) {
      let videoUrl = '';
      
      if (session.youtube_link) {
        if (session.youtube_link.includes('<iframe')) {
          // Extract src URL from iframe HTML
          const srcMatch = session.youtube_link.match(/src=["']([^"']+)["']/);
          videoUrl = srcMatch ? srcMatch[1] : '';
        } else {
          // Handle regular YouTube URL
          videoUrl = session.youtube_link.replace('watch?v=', 'embed/');
        }
      }
      
      return {
        id: session.id,
        title: session.session_title,
        date: session.date_time,
        duration: session.duration_minutes.toString(),
        host: session.host,
        thumbnail: `/api/placeholder/400/320`, // Placeholder image
        videoUrl,
        viewCount: Math.floor(Math.random() * 200) + 50, // Mock view count
      };
    },
  
    // Calculate time remaining in user's local timezone
    getTimeRemaining(dateTime: string): string | null {
      const now = new Date();
      const sessionTime = new Date(dateTime);
      
      if (now >= sessionTime) {
        return null;
      }
      
      const diff = sessionTime.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      let timeString = '';
      if (days > 0) timeString += `${days}d `;
      if (hours > 0 || days > 0) timeString += `${hours}h `;
      if (minutes > 0 || hours > 0 || days > 0) timeString += `${minutes}m `;
      timeString += `${seconds}s`;
      
      return timeString;
    }
  };
};

// Hook for using live sessions with authentication
export const useLiveSessionService = () => {
  const { token } = useAuth();
  return createAuthenticatedService(token);
};

// For backward compatibility, export a singleton instance
// This is not recommended for new code - prefer the hook approach
export const liveSessionService = createAuthenticatedService(localStorage.getItem('token'));
export default liveSessionService;