
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoryEntry {
  id: string;
  status: boolean;
  createdAt: string;
  createdBy: string;
  value?: number;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  endpoint: string;
}

const HistoryModal = ({
  isOpen,
  onClose,
  title,
  endpoint,
}: HistoryModalProps) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, date, endpoint]);

  const fetchHistory = async () => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call with date filter
      console.log(`Fetching history from ${endpoint}${date ? ` for date ${format(date, 'yyyy-MM-dd')}` : ''}`);
      
      // Mock API response
      setTimeout(() => {
        const mockHistory = generateMockHistory(5, title, date);
        setHistory(mockHistory);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching history:", error);
      setLoading(false);
    }
  };

  const generateMockHistory = (count: number, deviceName: string, filterDate?: Date): HistoryEntry[] => {
    const mockUsers = ["Dr. Smith", "Nurse Johnson", "Dr. Williams", "Therapist Lee"];
    const result = [];
    
    const baseDate = filterDate || new Date();
    
    for (let i = 0; i < count; i++) {
      const hours = Math.floor(Math.random() * 12);
      const minutes = Math.floor(Math.random() * 60);
      
      const entryDate = new Date(baseDate);
      entryDate.setHours(hours);
      entryDate.setMinutes(minutes);
      
      result.push({
        id: `${i + 1}`,
        status: Math.random() > 0.5,
        createdAt: entryDate.toISOString(),
        createdBy: mockUsers[Math.floor(Math.random() * mockUsers.length)],
        value: deviceName.includes("Temperature") ? Math.floor(Math.random() * 100) : undefined
      });
    }
    
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const clearDateFilter = () => {
    setDate(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{title} History</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Filter by date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            {date && (
              <Button variant="ghost" size="sm" onClick={clearDateFilter}>
                Clear filter
              </Button>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-health-primary"></div>
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-2 text-left text-sm font-medium text-muted-foreground">Status</th>
                  {title.includes("Temperature") && (
                    <th className="p-2 text-left text-sm font-medium text-muted-foreground">Value</th>
                  )}
                  <th className="p-2 text-left text-sm font-medium text-muted-foreground">Time</th>
                  <th className="p-2 text-left text-sm font-medium text-muted-foreground">User</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? (
                  history.map((entry) => (
                    <tr key={entry.id} className="border-t">
                      <td className="p-2 text-sm">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${entry.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {entry.status ? 'ON' : 'OFF'}
                        </span>
                      </td>
                      {title.includes("Temperature") && (
                        <td className="p-2 text-sm">{entry.value}%</td>
                      )}
                      <td className="p-2 text-sm">
                        {format(new Date(entry.createdAt), 'h:mm a, MMM d, yyyy')}
                      </td>
                      <td className="p-2 text-sm">{entry.createdBy}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={title.includes("Temperature") ? 4 : 3} className="p-4 text-center text-muted-foreground">
                      No history found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HistoryModal;
