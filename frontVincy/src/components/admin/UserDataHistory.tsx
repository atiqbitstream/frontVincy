import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Field {
  name: string;
  label: string;
}

interface DataEntry {
  id: string;
  created_at: string;
  user_email: string;
  [key: string]: any; // For dynamic field values
}

interface UserDataHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  userId: string;
  userName: string;
  userEmail: string;
  endpoint: string;
  category: string;
  fields: Field[];
}

const UserDataHistory = ({
  isOpen,
  onClose,
  title,
  userId,
  userName,
  userEmail,
  endpoint,
  category,
  fields
}: UserDataHistoryProps) => {
  const [history, setHistory] = useState<DataEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<DataEntry | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, userId, endpoint, category, userEmail]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // Use admin endpoints to fetch data for specific user
      const response = await fetch(`${API_URL}/admin/${category}/users/${userEmail}/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${title} data`);
      }
      
      const data = await response.json();
      const userData = Array.isArray(data) ? data : [];
      setHistory(userData);
    } catch (error) {
      console.error(`Error fetching ${title} history:`, error);
      toast.error(`Failed to load ${title} data`);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Check if this is a device control entry
  const isDeviceControl = category === 'device-controls';

  // Get the actual fields that exist in the data for device controls
  const getActualDeviceFields = (entry: DataEntry) => {
    if (!isDeviceControl) return fields;

    const actualFields: Field[] = [];
    
    // Always show created_by if it exists
    if (entry.created_by) {
      actualFields.push({ name: 'created_by', label: 'Created By' });
    }

    // Check what actual fields exist in the entry (excluding metadata fields)
    const excludeFields = ['id', 'created_at', 'user_email', 'created_by'];
    Object.keys(entry).forEach(key => {
      if (!excludeFields.includes(key) && entry[key] !== null && entry[key] !== undefined) {
        // Create a proper label based on the field name
        let label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        // Special handling for common device control fields
        if (key === 'sound') label = 'Sound Status';
        else if (key === 'steam') label = 'Steam Status';
        else if (key === 'temp_tank') label = 'Temperature (°F)';
        else if (key === 'water_pump') label = 'Water Pump Status';
        else if (key === 'nano_flicker') label = 'Nanoflicker Status';
        else if (key === 'led_color') label = 'LED Color';
        
        actualFields.push({ name: key, label });
      }
    });

    return actualFields;
  };

  const handleEdit = (entry: DataEntry) => {
    const fieldsToUse = isDeviceControl ? getActualDeviceFields(entry) : fields;
    const initialValues: Record<string, string> = {};
    
    fieldsToUse.forEach(field => {
      if (field.name === 'created_by') return; // Skip created_by in edit form
      
      const value = entry[field.name];
      initialValues[field.name] = value !== undefined && value !== null ? String(value) : '';
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

  const handleSave = async () => {
    if (!editingEntry) return;
    setSaving(true);
    
    try {
      // Prepare the update payload
      const updatePayload: Record<string, any> = {};
      const fieldsToUse = isDeviceControl ? getActualDeviceFields(editingEntry) : fields;
      
      fieldsToUse.forEach(field => {
        if (field.name === 'created_by') return; // Skip created_by in updates
        
        const value = formValues[field.name];
        
        // Handle different field types
        if (field.name === 'led_color') {
          updatePayload[field.name] = value;
        } else if (field.name === 'temp_tank') {
          updatePayload[field.name] = value && !isNaN(Number(value)) ? Number(value) : value;
        } else if (['sound', 'steam', 'water_pump', 'nano_flicker'].includes(field.name)) {
          // Convert string boolean values to actual booleans
          if (value === 'true' || value === '1') {
            updatePayload[field.name] = true;
          } else if (value === 'false' || value === '0') {
            updatePayload[field.name] = false;
          } else {
            updatePayload[field.name] = Boolean(value);
          }
        } else {
          // Try to convert to number if it looks like a number, otherwise keep as string
          if (value && !isNaN(Number(value)) && value.trim() !== '') {
            updatePayload[field.name] = Number(value);
          } else {
            updatePayload[field.name] = value;
          }
        }
      });

      // Use admin endpoint for updating
      const response = await fetch(`${API_URL}/admin/${category}/${endpoint}/${editingEntry.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        throw new Error('Failed to update entry');
      }

      const updatedEntry = await response.json();
      
      // Update the entry in the history
      setHistory(prev => prev.map(entry =>
        entry.id === editingEntry.id ? updatedEntry : entry
      ));
      
      setEditingEntry(null);
      toast.success(`${title} data updated successfully`);
    } catch (error) {
      console.error('Error updating entry:', error);
      toast.error(`Failed to update ${title} data`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingEntry(null);
    setFormValues({});
  };

  const handleDelete = async (entryId: string) => {
    setDeleting(entryId);
    try {
      // Use admin endpoint for deleting
      const response = await fetch(`${API_URL}/admin/${category}/${endpoint}/${entryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      // Remove the entry from history
      setHistory(prev => prev.filter(entry => entry.id !== entryId));
      toast.success(`${title} entry deleted successfully`);
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error(`Failed to delete ${title} entry`);
    } finally {
      setDeleting(null);
    }
  };

  const getFieldValue = (entry: DataEntry, fieldName: string) => {
    const value = entry[fieldName];
    if (value === null || value === undefined) return 'N/A';
    
    // Special formatting for device control values
    if (isDeviceControl) {
      if (['sound', 'steam', 'water_pump', 'nano_flicker'].includes(fieldName)) {
        return value ? 'ON' : 'OFF';
      }
      if (fieldName === 'temp_tank') {
        return `${value}°F`;
      }
      if (fieldName === 'led_color') {
        return String(value).charAt(0).toUpperCase() + String(value).slice(1);
      }
    }
    
    return String(value);
  };

  const renderEditField = (field: Field) => {
    if (field.name === 'created_by') return null; // Don't render created_by in edit form
    
    if (isDeviceControl && field.name === 'led_color') {
      return (
        <div key={field.name} className="space-y-2">
          <label htmlFor={`edit-${field.name}`} className="text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <Select
            value={formValues[field.name] || ''}
            onValueChange={(value) => handleInputChange(field.name, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="red">Red</SelectItem>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="purple">Purple</SelectItem>
              <SelectItem value="yellow">Yellow</SelectItem>
              <SelectItem value="white">White</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }
    
    if (isDeviceControl && ['sound', 'steam', 'water_pump', 'nano_flicker'].includes(field.name)) {
      return (
        <div key={field.name} className="space-y-2">
          <label htmlFor={`edit-${field.name}`} className="text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <Select
            value={formValues[field.name] || ''}
            onValueChange={(value) => handleInputChange(field.name, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">ON</SelectItem>
              <SelectItem value="false">OFF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }

    return (
      <div key={field.name} className="space-y-2">
        <label htmlFor={`edit-${field.name}`} className="text-sm font-medium text-gray-700">
          {field.label}
        </label>
        <Input
          id={`edit-${field.name}`}
          value={formValues[field.name] || ''}
          onChange={(e) => handleInputChange(field.name, e.target.value)}
          type={
            field.name.includes('rate') || 
            field.name.includes('level') || 
            field.name.includes('temperature') ||
            field.name === 'temp_tank'
              ? 'number' 
              : 'text'
          }
          className="w-full"
        />
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {title} History for {userName}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({history.length} entries)
            </span>
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading {title.toLowerCase()} data...</span>
          </div>
        ) : (
          <>
            {editingEntry ? (
              <div className="border rounded-md p-6 bg-gray-50">
                <h3 className="font-medium mb-4 text-lg">Edit {title} Entry</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {(isDeviceControl ? getActualDeviceFields(editingEntry) : fields)
                    .map(field => renderEditField(field))
                    .filter(Boolean)}
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={handleCancel} disabled={saving}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map((entry) => {
                      const fieldsToShow = isDeviceControl ? getActualDeviceFields(entry) : fields;
                      
                      return (
                        <div key={entry.id} className="border rounded-lg overflow-hidden shadow-sm">
                          <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {format(new Date(entry.created_at), 'PPP')}
                              </p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(entry.created_at), 'h:mm a')}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-100"
                                onClick={() => handleEdit(entry)}
                              >
                                <Edit className="h-4 w-4 text-blue-600" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-red-100"
                                onClick={() => handleDelete(entry.id)}
                                disabled={deleting === entry.id}
                              >
                                {deleting === entry.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                                ) : (
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                )}
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {fieldsToShow.map((field) => (
                                <div key={field.name} className="flex justify-between items-center py-1">
                                  <span className="text-sm font-medium text-gray-600">
                                    {field.label}:
                                  </span>
                                  <span className="text-sm text-gray-900 font-medium">
                                    {getFieldValue(entry, field.name)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="text-gray-400 mb-2">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No {title.toLowerCase()} data found</p>
                    <p className="text-gray-400 text-sm">This user hasn't submitted any {title.toLowerCase()} entries yet.</p>
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