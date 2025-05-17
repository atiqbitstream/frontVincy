
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { toast } from "sonner";

interface Field {
  name: string;
  label: string;
}

interface DataEntry {
  id: string;
  createdAt: string;
  createdBy: string;
  values: Record<string, string | number>;
}

interface DataHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  endpoint: string;
  fields: Field[];
}

const DataHistoryModal = ({
  isOpen,
  onClose,
  title,
  endpoint,
  fields,
}: DataHistoryModalProps) => {
  const [history, setHistory] = useState<DataEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [editingEntry, setEditingEntry] = useState<DataEntry | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, date, endpoint]);

  const fetchHistory = async () => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call with date filter
      console.log(`Fetching data history from ${endpoint}${date ? ` for date ${format(date, 'yyyy-MM-dd')}` : ''}`);
      
      // Mock API response
      setTimeout(() => {
        const mockHistory = generateMockHistory(3, fields, date);
        setHistory(mockHistory);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching history:", error);
      setLoading(false);
    }
  };

  const generateMockHistory = (count: number, fields: Field[], filterDate?: Date): DataEntry[] => {
    const mockUsers = ["Dr. Smith", "Nurse Johnson", "Dr. Williams", "Therapist Lee"];
    const result = [];
    
    const baseDate = filterDate || new Date();
    
    for (let i = 0; i < count; i++) {
      const hours = Math.floor(Math.random() * 12);
      const minutes = Math.floor(Math.random() * 60);
      
      const entryDate = new Date(baseDate);
      entryDate.setHours(hours);
      entryDate.setMinutes(minutes);
      
      const values: Record<string, number> = {};
      fields.forEach(field => {
        values[field.name] = parseFloat((Math.random() * 100).toFixed(1));
      });
      
      result.push({
        id: `${i + 1}`,
        createdAt: entryDate.toISOString(),
        createdBy: mockUsers[Math.floor(Math.random() * mockUsers.length)],
        values
      });
    }
    
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const clearDateFilter = () => {
    setDate(undefined);
  };

  const handleEdit = (entry: DataEntry) => {
    const initialValues: Record<string, string> = {};
    
    fields.forEach(field => {
      initialValues[field.name] = String(entry.values[field.name]);
    });
    
    setFormValues(initialValues);
    setEditingEntry(entry);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!editingEntry) return;
    
    // Validate all fields have values
    const emptyFields = fields.filter(field => !formValues[field.name]);
    if (emptyFields.length > 0) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Convert form values to numbers
    const updatedValues: Record<string, number> = {};
    fields.forEach(field => {
      updatedValues[field.name] = parseFloat(formValues[field.name]);
    });
    
    // Update the entry in the history
    const updatedHistory = history.map(entry => {
      if (entry.id === editingEntry.id) {
        return {
          ...entry,
          values: updatedValues
        };
      }
      return entry;
    });
    
    setHistory(updatedHistory);
    setEditingEntry(null);
    toast.success("Data updated successfully");
  };

  const handleCancel = () => {
    setEditingEntry(null);
  };

  const handleDelete = (entryId: string) => {
    // Remove the entry from history
    setHistory(history.filter(entry => entry.id !== entryId));
    toast.success("Entry deleted successfully");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
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
          <>
            {editingEntry ? (
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">Edit Entry</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {fields.map((field) => (
                    <div key={field.name} className="space-y-1">
                      <label htmlFor={`edit-${field.name}`} className="text-sm font-medium">
                        {field.label}
                      </label>
                      <Input
                        id={`edit-${field.name}`}
                        value={formValues[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        type="number"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                {history.length > 0 ? (
                  history.map((entry) => (
                    <div key={entry.id} className="border-b last:border-b-0">
                      <div className="flex justify-between items-center p-4 bg-muted/20">
                        <div>
                          <p className="text-sm font-medium">{entry.createdBy}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(entry.createdAt), 'h:mm a, MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => handleEdit(entry)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive/90" 
                            onClick={() => handleDelete(entry.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                        {fields.map((field) => (
                          <div key={field.name} className="flex justify-between">
                            <span className="text-sm font-medium">{field.label}:</span>
                            <span className="text-sm">{entry.values[field.name]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No history found
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DataHistoryModal;
