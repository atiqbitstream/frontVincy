// src/hooks/useLiveSession.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { useLiveSessionService } from '../services/LiveSessionService';
import type { LiveSession } from '../services/LiveSessionService';

interface LiveSessionState {
  currentSession: LiveSession | null;
  pastSessions: LiveSession[];
  upcomingSessions: LiveSession[];
  isLive: boolean;
  timeRemaining: string | null;
  loading: boolean;
  error: Error | null;
}

interface FormattedPastSession {
  id: string;
  title: string;
  date: string;
  duration: string;
  host: string;
  thumbnail: string;
  videoUrl: string;
  viewCount: number;
}

export function useLiveSession() {
  const { token } = useAuth();
  const liveSessionService = useLiveSessionService();
  const [state, setState] = useState<LiveSessionState>({
    currentSession: null,
    pastSessions: [],
    upcomingSessions: [],
    isLive: false,
    timeRemaining: null,
    loading: true,
    error: null
  });
  
  const [formattedPastSessions, setFormattedPastSessions] = useState<FormattedPastSession[]>([]);
  
  // Use refs to track fetch state and prevent excessive calls
  const isFetchingRef = useRef(false);
  const lastFetchTimeRef = useRef(0);
  const sessionDateTimeRef = useRef<string | null>(null);
  
  const fetchLiveSessionData = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (isFetchingRef.current) return;
    
    // Debounce requests - prevent calling more than once every 10 seconds
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 10000) return;
    
    // Check if we're still on the LiveSession page
    if (typeof window !== 'undefined' && !localStorage.getItem('livesessionactive')) return;
    
    // Set fetch flags
    isFetchingRef.current = true;
    lastFetchTimeRef.current = now;
    
    if (!token) {
      setState(prev => ({ ...prev, loading: false, error: new Error('Authentication required') }));
      isFetchingRef.current = false;
      return;
    }
    
    try {
      // Only set loading state on initial load
      if (state.loading) {
        setState(prev => ({ ...prev, loading: true, error: null }));
      }
      
      // Get all sessions
      const allSessions = await liveSessionService.getAllLiveSessions();
      const nowDate = new Date();
      
      // Categorize sessions
      const pastSessions = allSessions
        .filter(session => new Date(session.date_time) < nowDate && session.youtube_link)
        .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime());
      
      const upcomingSessions = allSessions
        .filter(session => new Date(session.date_time) > nowDate && !session.livestatus)
        .sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime());
        
      // Find current live session
      const liveSession = allSessions.find(session => session.livestatus);
      
      // Determine current session (live or next upcoming)
      const currentSession = liveSession || (upcomingSessions.length > 0 ? upcomingSessions[0] : null);
      
      // Format past sessions for UI
      const formatted = pastSessions.map(session => 
        liveSessionService.formatAsPastSession(session)
      );
      setFormattedPastSessions(formatted);
      
      // Save the current session date for countdown
      if (currentSession) {
        sessionDateTimeRef.current = currentSession.date_time;
      } else {
        sessionDateTimeRef.current = null;
      }
      
      // Determine live status and initial time remaining
      let timeRemaining: string | null = null;
      let isLive = false;

      if (currentSession) {
        isLive = currentSession.livestatus;
        if (!isLive) {
          timeRemaining = liveSessionService.getTimeRemaining(currentSession.date_time);
        }
      }

      setState({
        currentSession,
        pastSessions,
        upcomingSessions,
        isLive,
        timeRemaining,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error("Error fetching live session data:", error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error : new Error('Unknown error') 
      }));
    } finally {
      isFetchingRef.current = false;
    }
  }, [token, liveSessionService, state.loading]);

  // Set up an active marker when the component mounts
  useEffect(() => {
    // Set flag to indicate the component is active
    localStorage.setItem('livesessionactive', 'true');
    
    return () => {
      // Clean up flag when component unmounts
      localStorage.removeItem('livesessionactive');
    };
  }, []);

  // Main data fetching effect - initial load and polling
  useEffect(() => {
    // Initial data fetch
    fetchLiveSessionData();
    
    // Poll every 30 seconds (reduced from every minute)
    const intervalId = setInterval(fetchLiveSessionData, 30000);
    
    return () => clearInterval(intervalId);
  }, [fetchLiveSessionData]);

  // Dedicated effect for countdown timer that doesn't trigger re-fetching
  useEffect(() => {
    if (!sessionDateTimeRef.current || state.isLive) return;
    
    const updateTimeRemaining = () => {
      if (!sessionDateTimeRef.current) return;
      
      const remaining = liveSessionService.getTimeRemaining(sessionDateTimeRef.current);
      
      // Only update if the time has actually changed
      if (remaining !== state.timeRemaining) {
        setState(prev => ({
          ...prev,
          timeRemaining: remaining
        }));
      }
    };
    
    // Update immediately and then every second
    updateTimeRemaining();
    const countdownId = setInterval(updateTimeRemaining, 1000);
    
    return () => clearInterval(countdownId);
  }, [state.isLive, liveSessionService, state.timeRemaining]);

  // Effect to reload if token changes
  useEffect(() => {
    if (token) {
      // Reset timer to allow immediate fetch
      lastFetchTimeRef.current = 0;
      fetchLiveSessionData();
    }
  }, [token, fetchLiveSessionData]);

  return {
    ...state,
    formattedPastSessions,
    refresh: fetchLiveSessionData,
    
    // Helper method to format date in local timezone
    formatLocalDateTime: (dateTimeString: string) => {
      const dateTime = new Date(dateTimeString);
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short'
      };
      return dateTime.toLocaleDateString(undefined, options);
    }
  };
}

export default useLiveSession;