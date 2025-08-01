
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// API base URL from environment
const API_URL = import.meta.env.VITE_API_URL;

// TypeScript interface for contact information
interface ContactInfo {
  id?: string;
  email: string;
  phone?: string;
  address?: string;
  office_hours?: string;
  support_email?: string;
}

const Contact = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch contact information on component mount
  useEffect(() => {
    const fetchContactInfo = async () => {
      setLoading(true);
      try {
        // Use public endpoint for contact information
        const response = await fetch(`${API_URL}/public/contact/`, {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.status === 404) {
          // No contact info exists, use default mock data
          console.log("No contact information found, using default data");
          setContactInfo({
            email: "info@womb-wellness.com",
            phone: "+1 (555) 123-4567",
            address: "123 Wellness Avenue, Suite 500, San Francisco, CA 94103",
            office_hours: "Monday - Friday: 9am - 5pm\nSaturday: 10am - 2pm\nSunday: Closed",
            support_email: "support@womb-wellness.com"
          });
        } else if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        } else {
          const data: ContactInfo = await response.json();
          console.log("Fetched contact data:", data);
          setContactInfo(data);
        }
      } catch (error) {
        console.error("Failed to fetch contact information:", error);
        // Use default mock data as fallback
        setContactInfo({
          email: "info@womb-wellness.com",
          phone: "+1 (555) 123-4567",
          address: "123 Wellness Avenue, Suite 500, San Francisco, CA 94103",
          office_hours: "Monday - Friday: 9am - 5pm\nSaturday: 10am - 2pm\nSunday: Closed",
          support_email: "support@womb-wellness.com"
        });
        toast.warning("Using default contact information - API connection issue");
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-health-primary" />
          <span className="ml-2">Loading contact information...</span>
        </div>
      </div>
    );
  }

  if (!contactInfo) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-gray-500">Contact information is not available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-health-secondary mb-2">Contact Us</h1>
          <p className="text-xl text-foreground/80">Get in touch with our team</p>
        </header>

        <div className="max-w-2xl mx-auto">
          <div>
            <h2 className="text-2xl font-semibold text-health-primary mb-6">Our Information</h2>
            <div className="bg-card text-card-foreground rounded-lg shadow p-6 space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-2">Contact Details</h3>
                <div className="space-y-3">
                  <p className="flex items-start">
                    <span className="font-medium mr-2 text-foreground/70">Email:</span>
                    <a href={`mailto:${contactInfo.email}`} className="text-health-primary hover:underline">
                      {contactInfo.email}
                    </a>
                  </p>
                  
                  {contactInfo.phone && (
                    <p className="flex items-start">
                      <span className="font-medium mr-2 text-foreground/70">Phone:</span>
                      <a href={`tel:${contactInfo.phone.replace(/\D/g, '')}`} className="text-health-primary hover:underline">
                        {contactInfo.phone}
                      </a>
                    </p>
                  )}
                  
                  {contactInfo.address && (
                    <div className="flex items-start">
                      <span className="font-medium mr-2 text-foreground/70">Address:</span>
                      <span className="text-foreground/70">{contactInfo.address}</span>
                    </div>
                  )}
                  
                  {contactInfo.support_email && (
                    <p className="flex items-start">
                      <span className="font-medium mr-2 text-foreground/70">Support:</span>
                      <a href={`mailto:${contactInfo.support_email}`} className="text-health-primary hover:underline">
                        {contactInfo.support_email}
                      </a>
                    </p>
                  )}
                </div>
              </div>
              
              {contactInfo.office_hours && (
                <div>
                  <h3 className="font-medium text-lg mb-2">Office Hours</h3>
                  <p className="whitespace-pre-line text-foreground/70">{contactInfo.office_hours}</p>
                </div>
              )}
              
              <div>
                <h3 className="font-medium text-lg mb-2">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://facebook.com/wombwellness" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                  <a 
                    href="https://twitter.com/wombwellness" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                  <a 
                    href="https://instagram.com/wombwellness" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 3.987-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-3.987-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                  <a 
                    href="https://linkedin.com/company/wombwellness" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
