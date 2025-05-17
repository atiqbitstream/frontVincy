
import { useState } from "react";
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
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

// Mock news data
const initialNewsData = [
  {
    id: "1",
    title: "New Therapeutic Technology Breakthrough",
    summary: "Our team has developed a revolutionary approach to burn therapy using LED technology.",
    content: "Our research team, led by Dr. Sarah Johnson, has made significant progress in developing new LED-based therapeutic approaches for burn victims. The novel technology uses specific light wavelengths to stimulate tissue regeneration and reduce inflammation...",
    image: "https://picsum.photos/id/237/600/400",
    publishDate: "2023-09-15"
  },
  {
    id: "2",
    title: "W.O.M.B Platform Wins Healthcare Innovation Award",
    summary: "Our remote monitoring platform was recognized for excellence in healthcare technology.",
    content: "We are proud to announce that the W.O.M.B platform has received the prestigious Healthcare Innovation Award for 2023. The award recognizes our contributions to advancing remote therapeutic care and monitoring...",
    image: "https://picsum.photos/id/238/600/400",
    publishDate: "2023-08-28"
  },
  {
    id: "3",
    title: "Upcoming Webinar: Advances in Remote Therapeutic Care",
    summary: "Join our panel of experts as they discuss the latest developments in remote healthcare.",
    content: "Mark your calendars for our upcoming webinar on 'Advances in Remote Therapeutic Care'. Our distinguished panel will discuss the latest developments in telemedicine, remote monitoring, and how technological innovations are changing the landscape of healthcare delivery...",
    image: "https://picsum.photos/id/239/600/400",
    publishDate: "2023-10-05"
  }
];

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  publishDate: string;
}

const NewsManager = () => {
  const [newsItems, setNewsItems] = useState(initialNewsData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState<Partial<NewsItem>>({
    title: "",
    summary: "",
    content: "",
    image: "",
    publishDate: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddNews = () => {
    setFormData({
      title: "",
      summary: "",
      content: "",
      image: "",
      publishDate: new Date().toISOString().split('T')[0]
    });
    setIsAddDialogOpen(true);
  };

  const handleEditNews = (news: NewsItem) => {
    setCurrentNews(news);
    setFormData({
      title: news.title,
      summary: news.summary,
      content: news.content,
      image: news.image,
      publishDate: news.publishDate
    });
    setIsEditDialogOpen(true);
  };

  const handleViewNews = (news: NewsItem) => {
    setCurrentNews(news);
    setIsViewDialogOpen(true);
  };

  const handleDeleteNews = (id: string) => {
    setNewsItems(prev => prev.filter(item => item.id !== id));
    toast.success("News item deleted successfully");
  };

  const handleSaveNew = () => {
    if (!formData.title || !formData.summary || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newItem: NewsItem = {
      id: `news-${Date.now()}`,
      title: formData.title || "",
      summary: formData.summary || "",
      content: formData.content || "",
      image: formData.image || "https://picsum.photos/id/240/600/400",
      publishDate: formData.publishDate || new Date().toISOString().split('T')[0]
    };

    setNewsItems(prev => [...prev, newItem]);
    setIsAddDialogOpen(false);
    toast.success("News item added successfully");
  };

  const handleSaveEdit = () => {
    if (!currentNews || !formData.title || !formData.summary || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    setNewsItems(prev => prev.map(item => 
      item.id === currentNews.id 
        ? { 
            ...item, 
            title: formData.title || item.title,
            summary: formData.summary || item.summary,
            content: formData.content || item.content,
            image: formData.image || item.image,
            publishDate: formData.publishDate || item.publishDate
          }
        : item
    ));
    
    setIsEditDialogOpen(false);
    toast.success("News item updated successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-health-secondary">News Management</h2>
        <Button onClick={handleAddNews}>
          <Plus className="h-4 w-4 mr-1" /> Add News
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsItems.map((news) => (
          <div key={news.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img 
              src={news.image} 
              alt={news.title} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{news.title}</h3>
              <p className="text-gray-600 text-sm mb-2">Published: {news.publishDate}</p>
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
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <Input 
                value={formData.image} 
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Publish Date</label>
              <Input 
                type="date"
                value={formData.publishDate} 
                onChange={(e) => handleInputChange('publishDate', e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNew}>Add News</Button>
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
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <Input 
                value={formData.image} 
                onChange={(e) => handleInputChange('image', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Publish Date</label>
              <Input 
                type="date"
                value={formData.publishDate} 
                onChange={(e) => handleInputChange('publishDate', e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
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
            {currentNews?.image && (
              <img 
                src={currentNews.image}
                alt={currentNews.title}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
            )}
            <p className="text-sm text-gray-500 mb-4">Published: {currentNews?.publishDate}</p>
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
