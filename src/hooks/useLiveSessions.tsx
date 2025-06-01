// src/hooks/useLiveSession.ts
import { useState, useEffect } from 'react';
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

  // Simple fetch function - no debouncing, no refs
  const fetchLiveSessionData = async () => {
    console.log('Fetching live session data...');
    
    try {
      const allSessions = await liveSessionService.getAllLiveSessions();
      const nowDate = new Date();

      // Past sessions: date_time < now (regardless of livestatus)
      const pastSessions = allSessions
        .filter((session) => new Date(session.date_time) < nowDate)
        .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime());

      // Upcoming sessions: date_time > now && !livestatus
      const upcomingSessions = allSessions
        .filter((session) => new Date(session.date_time) > nowDate && !session.livestatus)
        .sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime());

      // Live session: livestatus === true AND date_time is within reasonable time (not past)
      const liveSession = allSessions.find((session) => 
        session.livestatus && new Date(session.date_time) >= nowDate
      );
      
      const currentSession = liveSession || (upcomingSessions.length > 0 ? upcomingSessions[0] : null);

      // Format past sessions - remove view count
      const formatted = pastSessions.map((session) => ({
        ...liveSessionService.formatAsPastSession(session),
        viewCount: 0 // Remove fake view counts
      }));

      const isLive = !!liveSession;
      let timeRemaining: string | null = null;
      
      if (currentSession && !isLive) {
        timeRemaining = liveSessionService.getTimeRemaining(currentSession.date_time);
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

      setFormattedPastSessions(formatted);
      
      console.log('Live session data updated successfully');
      
    } catch (error) {
      console.error('Error fetching live session data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error('Failed to fetch live sessions'),
      }));
    }
  };

  // Main polling effect - runs once on mount, then every 30 seconds
  useEffect(() => {
    console.log('Setting up live session polling...');
    
    // Initial fetch
    fetchLiveSessionData();
    
    // Set up polling interval
    const interval = setInterval(() => {
      console.log('Polling for live session updates...');
      fetchLiveSessionData();
    }, 30000); // 30 seconds
    
    // Cleanup
    return () => {
      console.log('Cleaning up live session polling');
      clearInterval(interval);
    };
  }, [token]); // Only re-run if token changes

  // Countdown effect - updates time remaining every second for upcoming sessions
  useEffect(() => {
    if (!state.currentSession || state.isLive) {
      return;
    }

    const updateCountdown = () => {
      const remaining = liveSessionService.getTimeRemaining(state.currentSession!.date_time);
      setState(prev => ({
        ...prev,
        timeRemaining: remaining
      }));
    };

    // Update immediately
    updateCountdown();
    
    // Update every second
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(countdownInterval);
  }, [state.currentSession, state.isLive]); // Re-run when session or live status changes

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