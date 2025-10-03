import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Users, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// API base URL
const API_URL = import.meta.env.VITE_API_URL;

// Hub category interface
interface HubCategory {
  id: string;
  page_heading: string;
  page_subtext: string;
  category: string;
  description: string;
  image_url: string;
  created_at: string;
}

const Hub = () => {
  const [hubCategories, setHubCategories] = useState<HubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch hub categories on component mount
  useEffect(() => {
    fetchHubCategories();
  }, []);

  const fetchHubCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/public/admin-hub/categories`);
      
      if (response.ok) {
        const data = await response.json();
        setHubCategories(data);
      } else {
        console.error("Failed to fetch hub categories");
        toast.error("Failed to load hub categories");
      }
    } catch (error) {
      console.error("Error fetching hub categories:", error);
      toast.error("Failed to load hub categories");
    } finally {
      setLoading(false);
    }
  };

  const handleViewUsers = (category: string) => {
    navigate(`/hub/${encodeURIComponent(category)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-health-primary mx-auto"></div>
            <p className="mt-4 text-foreground/60">Loading hub categories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-foreground/70 hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {hubCategories.length > 0 && hubCategories[0].page_heading 
              ? hubCategories[0].page_heading 
              : 'Community Hub'}
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {hubCategories.length > 0 && hubCategories[0].page_subtext 
              ? hubCategories[0].page_subtext 
              : 'Explore different categories and connect with community members who share similar interests.'}
          </p>
        </div>

        {/* Hub Categories Grid */}
        {hubCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foreground/60 text-lg">No hub categories available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hubCategories.map((hub) => (
              <div
                key={hub.id}
                onClick={() => handleViewUsers(hub.category)}
                className="bg-card rounded-lg shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              >
                {/* Category Image */}
                <div className="relative h-48 overflow-hidden">
                  {hub.image_url ? (
                    <img
                      src={hub.image_url}
                      alt={hub.category}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-health-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Eye className="w-8 h-8 text-health-primary" />
                        </div>
                        <p className="text-sm text-foreground/60">No image</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Category Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {hub.category}
                      </h3>
                    </div>
                  </div>

                  <p className="text-foreground/70 text-sm line-clamp-3">
                    {hub.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        
      </div>
    </div>
  );
};

export default Hub;