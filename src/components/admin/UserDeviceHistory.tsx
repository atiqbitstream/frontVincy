
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserDeviceHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  endpoint: string;
  userId: string;
  userName: string;
}

// Mock history data
const generateMockHistory = (userId: string) => {
  const history = [];
  const today = new Date();
  
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    history.push({
      id: `hist-${userId}-${i}`,
      status: i % 2 === 0 ? "On" : "Off",
      createdAt: date.toISOString(),
      user: userId
    });
  }
  
  return history;
};

const UserDeviceHistory = ({ isOpen, onClose, title, endpoint, userId, userName }: UserDeviceHistoryProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [history, setHistory] = useState(() => generateMockHistory(userId));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setIsCalendarOpen(false);
    // In a real app, we would fetch data for the selected date
    setHistory(generateMockHistory(userId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title} History - {userName}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Filter by date:</h3>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[240px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium
                        ${item.status === "On" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"}`}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(item.createdAt), "PPp")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDeviceHistory;
