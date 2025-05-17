
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Field {
  name: string;
  label: string;
}

interface DataFormProps {
  title: string;
  description: string;
  fields: Field[];
  endpoint: string;
}

const DataForm = ({ title, description, fields, endpoint }: DataFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate all fields are filled
      const emptyFields = Object.entries(formData)
        .filter(([_, value]) => value.trim() === '')
        .map(([key, _]) => key);
      
      if (emptyFields.length > 0) {
        toast.error(`Please fill in all fields`);
        setLoading(false);
        return;
      }
      
      // In a real app, this would be an API call
      console.log(`Submitting ${title} data to ${endpoint}:`, formData);
      
      // Simulate API call
      setTimeout(() => {
        toast.success(`${title} data submitted successfully`);
        
        // Reset form
        setFormData(
          fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
        );
        
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error(`Error submitting ${title} data:`, error);
      toast.error(`Failed to submit ${title} data. Please try again.`);
      setLoading(false);
    }
  };

  return (
    <div className="form-card h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-health-secondary mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="grid grid-cols-1 gap-4 mb-6 flex-1">
          {fields.map((field) => (
            <div key={field.name} className="space-y-1">
              <Label htmlFor={field.name} className="health-label">
                {field.label}
              </Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                placeholder="0.00"
                value={formData[field.name]}
                onChange={handleInputChange}
                className="health-input"
              />
            </div>
          ))}
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-health-primary hover:bg-health-secondary"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
              Submitting...
            </div>
          ) : (
            'Submit Data'
          )}
        </Button>
      </form>
    </div>
  );
};

export default DataForm;
