
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Play, Video } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface LiveSessionData {
  status: boolean;
  dateTime: string;
  label: string;
  link: string;
  description: string;
  host: string;
  duration: string;
}

interface PastSession {
  id: string;
  title: string;
  date: string;
  duration: string;
  host: string;
  thumbnail: string;
  videoUrl: string;
  viewCount: number;
}

const LiveSession = () => {
  const [liveSession, setLiveSession] = useState<LiveSessionData | null>(null);
  const [pastSessions, setPastSessions] = useState<PastSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState<PastSession | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call to fetch the live session data
    const mockLiveSessionData = {
      status: false, // Set to true to simulate an active session
      dateTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      label: "Introduction to Mind-Body Wellness Techniques",
      link: "https://youtube.com/watch?v=example",
      description: "Join Dr. Sarah Johnson as she introduces various mind-body wellness techniques that can be incorporated into your practice. Learn about the scientific evidence supporting these approaches and how they can benefit your patients.",
      host: "Dr. Sarah Johnson",
      duration: "60" // minutes
    };
    
    const mockPastSessions = [
      {
        id: "1",
        title: "Advanced Therapeutic Sound Techniques",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        duration: "45",
        host: "Dr. Sarah Johnson",
        thumbnail: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Example video
        viewCount: 153
      },
      {
        id: "2",
        title: "Integrating Light Therapy with Standard Medical Practices",
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        duration: "50",
        host: "Michael Chen",
        thumbnail: "https://images.unsplash.com/photo-1483058712412-4245e9b90334",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Example video
        viewCount: 124
      },
      {
        id: "3",
        title: "Burn Recovery: New Approaches in Healing",
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days ago
        duration: "55",
        host: "Dr. Lisa Rodriguez",
        thumbnail: "https://images.unsplash.com/photo-1521322800607-8c38375eef04",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Example video
        viewCount: 98
      }
    ];
    
    setLiveSession(mockLiveSessionData);
    setPastSessions(mockPastSessions);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!liveSession) return;
    
    // Calculate and update time remaining
    const updateTimeRemaining = () => {
      const now = new Date();
      const sessionTime = new Date(liveSession.dateTime);
      
      if (now >= sessionTime || liveSession.status) {
        setTimeRemaining(null);
        return;
      }
      
      const diff = sessionTime.getTime() - now.getTime();
      
      // Calculate days, hours, minutes, seconds
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      // Format the time remaining string
      let timeString = '';
      if (days > 0) timeString += `${days}d `;
      if (hours > 0 || days > 0) timeString += `${hours}h `;
      if (minutes > 0 || hours > 0 || days > 0) timeString += `${minutes}m `;
      timeString += `${seconds}s`;
      
      setTimeRemaining(timeString);
    };
    
    // Update immediately and then every second
    updateTimeRemaining();
    const intervalId = setInterval(updateTimeRemaining, 1000);
    
    return () => clearInterval(intervalId);
  }, [liveSession]);

  const handleWatchPastSession = (session: PastSession) => {
    setSelectedVideo(session);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

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

  if (!liveSession) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">No Live Session Scheduled</h1>
          <p className="text-foreground/70">Check back later for upcoming sessions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-health-secondary mb-2">Live Session</h1>
          {!liveSession.status && timeRemaining && (
            <div className="text-xl font-medium text-foreground/80">
              Starting in: <span className="text-health-primary">{timeRemaining}</span>
            </div>
          )}
        </header>

        <div className="max-w-3xl mx-auto bg-card text-card-foreground rounded-lg shadow overflow-hidden mb-12">
          {liveSession.status ? (
            <div className="relative pb-[56.25%] h-0">
              <iframe 
                src={`${liveSession.link.replace('watch?v=', 'embed/')}?autoplay=1`}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Live Session"
              />
            </div>
          ) : (
            <div className="bg-gray-100 h-64 flex items-center justify-center">
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
              <h2 className="text-xl font-bold">{liveSession.label}</h2>
              {liveSession.status && (
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm font-medium text-red-500">LIVE NOW</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-y-2 mb-4 text-sm">
              <div className="w-full sm:w-1/2">
                <span className="font-medium mr-2">Host:</span>
                <span className="text-foreground/70">{liveSession.host}</span>
              </div>
              <div className="w-full sm:w-1/2">
                <span className="font-medium mr-2">Duration:</span>
                <span className="text-foreground/70">{liveSession.duration} minutes</span>
              </div>
              <div className="w-full">
                <span className="font-medium mr-2">Scheduled for:</span>
                <span className="text-foreground/70">
                  {new Date(liveSession.dateTime).toLocaleString()}
                </span>
              </div>
            </div>
            
            <p className="text-foreground/80 mb-6">{liveSession.description}</p>
            
            {isAuthenticated ? (
              liveSession.status ? (
                <Button 
                  className="w-full"
                  onClick={() => window.open(liveSession.link, '_blank')}
                >
                  Watch on YouTube
                </Button>
              ) : (
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('reminder-set', 'true');
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

        {/* Past Sessions Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-health-secondary mb-6 flex items-center">
            <Video className="mr-2 h-5 w-5" />
            Past Sessions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastSessions.map(session => (
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
                  <h3 className="font-medium text-base mb-1 line-clamp-2" title={session.title}>
                    {session.title}
                  </h3>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{session.host}</span>
                    <span>{format(new Date(session.date), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {session.viewCount} views
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
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
                  {format(new Date(selectedVideo.date), 'MMMM d, yyyy')} • {selectedVideo.duration} min • {selectedVideo.viewCount} views
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LiveSession;
