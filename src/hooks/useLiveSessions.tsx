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
    error: null,
  });
  
  const [formattedPastSessions, setFormattedPastSessions] = useState<FormattedPastSession[]>([]);
  
  // Use refs to prevent infinite loops
  const isFetchingRef = useRef(false);
  const lastFetchTimeRef = useRef(0);
  const sessionDateTimeRef = useRef<string | null>(null);
  const mountedRef = useRef(true);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Stable fetch function - memoized with proper dependencies
  const fetchLiveSessionData = useCallback(async () => {
    if (isFetchingRef.current) {
      console.log('Skipping fetch - already fetching');
      return;
    }

    // Increase debounce to 5 seconds to prevent spam
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 5000) {
      console.log('Skipping fetch - debounce period not elapsed');
      return;
    }

    isFetchingRef.current = true;
    lastFetchTimeRef.current = now;
    console.log('Starting live session data fetch');

    try {
      const allSessions = await liveSessionService.getAllLiveSessions();
      
      if (!mountedRef.current) return; // Component unmounted
      
      const nowDate = new Date();

      // Past sessions: date_time < now && has youtube_link
      const pastSessions = allSessions
        .filter((session) => new Date(session.date_time) < nowDate && session.youtube_link)
        .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime());

      // Upcoming sessions: date_time > now && !livestatus
      const upcomingSessions = allSessions
        .filter((session) => new Date(session.date_time) > nowDate && !session.livestatus)
        .sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime());

      // Live session if any has livestatus === true
      const liveSession = allSessions.find((session) => session.livestatus);
      const currentSession = liveSession || (upcomingSessions.length > 0 ? upcomingSessions[0] : null);

      // Format past sessions for UI
      const formatted = pastSessions.map((session) =>
        liveSessionService.formatAsPastSession(session)
      );

      if (mountedRef.current) {
        setFormattedPastSessions(formatted);

        if (currentSession) {
          sessionDateTimeRef.current = currentSession.date_time;
        } else {
          sessionDateTimeRef.current = null;
        }

        let timeRemaining: string | null = null;
        let isLive = false;

        if (currentSession) {
          isLive = !!currentSession.livestatus;
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
          error: null,
        });

        console.log('Processed data:', {
          currentSession: currentSession?.session_title,
          pastSessions: pastSessions.length,
          upcomingSessions: upcomingSessions.length,
          isLive
        });
      }
    } catch (error) {
      console.error('Error fetching live session data:', error);
      if (mountedRef.current) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error : new Error('Unknown error'),
        }));
      }
    } finally {
      isFetchingRef.current = false;
    }
  }, [liveSessionService]); // Remove token dependency to prevent recreating

  // Setup polling on mount only
  useEffect(() => {
    console.log('Setting up live session polling');
    mountedRef.current = true;
    
    // Clear any existing intervals
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Initial fetch
    fetchLiveSessionData();

    // Set up polling every 30 seconds
    pollingIntervalRef.current = setInterval(() => {
      if (mountedRef.current) {
        fetchLiveSessionData();
      }
    }, 30000);

    console.log('⏱️ Polling started (30s interval)');

    return () => {
      console.log('🧹 Cleaning up polling interval');
      mountedRef.current = false;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run on mount/unmount

  // Separate effect for countdown
  useEffect(() => {
    // Clear existing countdown interval
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    if (!sessionDateTimeRef.current || state.isLive) {
      return;
    }

    const updateTimeRemaining = () => {
      if (!sessionDateTimeRef.current || !mountedRef.current) return;
      
      const remaining = liveSessionService.getTimeRemaining(sessionDateTimeRef.current);
      
      setState((prev) => {
        if (remaining !== prev.timeRemaining) {
          return { ...prev, timeRemaining: remaining };
        }
        return prev;
      });
    };

    // Initial update
    updateTimeRemaining();

    // Set up countdown interval
    countdownIntervalRef.current = setInterval(updateTimeRemaining, 1000);

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [state.isLive, sessionDateTimeRef.current, liveSessionService]);

  // Handle token changes
  useEffect(() => {
    if (token) {
      console.log('Token changed, refreshing data');
      lastFetchTimeRef.current = 0; // Reset debounce
      fetchLiveSessionData();
    }
  }, [token, fetchLiveSessionData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  return {
    ...state,
    formattedPastSessions,
    refresh: fetchLiveSessionData,
    formatLocalDateTime: (dateTimeString: string) => {
      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
      });
    },
  };
}

export default useLiveSession;