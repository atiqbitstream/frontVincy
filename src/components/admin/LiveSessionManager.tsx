import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// LiveSession type based on backend schema
interface LiveSession {
  id: string;
  session_title: string;
  host: string;
  description: string | null;
  date_time: string;
  duration_minutes: number;
  youtube_link: string | null;
  created_at: string;
  updated_at: string | null;
  livestatus: boolean; // Added the new livestatus field
}

// Create and Update payload types based on backend schema
interface LiveSessionPayload {
  session_title: string;
  host: string;
  description: string | null;
  date_time: string;
  duration_minutes: number;
  youtube_link: string | null;
  livestatus: boolean; // Added the new livestatus field
}

const API_URL = import.meta.env.VITE_API_URL;

const LiveSessionManager = () => {
  const { token } = useAuth();
  const [liveSession, setLiveSession] = useState<LiveSession | null>(null);
  const [allSessions, setAllSessions] = useState<LiveSession[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<string>("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Fetch live session data on component mount
  useEffect(() => {
    fetchAllLiveSessions();
  }, []);

  const fetchAllLiveSessions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/live-session/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch live sessions');
      }

      const data = await response.json();
      
      // Sort by date_time to display upcoming sessions first
      const sortedSessions = [...data].sort((a, b) => 
        new Date(b.date_time).getTime() - new Date(a.date_time).getTime()
      );
      
      setAllSessions(sortedSessions);
      
      // If there are any sessions, select the closest upcoming one
      if (sortedSessions.length > 0) {
        const now = new Date().getTime();
        const upcomingSessions = sortedSessions.filter(s => new Date(s.date_time).getTime() > now);
        
        if (upcomingSessions.length > 0) {
          // Select the closest upcoming session
          setLiveSession(upcomingSessions[0]);
        } else {
          // If no upcoming sessions, select the most recent past one
          setLiveSession(sortedSessions[0]);
        }
      } else {
        // Create an empty session object if none exists
        initializeEmptySession();
      }
    } catch (error) {
      console.error("Error fetching live sessions:", error);
      toast.error("Failed to load live session data");
      initializeEmptySession();
    } finally {
      setIsLoading(false);
    }
  };

  const initializeEmptySession = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0);
    
    setLiveSession({
      id: "", // Empty ID indicates this is a new session
      session_title: "New Live Session",
      host: "",
      description: "",
      date_time: tomorrow.toISOString(),
      duration_minutes: 60,
      youtube_link: "",
      created_at: new Date().toISOString(),
      updated_at: null,
      livestatus: false // Initialize with livestatus off
    });
    
    // Automatically enter edit mode when creating a new session
    setIsEditing(true);
  };

  const selectSession = (session: LiveSession) => {
    setLiveSession(session);
    setIsEditing(false);
  };

  const formatDateTimeForInput = (dateTimeStr: string) => {
    return dateTimeStr.slice(0, 16); // Format for datetime-local input
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    if (!liveSession) return;

    setLiveSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const createSession = async () => {
    if (!liveSession) return;

    try {
      const payload: LiveSessionPayload = {
        session_title: liveSession.session_title,
        host: liveSession.host,
        description: liveSession.description,
        date_time: liveSession.date_time,
        duration_minutes: liveSession.duration_minutes,
        youtube_link: liveSession.youtube_link,
        livestatus: liveSession.livestatus
      };

      const response = await fetch(`${API_URL}/admin/live-session/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create live session');
      }

      const newSession = await response.json();
      setLiveSession(newSession);
      
      // Add to all sessions list
      setAllSessions(prev => [...prev, newSession].sort((a, b) => 
        new Date(b.date_time).getTime() - new Date(a.date_time).getTime()
      ));
      
      toast.success("Live session created successfully!");
    } catch (error) {
      console.error("Error creating live session:", error);
      toast.error("Failed to create live session");
    }
  };

  const updateSession = async () => {
    if (!liveSession || !liveSession.id) return;

    try {
      const payload: LiveSessionPayload = {
        session_title: liveSession.session_title,
        host: liveSession.host,
        description: liveSession.description,
        date_time: liveSession.date_time,
        duration_minutes: liveSession.duration_minutes,
        youtube_link: liveSession.youtube_link,
        livestatus: liveSession.livestatus
      };

      const response = await fetch(`${API_URL}/admin/live-session/${liveSession.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to update live session');
      }

      const updatedSession = await response.json();
      setLiveSession(updatedSession);
      
      // Update in the all sessions list
      setAllSessions(prev => prev.map(s => 
        s.id === updatedSession.id ? updatedSession : s
      ).sort((a, b) => 
        new Date(b.date_time).getTime() - new Date(a.date_time).getTime()
      ));
      
      toast.success("Live session updated successfully!");
    } catch (error) {
      console.error("Error updating live session:", error);
      toast.error("Failed to update live session");
    }
  };

  const toggleLiveStatus = async (sessionId: string, newStatus: boolean) => {
    try {
      const response = await fetch(`${API_URL}/admin/live-session/${sessionId}/livestatus`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ livestatus: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update live status');
      }

      const updatedSession = await response.json();
      
      // Update in all sessions list
      setAllSessions(prev => prev.map(s => 
        s.id === sessionId ? updatedSession : s
      ));
      
      // Update current session if it's the one being modified
      if (liveSession?.id === sessionId) {
        setLiveSession(updatedSession);
      }
      
      toast.success(`Live status ${newStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error("Error updating live status:", error);
      toast.error("Failed to update live status");
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/live-session/${sessionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete live session');
      }

      // Remove from all sessions list
      setAllSessions(prev => prev.filter(s => s.id !== sessionId));
      
      // If the deleted session is the current one, select another or create empty
      if (liveSession?.id === sessionId) {
        if (allSessions.length > 1) {
          const remaining = allSessions.filter(s => s.id !== sessionId);
          setLiveSession(remaining[0]);
        } else {
          initializeEmptySession();
        }
      }
      
      setDeleteConfirmId(null);
      toast.success("Live session deleted successfully!");
    } catch (error) {
      console.error("Error deleting live session:", error);
      toast.error("Failed to delete live session");
    }
  };

  const handleSave = async () => {
    if (liveSession?.id) {
      await updateSession();
    } else {
      await createSession();
    }
    setIsEditing(false);
  };

  const handleLiveStatusToggle = (checked: boolean) => {
    if (liveSession?.id) {
      // Update just the live status using the PATCH endpoint
      toggleLiveStatus(liveSession.id, checked);
    } else {
      // For new sessions, just update the local state
      handleInputChange('livestatus', checked);
    }
  };

  const handleTestYouTubeLink = () => {
    if (liveSession?.youtube_link) {
      window.open(liveSession.youtube_link, '_blank');
    } else {
      toast.error("No YouTube link available to test");
    }
  };

  const handleSendNotification = () => {
    toast.info("Notification would be sent to all users");
    // In a real implementation, this would call an API endpoint to send notifications
  };

  // Filter sessions based on date
  const getFilteredSessions = () => {
    if (!dateFilter) {
      return allSessions;
    }
    
    const filterDate = new Date(dateFilter);
    // Set the time to the beginning of the day
    filterDate.setHours(0, 0, 0, 0);
    
    return allSessions.filter(session => {
      const sessionDate = new Date(session.date_time);
      // Set time to beginning of day for comparison
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === filterDate.getTime();
    });
  };
  
  const formatSessionDate = (dateTimeStr: string) => {
    return new Date(dateTimeStr).toLocaleDateString();
  };

  const formatSessionTime = (dateTimeStr: string) => {
    return new Date(dateTimeStr).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isSessionUpcoming = (dateTimeStr: string) => {
    const sessionTime = new Date(dateTimeStr).getTime();
    const now = new Date().getTime();
    return sessionTime > now;
  };

  // First, add this helper function near your other utility functions
  const isSessionEnded = (dateTimeStr: string, durationMinutes: number) => {
    const sessionStartTime = new Date(dateTimeStr).getTime();
    const sessionEndTime = sessionStartTime + (durationMinutes * 60 * 1000);
    const now = new Date().getTime();
    return now > sessionEndTime;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading live session data...</div>
      </div>
    );
  }

  if (!liveSession) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="text-lg">No live session data available</div>
        <Button onClick={initializeEmptySession}>Create New Session</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-health-secondary">Live Session Management</h2>
        {isEditing ? (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={initializeEmptySession}>New Session</Button>
            <Button onClick={() => setIsEditing(true)}>Edit Session</Button>
          </div>
        )}
      </div>
      
      {/* Selected Session Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Session Information</h3>
              {!isEditing && (
                <div className="flex items-center space-x-2">
                  <div className={`h-3 w-3 rounded-full ${liveSession.livestatus ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={`text-sm font-medium ${liveSession.livestatus ? 'text-green-600' : 'text-gray-500'}`}>
                    {liveSession.livestatus ? 'Active' : 'Inactive'}
                  </span>
                </div>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="session-title">Session Title</Label>
                  <Input
                    id="session-title"
                    value={liveSession.session_title}
                    onChange={(e) => handleInputChange('session_title', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="session-host">Host</Label>
                  <Input
                    id="session-host"
                    value={liveSession.host}
                    onChange={(e) => handleInputChange('host', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="session-description">Description</Label>
                  <textarea
                    id="session-description"
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    rows={4}
                    value={liveSession.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="session-datetime">Date and Time</Label>
                    <Input
                      id="session-datetime"
                      type="datetime-local"
                      value={formatDateTimeForInput(liveSession.date_time)}
                      onChange={(e) => handleInputChange('date_time', e.target.value)}
                    />
                  </div>
                  <div className="sm:w-1/3">
                    <Label htmlFor="session-duration">Duration (minutes)</Label>
                    <Input
                      id="session-duration"
                      type="number"
                      value={liveSession.duration_minutes}
                      onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="session-link">YouTube Link</Label>
                  <Input
                    id="session-link"
                    value={liveSession.youtube_link || ''}
                    onChange={(e) => handleInputChange('youtube_link', e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-livestatus"
                    checked={liveSession.livestatus}
                    onCheckedChange={(checked) => handleInputChange('livestatus', checked)}
                  />
                  <Label htmlFor="edit-livestatus">Live Status</Label>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800">Title:</h4>
                  <p className="text-gray-600">{liveSession.session_title}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Host:</h4>
                  <p className="text-gray-600">{liveSession.host}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Description:</h4>
                  <p className="text-gray-600">{liveSession.description || 'No description available'}</p>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <div>
                    <h4 className="font-medium text-gray-800">Date & Time:</h4>
                    <p className="text-gray-600">
                      {new Date(liveSession.date_time).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Duration:</h4>
                    <p className="text-gray-600">{liveSession.duration_minutes} minutes</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">YouTube Link:</h4>
                  {liveSession.youtube_link ? (
                    <a href={liveSession.youtube_link} target="_blank" rel="noopener noreferrer" className="text-health-primary hover:underline">
                      {liveSession.youtube_link}
                    </a>
                  ) : (
                    <p className="text-gray-600">No YouTube link available</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-6">Session Control</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="session-status" className="text-base">Live Status</Label>
                <Switch
                  id="session-status"
                  checked={liveSession.livestatus}
                  onCheckedChange={handleLiveStatusToggle}
                  disabled={!liveSession.id} // Disable for new sessions
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Toggle this switch when you're ready to go live. This will make the session visible to users.
              </p>
            </div>
            <div className="p-4 rounded-md bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-2">Session Preview</h4>
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                  liveSession.livestatus
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                <div className={`h-3 w-3 rounded-full ${liveSession.livestatus ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span>
                  {liveSession.livestatus
                    ? 'Live Now: ' + liveSession.session_title
                    : `Coming soon: ${new Date(liveSession.date_time).toLocaleDateString()}`
                  }
                </span>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                This is how the session appears to users in the navigation bar.
              </p>
            </div>
            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-700 mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start" 
                  onClick={handleTestYouTubeLink}
                  disabled={!liveSession.youtube_link}
                >
                  Test YouTube Link
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start" 
                  onClick={handleSendNotification}
                >
                  Send Notification
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sessions List Section */}
      <Card>
        <CardHeader>
          <CardTitle>All Live Sessions</CardTitle>
          <CardDescription>Manage all your live sessions in one place</CardDescription>
          <div className="flex items-center space-x-2 mt-2">
            <Label htmlFor="date-filter" className="min-w-[80px]">Filter by date:</Label>
            <Input
              id="date-filter"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="max-w-xs"
            />
            {dateFilter && (
              <Button variant="ghost" size="sm" onClick={() => setDateFilter("")}>
                Clear
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredSessions().length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No sessions found
                    </TableCell>
                  </TableRow>
                ) : (
                  getFilteredSessions().map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">{session.session_title}</TableCell>
                      <TableCell>{session.host}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{formatSessionDate(session.date_time)}</span>
                          <span className="text-xs text-gray-500">{formatSessionTime(session.date_time)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{session.duration_minutes} mins</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`h-2 w-2 rounded-full ${
                            isSessionEnded(session.date_time, session.duration_minutes) 
                              ? 'bg-gray-400' 
                              : session.livestatus 
                                ? 'bg-green-500' 
                                : isSessionUpcoming(session.date_time) 
                                  ? 'bg-yellow-500' 
                                  : 'bg-gray-400'
                          }`}></div>
                          <span className="text-sm">
                            {isSessionEnded(session.date_time, session.duration_minutes)
                              ? 'Ended'
                              : session.livestatus
                                ? 'Live'
                                : isSessionUpcoming(session.date_time)
                                  ? 'Upcoming'
                                  : 'Ended'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => selectSession(session)}
                          >
                            Select
                          </Button>
                          {isSessionUpcoming(session.date_time) && !isSessionEnded(session.date_time, session.duration_minutes) ? (
  <Switch
    checked={session.livestatus}
    onCheckedChange={(checked) => toggleLiveStatus(session.id, checked)}
    className="mr-2"
  />
) : (
  <div className="w-9 mr-2"></div>
)}
                          <Dialog open={deleteConfirmId === session.id} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
                            <DialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setDeleteConfirmId(session.id)}
                              >
                                Delete
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete the session "{session.session_title}"? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                                <Button variant="destructive" onClick={() => deleteSession(session.id)}>Delete</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveSessionManager;