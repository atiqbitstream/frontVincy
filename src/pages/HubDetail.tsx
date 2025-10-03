import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, User, Globe } from "lucide-react";
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

// User submission interface
interface UserSubmission {
  id: string;
  name: string;
  email: string;
  category: string;
  description: string;
  url: string;
  status: boolean;
  created_at: string;
}

const HubDetail = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [hubCategory, setHubCategory] = useState<HubCategory | null>(null);
  const [userSubmissions, setUserSubmissions] = useState<UserSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) {
      fetchHubData();
    }
  }, [category]);

  const fetchHubData = async () => {
    try {
      // Fetch hub category details
      const hubResponse = await fetch(`${API_URL}/public/admin-hub/categories`);
      if (hubResponse.ok) {
        const hubData = await hubResponse.json();
        const selectedHub = hubData.find((hub: HubCategory) => hub.category === decodeURIComponent(category!));
        setHubCategory(selectedHub || null);
      }

      // Fetch user submissions for this category
      const submissionsResponse = await fetch(`${API_URL}/public/user-hub/category/${encodeURIComponent(category!)}`);
      if (submissionsResponse.ok) {
        const submissionsData = await submissionsResponse.json();
        // Only show active submissions (status = true)
        const activeSubmissions = submissionsData.filter((submission: UserSubmission) => submission.status === true);
        setUserSubmissions(activeSubmissions);
      }
    } catch (error) {
      console.error("Error fetching hub data:", error);
      toast.error("Failed to load hub information");
    } finally {
      setLoading(false);
    }
  };

  const handleVisitUrl = (url: string) => {
    if (url) {
      // Add https:// if no protocol is specified
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(formattedUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-health-primary mx-auto"></div>
            <p className="mt-4 text-foreground/60">Loading hub details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hubCategory) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Hub Not Found</h1>
            <p className="text-foreground/60 mb-6">The requested hub category could not be found.</p>
            <button
              onClick={() => navigate('/hub')}
              className="bg-health-primary hover:bg-health-primary/90 text-white px-6 py-2 rounded-md font-medium"
            >
              Back to Hub
            </button>
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
          onClick={() => navigate('/hub')}
          className="flex items-center gap-2 text-health-primary hover:text-health-primary/80 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Hub
        </button>

        {/* Hub Category Header */}
        <div className="bg-card rounded-2xl shadow-sm overflow-hidden border border-border mb-8">
          {/* Hub Image */}
          <div className="w-full h-64 overflow-hidden">
            {hubCategory.image_url ? (
              <img
                src={hubCategory.image_url}
                alt={hubCategory.category}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-health-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Globe className="w-8 h-8 text-health-primary" />
                  </div>
                  <p className="text-sm text-foreground/60">No image</p>
                </div>
              </div>
            )}
          </div>

          {/* Hub Info */}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-foreground mb-3">
              {hubCategory.category}
            </h1>
            
            <p className="text-foreground/70 leading-relaxed text-base">
              {hubCategory.description}
            </p>
          </div>
        </div>

        {/* Community Members Section */}
        <div className="mb-8">
          {userSubmissions.length === 0 ? (
            <div className="bg-card rounded-lg p-8 border border-border text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-foreground/40" />
              </div>
              
             
              <button
                onClick={() => navigate('/contact')}
                className="bg-health-primary hover:bg-health-primary/90 text-white px-6 py-3 rounded-md font-medium"
              >
                Join This Community
              </button>
            </div>
          ) : (
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              {/* Table Header */}
              <div className="bg-white px-8 py-5 border-b border-border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-semibold text-foreground text-sm">
                  <div>User Name</div>
                  <div>Description</div>
                  <div>URL</div>
                </div>
              </div>
              
              {/* Table Body */}
              <div className="divide-y divide-border bg-white">
                {userSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="px-8 py-5 hover:bg-muted/20 transition-colors duration-150"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      {/* User Name */}
                      <div className="font-medium text-foreground text-sm">
                        {submission.name}
                      </div>

                      {/* Description */}
                      <div className="text-foreground/70 text-sm">
                        {submission.description || "No description provided"}
                      </div>

                      {/* URL */}
                      <div>
                        {submission.url ? (
                          <button
                            onClick={() => handleVisitUrl(submission.url)}
                            className="text-health-secondary hover:text-health-secondary/80 text-sm font-medium hover:underline"
                          >
                            /{submission.url.replace(/^https?:\/\//, '').split('/')[0]}
                          </button>
                        ) : (
                          <span className="text-foreground/40 text-sm">No URL provided</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HubDetail;