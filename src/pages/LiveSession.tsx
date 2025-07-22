import { useState, useRef } from "react"; // Remove useEffect from imports
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Play, Video, Calendar, Clock, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLiveSession } from "../hooks/useLiveSessions";
import liveSessionService from "@/services/LiveSessionService";

const LiveSession = () => {
  const { isAuthenticated } = useAuth();
  const {
    currentSession,
    formattedPastSessions,
    loading,
    isLive,
    timeRemaining, // Use this directly, remove initialTimeRemaining
    error,
    formatLocalDateTime
  } = useLiveSession();
  
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeTab, setActiveTab] = useState("current");
  const didMount = useRef(false);

  const handleWatchPastSession = (session) => {
    setSelectedVideo(session);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  // Remove the useEffect hooks for mounting and timeRemaining
  // They are now handled in the useLiveSession hook

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-health-primary rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Authentication Required</h1>
          <p className="text-foreground/70">Please log in to access live sessions.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Something went wrong</h1>
          <p className="text-foreground/70">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-health-secondary mb-2">Live Sessions</h1>
          {currentSession && !isLive && timeRemaining && (
            <div className="text-xl font-medium text-foreground/80">
              Next session starting in: <span className="text-health-primary">{timeRemaining}</span>
            </div>
          )}
        </header>

        <Tabs defaultValue="current" className="max-w-4xl mx-auto mb-12" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="current">Current/Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Sessions</TabsTrigger>
            <TabsTrigger value="all">All Sessions</TabsTrigger>
          </TabsList>

          {/* Current/Upcoming Session Tab */}
          <TabsContent value="current">
            {currentSession ? (
              <div className="bg-card text-card-foreground rounded-lg shadow overflow-hidden mb-12">
                {isLive && currentSession.youtube_link ? (
                  <div className="relative pb-[56.25%] h-0">
                    {currentSession.youtube_link.includes('<iframe') ? (
                      // If youtube_link contains iframe HTML, render it directly
                      <div 
                        className="absolute top-0 left-0 w-full h-full"
                        dangerouslySetInnerHTML={{ 
                          __html: currentSession.youtube_link.replace(
                            /width="\d+"/, 'width="100%"'
                          ).replace(
                            /height="\d+"/, 'height="100%"'
                          ).replace(
                            /class="[^"]*"/, 'class="absolute top-0 left-0 w-full h-full"'
                          ).replace(
                            /<iframe/, '<iframe class="absolute top-0 left-0 w-full h-full"'
                          )
                        }} 
                      />
                    ) : (
                      // If youtube_link is a URL, handle it the old way
                      <iframe
                        src={`${currentSession.youtube_link.replace('watch?v=', 'embed/')}?autoplay=1`}
                        className="absolute top-0 left-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Live Session"
                      />
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-100 dark:bg-gray-800 h-64 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="text-health-primary text-2xl font-bold mb-2">Coming Soon</div>
                      {timeRemaining && (
                        <div className="text-lg text-foreground/70">Live in {timeRemaining}</div>
                      )}
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{currentSession.session_title}</h2>
                    {isLive ? (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                        LIVE NOW
                      </Badge>
                    ) : (
                      <Badge variant="outline">Upcoming</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-y-2 mb-4 text-sm">
                    <div className="w-full sm:w-1/2 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span className="font-medium mr-2">Host:</span>
                      <span className="text-foreground/70">{currentSession.host}</span>
                    </div>
                    <div className="w-full sm:w-1/2 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="font-medium mr-2">Duration:</span>
                      <span className="text-foreground/70">{currentSession.duration_minutes} minutes</span>
                    </div>
                    <div className="w-full flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-medium mr-2">Scheduled for:</span>
                      <span className="text-foreground/70">{formatLocalDateTime(currentSession.date_time)}</span>
                    </div>
                  </div>
                  <p className="text-foreground/80 mb-6">{currentSession.description}</p>
                  {isAuthenticated ? (
                    isLive && currentSession.youtube_link ? (
                      <Button
                        className="w-full"
                        onClick={() => window.open(currentSession.youtube_link, '_blank')}
                      >
                        Watch on YouTube
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            localStorage.setItem('reminder-set', currentSession.id);
                            alert("We'll notify you when the session goes live!");
                          }
                        }}
                      >
                        Set Reminder
                      </Button>
                    )
                  ) : (
                    <div className="text-center text-foreground/70">
                      <p>Please log in to access live sessions.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center p-12 bg-card rounded-lg shadow">
                <h2 className="text-xl font-bold text-foreground mb-2">No Upcoming Sessions</h2>
                <p className="text-foreground/70">Check back later for new sessions.</p>
              </div>
            )}
          </TabsContent>

          {/* Past Sessions Tab */}
          <TabsContent value="past">
            {formattedPastSessions.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formattedPastSessions.map(session => (
                    <Card key={session.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-40">
                        <img
                          src={session.thumbnail}
                          alt={session.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleWatchPastSession(session)}
                          >
                            <Play className="h-4 w-4" />
                            Watch Now
                          </Button>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {session.duration} min
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-base mb-1 line-clamp-2" title={session.title}>
                          {session.title}
                        </h3>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{session.host}</span>
                          <span>{format(new Date(session.date), 'MMM d, yyyy')}</span>
                        </div>
                        
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center p-12 bg-card rounded-lg shadow">
                <h2 className="text-xl font-bold text-foreground mb-2">No Past Sessions</h2>
                <p className="text-foreground/70">Check back after our first live session.</p>
              </div>
            )}
          </TabsContent>

          {/* All Sessions Tab */}
          <TabsContent value="all">
            <AllSessionsList 
              currentSession={currentSession} 
              pastSessions={formattedPastSessions} 
              formatLocalDateTime={formatLocalDateTime}
              isLive={isLive}
              onWatchPast={handleWatchPastSession}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Video Modal for Past Sessions */}
      <Dialog open={!!selectedVideo} onOpenChange={closeVideoModal}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
          {selectedVideo && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedVideo.title}</DialogTitle>
              </DialogHeader>
              <div className="relative pb-[56.25%] h-0">
                <iframe
                  src={selectedVideo.videoUrl}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedVideo.title}
                />
              </div>
              <div className="text-sm">
                <div className="font-medium">{selectedVideo.host}</div>
                <div className="text-muted-foreground">
                  {format(new Date(selectedVideo.date), 'MMMM d, yyyy')} • {selectedVideo.duration} min 
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Component to display all sessions in a chronological list
const AllSessionsList = ({ currentSession, pastSessions, formatLocalDateTime, isLive, onWatchPast }) => {
  // Combine all sessions for display
  const allSessions = [];
  
  // Add current/upcoming session if exists
  if (currentSession) {
    allSessions.push({
      ...currentSession,
      type: isLive ? 'live' : 'upcoming',
      formattedDate: formatLocalDateTime(currentSession.date_time)
    });
  }
  
  // Add past sessions - check if they're actually past based on date
  pastSessions.forEach(session => {
    const sessionDate = new Date(session.date || session.date_time);
    const now = new Date();
    
    allSessions.push({
      ...session,
      type: sessionDate < now ? 'past' : 'upcoming', // Determine type based on actual date
      formattedDate: formatLocalDateTime(session.date || session.date_time)
    });
  });

  
  // Sort all sessions by date (newest first)
  allSessions.sort((a, b) => {
    const dateA = new Date(a.date || a.date_time);
    const dateB = new Date(b.date || b.date_time);
    return dateB.getTime() - dateA.getTime();
  });
  
 return (
    <div className="space-y-4">
      {allSessions.length > 0 ? (
        allSessions.map(session => {
          // Double-check session type based on current date
          const sessionDate = new Date(session.date || session.date_time);
          const now = new Date();
          const actualType = sessionDate < now ? 'past' : (session.livestatus ? 'live' : 'upcoming');
          
          return (
            <Card key={session.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 h-40 md:h-auto relative">
                  {session.thumbnail ? (
                    <img src={session.thumbnail} alt={session.title || session.session_title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                      <Video className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                  {/* Only show live badge for actual live sessions */}
                  {actualType === 'live' && sessionDate >= now && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                        LIVE NOW
                      </Badge>
                    </div>
                  )}
                  {actualType === 'upcoming' && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="outline">Upcoming</Badge>
                    </div>
                  )}
                </div>
                <div className="p-4 md:p-6 w-full md:w-2/3">
                  <h3 className="text-lg font-semibold mb-2">
                    {session.title || session.session_title}
                  </h3>
                  <div className="flex flex-col space-y-2 text-sm mb-4">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {session.formattedDate}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <User className="h-4 w-4 mr-2" />
                      {session.host}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      {session.duration || session.duration_minutes} minutes
                    </div>
                  </div>
                  {/* Fix button logic based on actual session type */}
                  {actualType === 'past' ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => onWatchPast(session)}
                    >
                      <Play className="h-4 w-4" />
                      Watch Recording
                    </Button>
                  ) : actualType === 'live' ? (
                    <Button size="sm" className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      Join Live Session
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      Set Reminder
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })
      ) : (
        <div className="text-center p-12 bg-card rounded-lg shadow">
          <h2 className="text-xl font-bold text-foreground mb-2">No Sessions Found</h2>
          <p className="text-foreground/70">Check back later for upcoming sessions.</p>
        </div>
      )}
    </div>
  );
};

export default LiveSession;
