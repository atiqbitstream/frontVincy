
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { apiGet, apiPost, apiPut, APIError } from "@/lib/api";

// API base URL from environment
const API_URL = import.meta.env.VITE_API_URL;

// TypeScript interfaces to match backend schemas
interface ContactInfo {
  id?: string;
  email: string;
  phone?: string;
  address?: string;
  office_hours?: string;
  support_email?: string;
  created_at?: string;
  updated_at?: string;
}

interface ContactCreatePayload {
  email: string;
  phone?: string;
  address?: string;
  office_hours?: string;
  support_email?: string;
}

interface ContactUpdatePayload {
  email?: string;
  phone?: string;
  address?: string;
  office_hours?: string;
  support_email?: string;
}

const ContactEditor = () => {
  const [contactData, setContactData] = useState<ContactInfo>({
    email: "",
    phone: "",
    address: "",
    office_hours: "",
    support_email: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { token } = useAuth();

  // Fetch contact information on component mount
  useEffect(() => {
    fetchContactInfo();
  }, []);

  // API call to fetch current contact information
  const fetchContactInfo = async () => {
    setLoading(true);
    try {
      console.log("Fetching contact information from API...");
      
      const response = await apiGet('/admin/contact/');
      const data: ContactInfo = await response.json();
      
      console.log("Fetched contact data:", data);
      setContactData(data);
    } catch (error) {
      if (error instanceof APIError && error.status === 404) {
        // No contact info exists yet, use empty form
        console.log("No contact information found, using empty form");
        setContactData({
          email: "",
          phone: "",
          address: "",
          office_hours: "",
          support_email: ""
        });
      } else if (error instanceof APIError && error.status === 401) {
        // Token expired - handled by API helper
        return;
      } else {
        console.error("Failed to fetch contact information:", error);
        toast.error("Failed to load contact information");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ContactInfo, value: string) => {
    setContactData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // API call to save contact information (create or update)
  const handleSave = async () => {
    if (!contactData.email) {
      toast.error("Email address is required");
      return;
    }

    setSaving(true);
    try {
      const payload: ContactCreatePayload | ContactUpdatePayload = {
        email: contactData.email,
        phone: contactData.phone || undefined,
        address: contactData.address || undefined,
        office_hours: contactData.office_hours || undefined,
        support_email: contactData.support_email || undefined,
      };

      let response;

      if (contactData.id) {
        // Update existing contact information
        console.log("Updating contact information:", contactData.id, payload);
        
        response = await fetch(`${API_URL}/admin/contact/${contactData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new contact information
        console.log("Creating new contact information:", payload);
        
        response = await fetch(`${API_URL}/admin/contact/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Error: ${response.status}`);
      }

      const updatedContact: ContactInfo = await response.json();
      console.log("Contact information saved:", updatedContact);
      
      setContactData(updatedContact);
      setIsEditing(false);
      toast.success("Contact information saved successfully!");
    } catch (error) {
      console.error("Failed to save contact information:", error);
      toast.error("Failed to save contact information");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-health-primary" />
        <span className="ml-2">Loading contact information...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-health-secondary">Contact Information Management</h2>
        {isEditing ? (
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            {contactData.id ? 'Edit Information' : 'Add Contact Information'}
          </Button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <Input 
                value={contactData.email} 
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="info@company.com"
                type="email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <Input 
                value={contactData.phone || ''} 
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                type="tel"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <Textarea 
                rows={3}
                value={contactData.address || ''} 
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main Street, City, State, ZIP"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Office Hours
              </label>
              <Textarea 
                rows={3}
                value={contactData.office_hours || ''} 
                onChange={(e) => handleInputChange('office_hours', e.target.value)}
                placeholder="Monday - Friday: 9am - 5pm&#10;Saturday: 10am - 2pm&#10;Sunday: Closed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Support Email
              </label>
              <Input 
                value={contactData.support_email || ''} 
                onChange={(e) => handleInputChange('support_email', e.target.value)}
                placeholder="support@company.com"
                type="email"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {contactData.email ? (
              <>
                <div>
                  <h4 className="font-medium text-gray-800">Email:</h4>
                  <a 
                    href={`mailto:${contactData.email}`} 
                    className="text-health-primary hover:underline"
                  >
                    {contactData.email}
                  </a>
                </div>
                
                {contactData.phone && (
                  <div>
                    <h4 className="font-medium text-gray-800">Phone:</h4>
                    <a 
                      href={`tel:${contactData.phone.replace(/\D/g, '')}`} 
                      className="text-health-primary hover:underline"
                    >
                      {contactData.phone}
                    </a>
                  </div>
                )}
                
                {contactData.address && (
                  <div>
                    <h4 className="font-medium text-gray-800">Address:</h4>
                    <p className="text-gray-600 whitespace-pre-line">{contactData.address}</p>
                  </div>
                )}
                
                {contactData.office_hours && (
                  <div>
                    <h4 className="font-medium text-gray-800">Office Hours:</h4>
                    <p className="text-gray-600 whitespace-pre-line">{contactData.office_hours}</p>
                  </div>
                )}
                
                {contactData.support_email && (
                  <div>
                    <h4 className="font-medium text-gray-800">Support Email:</h4>
                    <a 
                      href={`mailto:${contactData.support_email}`} 
                      className="text-health-primary hover:underline"
                    >
                      {contactData.support_email}
                    </a>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 italic">No contact information available. Click "Add Contact Information" to get started.</p>
            )}
          </div>
        )}
      </div>

      {/* Information Section */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">Information</h3>
        <p className="text-sm text-blue-700">
          This contact information will be displayed on the public contact page for users to reach out to your organization.
          Make sure all information is accurate and up-to-date.
        </p>
        {contactData.created_at && (
          <p className="text-xs text-blue-600 mt-2">
            Last updated: {new Date(contactData.updated_at || contactData.created_at).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactEditor;
