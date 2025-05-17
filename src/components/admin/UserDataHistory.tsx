
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Edit } from "lucide-react";
import { toast } from "sonner";

interface Field {
  name: string;
  label: string;
}

interface DataEntry {
  id: string;
  createdAt: string;
  values: Record<string, string | number>;
}

interface UserDataHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  userId: string;
  userName: string;
  fields: Field[];
}

const UserDataHistory = ({
  isOpen,
  onClose,
  title,
  userId,
  userName,
  fields
}: UserDataHistoryProps) => {
  const [history, setHistory] = useState<DataEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<DataEntry | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, userId, title]);

  const fetchHistory = async () => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      console.log(`Fetching ${title} history for user ${userId}`);
      
      // Mock data
      setTimeout(() => {
        const mockHistory = generateMockHistory(3, fields);
        setHistory(mockHistory);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching history:", error);
      setLoading(false);
    }
  };

  const generateMockHistory = (count: number, fields: Field[]): DataEntry[] => {
    const result = [];
    
    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 2)); // Every 2 days in the past
      
      const values: Record<string, number> = {};
      fields.forEach(field => {
        values[field.name] = parseFloat((Math.random() * 100).toFixed(1));
      });
      
      result.push({
        id: `${i + 1}`,
        createdAt: date.toISOString(),
        values
      });
    }
    
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
    
    // Convert form values to numbers
    const updatedValues: Record<string, number> = {};
    fields.forEach(field => {
      updatedValues[field.name] = parseFloat(formValues[field.name] || '0');
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
    toast.success("Form data updated successfully");
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
          <DialogTitle>{title} History for {userName}</DialogTitle>
        </DialogHeader>
        
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
                          <p className="text-sm font-medium">
                            {format(new Date(entry.createdAt), 'PPP')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(entry.createdAt), 'h:mm a')}
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
                    No history found for this user
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

export default UserDataHistory;
