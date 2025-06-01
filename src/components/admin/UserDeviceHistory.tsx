import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface DeviceHistoryEntry {
  id: string;
  created_at: string;
  created_by: string;
  device_status: boolean;
  temperature?: number;
  color?: string;
  volume?: number;
  frequency?: number;
  intensity?: number;
  flow_rate?: number;
  pressure?: number;
}

interface UserDeviceHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  endpoint: string;
  userId: string;
  userName: string;
}

const UserDeviceHistory = ({ isOpen, onClose, title, endpoint, userId, userName }: UserDeviceHistoryProps) => {
  const [history, setHistory] = useState<DeviceHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchHistory = async () => {
    if (!isOpen) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/admin/device-controls${endpoint}/users/${userId}`, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch device history');
      
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching device history:', error);
      toast.error('Failed to load device history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [isOpen, userId, endpoint]);

  const renderDeviceControls = (entry: DeviceHistoryEntry) => {
    const commonClasses = "grid grid-cols-2 gap-4 items-center mb-2";
    const labelClasses = "text-sm font-medium text-gray-600";
    const valueClasses = "text-sm font-medium text-gray-900";

    return (
      <div className="space-y-4">
        {/* Always show device status */}
        <div className={commonClasses}>
          <span className={labelClasses}>Status:</span>
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${entry.device_status ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={valueClasses}>{entry.device_status ? 'ON' : 'OFF'}</span>
          </div>
        </div>

        {/* Temperature (for temp tank) */}
        {entry.temperature !== undefined && (
          <div className={commonClasses}>
            <span className={labelClasses}>Temperature:</span>
            <span className={valueClasses}>{entry.temperature}°F</span>
          </div>
        )}

        {/* Color (for LED therapy) */}
        {entry.color !== undefined && (
          <div className={commonClasses}>
            <span className={labelClasses}>Color:</span>
            <span className={valueClasses}>{entry.color}</span>
          </div>
        )}

        {/* Volume and Frequency (for sound system) */}
        {entry.volume !== undefined && (
          <div className={commonClasses}>
            <span className={labelClasses}>Volume:</span>
            <span className={valueClasses}>{entry.volume}%</span>
          </div>
        )}
        {entry.frequency !== undefined && (
          <div className={commonClasses}>
            <span className={labelClasses}>Frequency:</span>
            <span className={valueClasses}>{entry.frequency} Hz</span>
          </div>
        )}

        {/* Intensity (for steam generator/nanoflicker) */}
        {entry.intensity !== undefined && (
          <div className={commonClasses}>
            <span className={labelClasses}>Intensity:</span>
            <span className={valueClasses}>{entry.intensity}%</span>
          </div>
        )}

        {/* Flow rate and Pressure (for water pump) */}
        {entry.flow_rate !== undefined && (
          <div className={commonClasses}>
            <span className={labelClasses}>Flow Rate:</span>
            <span className={valueClasses}>{entry.flow_rate} L/min</span>
          </div>
        )}
        {entry.pressure !== undefined && (
          <div className={commonClasses}>
            <span className={labelClasses}>Pressure:</span>
            <span className={valueClasses}>{entry.pressure} PSI</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title} History - {userName}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-health-primary border-t-transparent rounded-full" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No device history found
            </div>
          ) : (
            <div className="space-y-6">
              {history.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        {format(new Date(entry.created_at), 'PPP')}
                      </p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(entry.created_at), 'h:mm a')}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      by {entry.created_by}
                    </p>
                  </div>
                  {renderDeviceControls(entry)}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDeviceHistory;
