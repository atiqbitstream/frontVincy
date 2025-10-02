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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Loader2, Image, Grid3X3, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getUserHubEntriesByCategory, type UserHubItem } from "@/lib/api";

// API base URL from environment
const API_URL = import.meta.env.VITE_API_URL;

// Hub item interface to match API schema
interface HubItem {
  id: string;
  page_heading: string;
  page_subtext: string;
  category: string;
  description: string | null;
  image_url: string | null;
  created_at?: string;
  updated_at?: string;
}

// TypeScript interfaces for API requests
interface HubCreatePayload {
  page_heading: string;
  page_subtext: string;
  category: string;
  description: string | null;
  image_url: string | null;
}

interface HubUpdatePayload {
  page_heading?: string;
  page_subtext?: string;
  category?: string;
  description?: string | null;
  image_url?: string | null;
}

// Page settings interface
interface PageSettings {
  page_heading: string;
  page_subtext: string;
}

const HubManager = () => {
  const [hubItems, setHubItems] = useState<HubItem[]>([]);
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    page_heading: "Hub",
    page_subtext: "Explore Categories of Interest"
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isUsersDialogOpen, setIsUsersDialogOpen] = useState(false);
  const [currentHub, setCurrentHub] = useState<HubItem | null>(null);
  const [selectedCategoryUsers, setSelectedCategoryUsers] = useState<UserHubItem[]>([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<{
    category: string;
    description: string;
    image_url: string;
  }>({
    category: "",
    description: "",
    image_url: ""
  });

  // Get auth token from context
  const { token } = useAuth();

  // Fetch all hub items on component mount
  useEffect(() => {
    fetchHubItems();
  }, []);

  // API call to fetch all hub items
  const fetchHubItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/hub/`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Fetched hub data:", data);
      setHubItems(data);
      
      // Set page settings from the first item if available
      if (data.length > 0) {
        setPageSettings({
          page_heading: data[0].page_heading || "Hub",
          page_subtext: data[0].page_subtext || "Explore Categories of Interest"
        });
      }
    } catch (error) {
      console.error("Failed to fetch hub items:", error);
      toast.error("Failed to load hub categories");
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

  const handlePageSettingsChange = (field: keyof PageSettings, value: string) => {
    setPageSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch(`${API_URL}/admin/upload/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await response.json();
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

  const handleAddHubCategory = () => {
    setFormData({
      category: "",
      description: "",
      image_url: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEditHub = (hub: HubItem) => {
    setCurrentHub(hub);
    setFormData({
      category: hub.category,
      description: hub.description || "",
      image_url: hub.image_url || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteHub = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/hub/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      setHubItems(prev => prev.filter(item => item.id !== id));
      toast.success("Hub category deleted successfully");
    } catch (error) {
      console.error("Failed to delete hub category:", error);
      toast.error("Failed to delete hub category");
    }
  };

  const handleSaveNew = async () => {
    if (!formData.category) {
      toast.error("Please fill in the category name");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: HubCreatePayload = {
        page_heading: pageSettings.page_heading,
        page_subtext: pageSettings.page_subtext,
        category: formData.category,
        description: formData.description || null,
        image_url: formData.image_url || null
      };

      const response = await fetch(`${API_URL}/admin/hub/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const newItem = await response.json();
      setHubItems(prev => [...prev, newItem]);
      setIsAddDialogOpen(false);
      toast.success("Hub category added successfully");
    } catch (error) {
      console.error("Failed to add hub category:", error);
      toast.error("Failed to add hub category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!currentHub || !formData.category) {
      toast.error("Please fill in the category name");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: HubUpdatePayload = {
        page_heading: pageSettings.page_heading,
        page_subtext: pageSettings.page_subtext,
        category: formData.category,
        description: formData.description || null,
        image_url: formData.image_url || null
      };

      const response = await fetch(`${API_URL}/admin/hub/${currentHub.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const updatedItem = await response.json();
      setHubItems(prev => prev.map(item => 
        item.id === currentHub.id ? updatedItem : item
      ));
      
      setIsEditDialogOpen(false);
      toast.success("Hub category updated successfully");
    } catch (error) {
      console.error("Failed to update hub category:", error);
      toast.error("Failed to update hub category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavePageSettings = async () => {
    // Update all hub items with new page settings
    setIsSubmitting(true);
    try {
      const promises = hubItems.map(hub => 
        fetch(`${API_URL}/admin/hub/${hub.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            page_heading: pageSettings.page_heading,
            page_subtext: pageSettings.page_subtext,
            category: hub.category,
            description: hub.description,
            image_url: hub.image_url
          }),
        })
      );

      await Promise.all(promises);
      
      // Update local state
      setHubItems(prev => prev.map(item => ({
        ...item,
        page_heading: pageSettings.page_heading,
        page_subtext: pageSettings.page_subtext
      })));
      
      setIsSettingsDialogOpen(false);
      toast.success("Page settings updated successfully");
    } catch (error) {
      console.error("Failed to update page settings:", error);
      toast.error("Failed to update page settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewUsers = async (categoryName: string) => {
    setSelectedCategoryName(categoryName);
    setLoadingUsers(true);
    setIsUsersDialogOpen(true);
    
    try {
      const users = await getUserHubEntriesByCategory(categoryName);
      setSelectedCategoryUsers(users);
    } catch (error) {
      console.error("Failed to fetch users for category:", error);
      toast.error("Failed to load users for this category");
      setSelectedCategoryUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-health-secondary">Hub Management</h2>
          <p className="text-gray-600 mt-1">Manage hub page heading, subtext, and categories</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsSettingsDialogOpen(true)}>
            <Grid3X3 className="h-4 w-4 mr-1" /> Page Settings
          </Button>
          <Button onClick={handleAddHubCategory}>
            <Plus className="h-4 w-4 mr-1" /> Add Hub Category
          </Button>
        </div>
      </div>

      {/* Page Preview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-health-secondary mb-2">
            {pageSettings.page_heading}
          </h1>
          <p className="text-gray-600">
            {pageSettings.page_subtext}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-health-primary" />
            <span className="ml-2">Loading hub categories...</span>
          </div>
        ) : hubItems.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Grid3X3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hub categories found. Click "Add Hub Category" to create your first category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hubItems.map((hub) => (
              <div key={hub.id} className="bg-white rounded-lg shadow-md overflow-hidden border">
                {hub.image_url && (
                  <div className="w-full h-48 bg-gray-100 overflow-hidden">
                    <img 
                      src={hub.image_url} 
                      alt={hub.category} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{hub.category}</h3>
                  {hub.description && (
                    <p className="text-gray-700 mb-4 text-sm">{hub.description}</p>
                  )}
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">
                      Created: {new Date(hub.created_at || '').toLocaleDateString()}
                    </span>
                    <div className="space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewUsers(hub.category)}
                        className="text-blue-500 hover:text-blue-700"
                        title="View Users"
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditHub(hub)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteHub(hub.id)}
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
      </div>

      {/* Page Settings Dialog */}
      <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hub Page Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="page_heading" className="text-sm font-medium">Page Heading</Label>
              <Input 
                id="page_heading"
                value={pageSettings.page_heading} 
                onChange={(e) => handlePageSettingsChange('page_heading', e.target.value)}
                placeholder="Hub"
              />
            </div>
            <div>
              <Label htmlFor="page_subtext" className="text-sm font-medium">Page Subtext</Label>
              <Textarea 
                id="page_subtext"
                value={pageSettings.page_subtext} 
                onChange={(e) => handlePageSettingsChange('page_subtext', e.target.value)}
                placeholder="Explore Categories of Interest"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSavePageSettings} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Hub Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="category" className="text-sm font-medium">Category Name *</Label>
              <Input 
                id="category"
                value={formData.category} 
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="e.g., Meditation, Yoga, Sound Therapy"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea 
                id="description"
                value={formData.description} 
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of this category"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="image" className="text-sm font-medium">Category Image</Label>
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
                          <p className="text-sm text-gray-500">Click to upload image</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
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
                'Add Category'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Hub Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-category" className="text-sm font-medium">Category Name *</Label>
              <Input 
                id="edit-category"
                value={formData.category} 
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="e.g., Meditation, Yoga, Sound Therapy"
              />
            </div>
            <div>
              <Label htmlFor="edit-description" className="text-sm font-medium">Description</Label>
              <Textarea 
                id="edit-description"
                value={formData.description} 
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of this category"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-image" className="text-sm font-medium">Category Image</Label>
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
                          <p className="text-sm text-gray-500">Click to upload new image</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
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

      {/* View Users Dialog */}
      <Dialog open={isUsersDialogOpen} onOpenChange={setIsUsersDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Users in "{selectedCategoryName}" Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {loadingUsers ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-health-primary" />
                <span className="ml-2">Loading users...</span>
              </div>
            ) : selectedCategoryUsers.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No active users found in this category.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 mb-4">
                  Found {selectedCategoryUsers.length} active user{selectedCategoryUsers.length !== 1 ? 's' : ''} in this category
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCategoryUsers.map((user) => (
                    <div key={user.id} className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-sm text-gray-600">Name:</span>
                          <p className="font-semibold">{user.name}</p>
                        </div>
                        <div>
                          <span className="font-medium text-sm text-gray-600">Email:</span>
                          <p className="text-sm">{user.email}</p>
                        </div>
                        {user.description && (
                          <div>
                            <span className="font-medium text-sm text-gray-600">Description:</span>
                            <p className="text-sm text-gray-700">{user.description}</p>
                          </div>
                        )}
                        {user.url && (
                          <div>
                            <span className="font-medium text-sm text-gray-600">URL:</span>
                            <a 
                              href={user.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-health-primary hover:underline block break-all"
                            >
                              {user.url}
                            </a>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-xs text-gray-500">
                            Created: {new Date(user.created_at || '').toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUsersDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HubManager;