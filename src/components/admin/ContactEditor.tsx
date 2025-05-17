
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Mock contact data
const initialContactData = {
  email: "info@womb-wellness.com",
  phone: "+1 (555) 123-4567",
  address: "123 Wellness Avenue, Suite 500, San Francisco, CA 94103",
  officeHours: "Monday - Friday: 9am - 5pm\nSaturday: 10am - 2pm\nSunday: Closed",
  socialMedia: {
    facebook: "https://facebook.com/wombwellness",
    twitter: "https://twitter.com/wombwellness",
    instagram: "https://instagram.com/wombwellness",
    linkedin: "https://linkedin.com/company/wombwellness"
  }
};

const ContactEditor = () => {
  const [contactData, setContactData] = useState(initialContactData);
  const [isEditing, setIsEditing] = useState(false);
  const [queries, setQueries] = useState<{email: string, name: string, message: string}[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setContactData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setContactData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handleSave = () => {
    // In a real app, we would save the data to the server
    toast.success("Contact information saved successfully!");
    setIsEditing(false);
  };

  // Mock handling of a user query (this would come from API in real app)
  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const message = formData.get('message') as string;
    
    if (email && name && message) {
      setQueries(prev => [...prev, { email, name, message }]);
      (e.target as HTMLFormElement).reset();
      toast.success("Query submitted successfully!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-health-secondary">Contact Us Management</h2>
        {isEditing ? (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit Information</Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <Input 
                  value={contactData.email} 
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <Input 
                  value={contactData.phone} 
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <Textarea 
                  rows={3}
                  value={contactData.address} 
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Office Hours</label>
                <Textarea 
                  rows={3}
                  value={contactData.officeHours} 
                  onChange={(e) => handleInputChange('officeHours', e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800">Email:</h4>
                <p className="text-gray-600">{contactData.email}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Phone:</h4>
                <p className="text-gray-600">{contactData.phone}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Address:</h4>
                <p className="text-gray-600">{contactData.address}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Office Hours:</h4>
                <p className="text-gray-600 whitespace-pre-line">{contactData.officeHours}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Social Media</h3>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                <Input 
                  value={contactData.socialMedia.facebook} 
                  onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                <Input 
                  value={contactData.socialMedia.twitter} 
                  onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                <Input 
                  value={contactData.socialMedia.instagram} 
                  onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <Input 
                  value={contactData.socialMedia.linkedin} 
                  onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800">Facebook:</h4>
                <a href={contactData.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-health-primary hover:underline">
                  {contactData.socialMedia.facebook}
                </a>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Twitter:</h4>
                <a href={contactData.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-health-primary hover:underline">
                  {contactData.socialMedia.twitter}
                </a>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Instagram:</h4>
                <a href={contactData.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-health-primary hover:underline">
                  {contactData.socialMedia.instagram}
                </a>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">LinkedIn:</h4>
                <a href={contactData.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-health-primary hover:underline">
                  {contactData.socialMedia.linkedin}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Queries</h3>
        
        {queries.length === 0 ? (
          <p className="text-gray-500 italic">No queries received yet.</p>
        ) : (
          <div className="space-y-4">
            {queries.map((query, index) => (
              <div key={index} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{query.name}</h4>
                    <p className="text-sm text-gray-500">{query.email}</p>
                  </div>
                </div>
                <p className="text-gray-700">{query.message}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <h4 className="font-medium mb-3">Test Query Form</h4>
          <form onSubmit={handleQuerySubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input name="name" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input name="email" type="email" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <Textarea name="message" rows={4} required />
            </div>
            <Button type="submit">Submit Query</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactEditor;
