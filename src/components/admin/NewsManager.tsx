import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Loader2, Image, Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth"; // Import useAuth to access token

// API base URL from environment
const API_URL = import.meta.env.VITE_API_URL;

// News item interface to match API schema
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  image_url: string; // Changed from image to image_url to match API
  publish_date: string;
  created_at?: string;
  updated_at?: string;
}

// TypeScript interfaces for API requests
interface NewsCreatePayload {
  title: string;
  summary: string;
  content: string;
  image_url: string; // Changed from image to image_url
  publish_date: string;
}

interface NewsUpdatePayload {
  title?: string;
  summary?: string;
  content?: string;
  image_url?: string; // Changed from image to image_url
  publish_date?: string;
}

// For testing purposes without backend
const mockNewsData = [
  {
    id: "1",
    title: "New Therapeutic Technology Breakthrough",
    summary: "Our team has developed a revolutionary approach to burn therapy using LED technology.",
    content: "Our research team, led by Dr. Sarah Johnson, has made significant progress in developing new LED-based therapeutic approaches for burn victims. The novel technology uses specific light wavelengths to stimulate tissue regeneration and reduce inflammation...",
    image_url: "https://picsum.photos/id/237/600/400", // Changed from image to image_url
    publish_date: "2023-09-15"
  },
  {
    id: "2",
    title: "W.O.M.B Platform Wins Healthcare Innovation Award",
    summary: "Our remote monitoring platform was recognized for excellence in healthcare technology.",
    content: "We are proud to announce that the W.O.M.B platform has received the prestigious Healthcare Innovation Award for 2023. The award recognizes our contributions to advancing remote therapeutic care and monitoring...",
    image_url: "https://picsum.photos/id/238/600/400", // Changed from image to image_url
    publish_date: "2023-08-28"
  },
  {
    id: "3",
    title: "Upcoming Webinar: Advances in Remote Therapeutic Care",
    summary: "Join our panel of experts as they discuss the latest developments in remote healthcare.",
    content: "Mark your calendars for our upcoming webinar on 'Advances in Remote Therapeutic Care'. Our distinguished panel will discuss the latest developments in telemedicine, remote monitoring, and how technological innovations are changing the landscape of healthcare delivery...",
    image_url: "https://picsum.photos/id/239/600/400", // Changed from image to image_url
    publish_date: "2023-10-05"
  }
];

// Define a default placeholder image path
const DEFAULT_PLACEHOLDER = "/placeholder-image.jpg";

const NewsManager = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploadType, setImageUploadType] = useState<"url" | "file">("url");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<NewsCreatePayload>({
    title: "",
    summary: "",
    content: "",
    image_url: "", // Changed from image to image_url
    publish_date: new Date().toISOString().split('T')[0]
  });

  // Get auth token from context
  const { token } = useAuth();

  // Fetch all news items on component mount
  useEffect(() => {
    fetchNewsItems();
  }, []);

  // API call to fetch all news items
  const fetchNewsItems = async () => {
    setIsLoading(true);
    try {
      // Log the request for debugging
      console.log("Fetching news from API endpoint");
      
      // Use the full API URL path with proper prefix
      const response = await fetch(`${API_URL}/admin/news/`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add Authorization header with token
        },
      });
      
      // Debug the response
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Error: ${response.status}`);
      }
      
      try {
        const data = await response.json();
        console.log("Fetched news data:", data);
        setNewsItems(data);
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        console.log("API appears to be unavailable, using mock data temporarily");
        // Use mock data if API is unavailable
        setNewsItems(mockNewsData);
        toast.warning("Using sample data - API appears to be unavailable");
      }
    } catch (error) {
      console.error("Failed to fetch news items:", error);
      console.log("Using mock data as fallback");
      setNewsItems(mockNewsData);
      toast.warning("Using sample data - API connection failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload file to backend
      const response = await fetch(`${API_URL}/admin/upload/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await response.json();
      
      // Use the full URL path returned from backend
      const imageUrl = `${API_URL}${result.file_url}`;
      handleInputChange('image_url', imageUrl);
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddNews = () => {
    setFormData({
      title: "",
      summary: "",
      content: "",
      image_url: "", // Changed from image to image_url
      publish_date: new Date().toISOString().split('T')[0]
    });
    setIsAddDialogOpen(true);
  };

  const handleEditNews = (news: NewsItem) => {
    setCurrentNews(news);
    setFormData({
      title: news.title,
      summary: news.summary,
      content: news.content,
      image_url: news.image_url, // Changed from image to image_url
      publish_date: news.publish_date
    });
    setIsEditDialogOpen(true);
  };

  const handleViewNews = (news: NewsItem) => {
    setCurrentNews(news);
    setIsViewDialogOpen(true);
  };

  // API call to delete a news item
  const handleDeleteNews = async (id: string) => {
    try {
      console.log("Deleting news item:", id);
      
      const response = await fetch(`${API_URL}/admin/news/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` // Add Authorization header
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Error: ${response.status}`);
      }
      
      // Remove the deleted item from state
      setNewsItems(prev => prev.filter(item => item.id !== id));
      toast.success("News item deleted successfully");
    } catch (error) {
      console.error("Failed to delete news item:", error);
      
      // Delete item locally if the API request fails
      if (error instanceof Error && error.message.includes('404')) {
        // Item doesn't exist on server, remove from local state
        setNewsItems(prev => prev.filter(item => item.id !== id));
        toast.warning("Item removed locally");
      } else {
        // For other errors, still remove from UI but warn user
        setNewsItems(prev => prev.filter(item => item.id !== id));
        toast.warning("Item removed from view - API connection issue");
      }
    }
  };

  // API call to create a new news item
  const handleSaveNew = async () => {
    if (!formData.title || !formData.summary || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Creating news item with data:", formData);
      
      const response = await fetch(`${API_URL}/admin/news/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add Authorization header
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Error: ${response.status}`);
      }

      try {
        const newItem = await response.json();
        setNewsItems(prev => [...prev, newItem]);
        setIsAddDialogOpen(false);
        toast.success("News item added successfully");
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        
        // Create a mock item with a temporary ID for UI continuity
        const mockItem: NewsItem = {
          ...formData,
          id: `temp-${Date.now()}`,
        };
        
        setNewsItems(prev => [...prev, mockItem]);
        setIsAddDialogOpen(false);
        toast.warning("Item added locally - API response issue");
      }
    } catch (error) {
      console.error("Failed to add news item:", error);
      toast.error("Failed to add news item");
    } finally {
      setIsSubmitting(false);
    }
  };

  // API call to update an existing news item
  const handleSaveEdit = async () => {
    if (!currentNews || !formData.title || !formData.summary || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Updating news item:", currentNews.id, "with data:", formData);
      
      const response = await fetch(`${API_URL}/admin/news/${currentNews.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add Authorization header
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Error: ${response.status}`);
      }

      try {
        const updatedItem = await response.json();
        
        // Update the item in the state
        setNewsItems(prev => prev.map(item => 
          item.id === currentNews.id ? updatedItem : item
        ));
        
        setIsEditDialogOpen(false);
        toast.success("News item updated successfully");
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        
        // Update locally if API response has issues
        const updatedItem: NewsItem = {
          ...currentNews,
          ...formData,
        };
        
        setNewsItems(prev => prev.map(item => 
          item.id === currentNews.id ? updatedItem : item
        ));
        
        setIsEditDialogOpen(false);
        toast.warning("Item updated locally - API response issue");
      }
    } catch (error) {
      console.error("Failed to update news item:", error);
      toast.error("Failed to update news item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-health-secondary">News Management</h2>
        <Button onClick={handleAddNews}>
          <Plus className="h-4 w-4 mr-1" /> Add News
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-health-primary" />
          <span className="ml-2">Loading news items...</span>
        </div>
      ) : newsItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No news items found. Click "Add News" to create your first news item.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((news) => (
            <div key={news.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Changed to use image_url instead of image */}
              <div className="w-full h-48 bg-gray-100 overflow-hidden">
                <img 
  src={news.image_url || DEFAULT_PLACEHOLDER} 
  alt={news.title} 
  className="w-full h-full object-cover"
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    // Only set the placeholder if it's not already the placeholder
    if (target.src !== window.location.origin + DEFAULT_PLACEHOLDER) {
      console.log("Image failed to load, using placeholder");
      target.src = DEFAULT_PLACEHOLDER;
    }
    target.onerror = null; // Prevent further error handling
  }}
/>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{news.title}</h3>
                <p className="text-gray-600 text-sm mb-2">Published: {new Date(news.publish_date).toLocaleDateString()}</p>
                <p className="text-gray-700 mb-4">{news.summary}</p>
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewNews(news)}
                  >
                    Read More
                  </Button>
                  <div className="space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditNews(news)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteNews(news.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add News Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New News Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input 
                value={formData.title} 
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="News title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Summary *</label>
              <Textarea 
                value={formData.summary} 
                onChange={(e) => handleInputChange('summary', e.target.value)}
                placeholder="Brief summary (shown in cards)"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content *</label>
              <Textarea 
                value={formData.content} 
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Full news content"
                rows={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <Tabs defaultValue={imageUploadType} onValueChange={(val) => setImageUploadType(val as "url" | "file")}>
                <TabsList className="mb-4">
                  <TabsTrigger value="url">URL</TabsTrigger>
                  <TabsTrigger value="file">Upload</TabsTrigger>
                </TabsList>
                
                <TabsContent value="url">
                  <Input 
                    value={formData.image_url} 
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </TabsContent>
                
                <TabsContent value="file">
                  <div className="mt-2">
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="image-upload" className="cursor-pointer w-full">
                        <div className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center h-32 ${uploadingImage ? 'border-health-primary' : 'border-gray-300 hover:border-health-primary'}`}>
                          {uploadingImage ? (
                            <div className="text-center">
                              <Loader2 className="h-8 w-8 animate-spin text-health-primary mx-auto mb-2" />
                              <p className="text-sm text-gray-500">Uploading...</p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <div className="flex justify-center mb-2">
                                <Image className="w-6 h-6 text-gray-400" />
                              </div>
                              <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                              <p className="text-xs text-gray-400 mt-1">News Article • Recommended: 1200x675px • PNG, JPG, GIF up to 5MB</p>
                            </div>
                          )}
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              {formData.image_url && (
                <div className="mt-2">
                  <div className="relative h-32 rounded-md overflow-hidden">
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white px-2 py-1 text-xs">
                      Preview
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Publish Date</label>
              <Input 
                type="date"
                value={formData.publish_date} 
                onChange={(e) => handleInputChange('publish_date', e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSaveNew} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add News'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit News Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit News Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input 
                value={formData.title} 
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Summary *</label>
              <Textarea 
                value={formData.summary} 
                onChange={(e) => handleInputChange('summary', e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content *</label>
              <Textarea 
                value={formData.content} 
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <Tabs defaultValue={imageUploadType} onValueChange={(val) => setImageUploadType(val as "url" | "file")}>
                <TabsList className="mb-4">
                  <TabsTrigger value="url">URL</TabsTrigger>
                  <TabsTrigger value="file">Upload</TabsTrigger>
                </TabsList>
                
                <TabsContent value="url">
                  <Input 
                    value={formData.image_url} 
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </TabsContent>
                
                <TabsContent value="file">
                  <div className="mt-2">
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="edit-image-upload" className="cursor-pointer w-full">
                        <div className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center h-32 ${uploadingImage ? 'border-health-primary' : 'border-gray-300 hover:border-health-primary'}`}>
                          {uploadingImage ? (
                            <div className="text-center">
                              <Loader2 className="h-8 w-8 animate-spin text-health-primary mx-auto mb-2" />
                              <p className="text-sm text-gray-500">Uploading...</p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <div className="flex justify-center mb-2">
                                <Image className="w-6 h-6 text-gray-400" />
                              </div>
                              <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                              <p className="text-xs text-gray-400 mt-1">News Article • Recommended: 1200x675px • PNG, JPG, GIF up to 5MB</p>
                            </div>
                          )}
                        </div>
                        <input
                          id="edit-image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              {formData.image_url && (
                <div className="mt-2">
                  <div className="relative h-32 rounded-md overflow-hidden">
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white px-2 py-1 text-xs">
                      Preview
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Publish Date</label>
              <Input 
                type="date"
                value={formData.publish_date} 
                onChange={(e) => handleInputChange('publish_date', e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View News Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentNews?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {currentNews?.image_url && (
              <div className="w-full h-64 bg-gray-100 rounded-md mb-4 overflow-hidden">
              <img 
  src={currentNews.image_url}
  alt={currentNews.title}
  className="w-full h-full object-cover"
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    // Only set the placeholder if it's not already the placeholder
    if (target.src !== window.location.origin + DEFAULT_PLACEHOLDER) {
      console.log("Image failed to load, using placeholder");
      target.src = DEFAULT_PLACEHOLDER;
    }
    target.onerror = null; // Prevent further error handling
  }}
/>
              </div>
            )}
            <p className="text-sm text-gray-500 mb-4">
              Published: {currentNews?.publish_date ? new Date(currentNews.publish_date).toLocaleDateString() : ''}
            </p>
            <p className="font-semibold mb-2">{currentNews?.summary}</p>
            <div className="prose max-w-none">
              <p className="whitespace-pre-line">{currentNews?.content}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsManager;