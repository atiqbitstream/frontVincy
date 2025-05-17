
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// Mock live session data
const initialLiveSession = {
  status: false,
  dateTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16), // Tomorrow
  label: "Introduction to Mind-Body Wellness Techniques",
  link: "https://youtube.com/watch?v=example",
  description: "Join Dr. Sarah Johnson as she introduces various mind-body wellness techniques that can be incorporated into your practice. Learn about the scientific evidence supporting these approaches and how they can benefit your patients.",
  host: "Dr. Sarah Johnson",
  duration: "60" // minutes
};

const LiveSessionManager = () => {
  const [liveSession, setLiveSession] = useState(initialLiveSession);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setLiveSession(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // In a real app, we would save the data to the server
    toast.success("Live session information updated successfully!");
    setIsEditing(false);
  };

  const handleStatusToggle = (checked: boolean) => {
    setLiveSession(prev => ({
      ...prev,
      status: checked
    }));
    
    toast.success(checked 
      ? "Live session is now active! Users will be notified." 
      : "Live session has been deactivated."
    );
  };

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
          <Button onClick={() => setIsEditing(true)}>Edit Session</Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Session Information</h3>
              {!isEditing && (
                <div className="flex items-center space-x-2">
                  <div className={`h-3 w-3 rounded-full ${liveSession.status ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={`text-sm font-medium ${liveSession.status ? 'text-green-600' : 'text-gray-500'}`}>
                    {liveSession.status ? 'Active' : 'Inactive'}
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
                    value={liveSession.label} 
                    onChange={(e) => handleInputChange('label', e.target.value)}
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
                    value={liveSession.description} 
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="session-datetime">Date and Time</Label>
                    <Input 
                      id="session-datetime"
                      type="datetime-local" 
                      value={liveSession.dateTime} 
                      onChange={(e) => handleInputChange('dateTime', e.target.value)}
                    />
                  </div>
                  <div className="sm:w-1/3">
                    <Label htmlFor="session-duration">Duration (minutes)</Label>
                    <Input 
                      id="session-duration"
                      type="number" 
                      value={liveSession.duration} 
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="session-link">YouTube Link</Label>
                  <Input 
                    id="session-link"
                    value={liveSession.link} 
                    onChange={(e) => handleInputChange('link', e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800">Title:</h4>
                  <p className="text-gray-600">{liveSession.label}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Host:</h4>
                  <p className="text-gray-600">{liveSession.host}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Description:</h4>
                  <p className="text-gray-600">{liveSession.description}</p>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <div>
                    <h4 className="font-medium text-gray-800">Date & Time:</h4>
                    <p className="text-gray-600">
                      {new Date(liveSession.dateTime).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Duration:</h4>
                    <p className="text-gray-600">{liveSession.duration} minutes</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">YouTube Link:</h4>
                  <a href={liveSession.link} target="_blank" rel="noopener noreferrer" className="text-health-primary hover:underline">
                    {liveSession.link}
                  </a>
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
                  checked={liveSession.status} 
                  onCheckedChange={handleStatusToggle}
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
                  liveSession.status 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                <div className={`h-3 w-3 rounded-full ${liveSession.status ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span>
                  {liveSession.status 
                    ? 'Live Now: ' + liveSession.label
                    : `Coming soon: ${new Date(liveSession.dateTime).toLocaleDateString()}`
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
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => window.open(liveSession.link, '_blank')}>
                  Test YouTube Link
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => {toast.info("Notification would be sent to all users")}}>
                  Send Notification
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSessionManager;
