
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// API base URL from environment
const API_URL = import.meta.env.VITE_API_URL;

const AboutEditor = () => {
  const { token } = useAuth();
  const [aboutData, setAboutData] = useState({
    id: undefined,
    title: "",
    subtitle: "",
    image_url: "",
    heading: "",
    content: "",
    heading_2: "",
    content_2: "",
    image_url_2: "",
    team_members: "[]",
    mission: "",
    vision: "",
    description: "",
    team_info: "",
    company_history: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [imageUploadType, setImageUploadType] = useState<"url" | "file">("url");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch existing about data
  useEffect(() => {
    const fetchAboutData = async () => {
      if (!token) return;
      
      try {
        console.log("Fetching about data from API...");
        const response = await fetch(`${API_URL}/admin/about/`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 404) {
          console.log("No about data found, using empty form");
          // Keep the empty default state
        } else if (response.ok) {
          const data = await response.json();
          console.log("Fetched about data:", data);
          setAboutData(data);
        } else {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
        toast.error('Failed to load about data');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, [token]);

  // Parse team members from JSON string
  const getTeamMembers = () => {
    try {
      return JSON.parse(aboutData.team_members || "[]");
    } catch {
      return [];
    }
  };

  // Update team members as JSON string
  const updateTeamMembers = (members: any[]) => {
    setAboutData(prev => ({
      ...prev,
      team_members: JSON.stringify(members)
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAboutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberChange = (memberId: string, field: string, value: string) => {
    const teamMembers = getTeamMembers();
    const updatedMembers = teamMembers.map(member => 
      member.id === memberId ? { ...member, [field]: value } : member
    );
    updateTeamMembers(updatedMembers);
  };

  const handleImageChange = (imageType: 'image_url' | 'image_url_2', value: string) => {
    setAboutData(prev => ({
      ...prev,
      [imageType]: value
    }));
  };

  const handleFileUpload = async (imageType: 'image_url' | 'image_url_2', e: React.ChangeEvent<HTMLInputElement>) => {
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
      handleImageChange(imageType, imageUrl);
      
      toast.success(`${imageType === 'image_url' ? 'Hero' : 'Vision'} image uploaded successfully`);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!token) {
      toast.error("Authentication required");
      return;
    }
    
    setSaving(true);
    
    try {
      console.log("Saving about data:", aboutData);
      
      // Check if we have an existing about record with ID
      if (aboutData.id) {
        // Update existing record
        const response = await fetch(`${API_URL}/admin/about/${aboutData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(aboutData)
        });
        
        if (response.ok) {
          const updatedData = await response.json();
          console.log("About data updated:", updatedData);
          setAboutData(updatedData);
          toast.success("About page updated successfully");
        } else {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`Failed to update about page: ${response.status}`);
        }
      } else {
        // Create new record
        const response = await fetch(`${API_URL}/admin/about/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(aboutData)
        });
        
        if (response.ok) {
          const createdData = await response.json();
          console.log("About data created:", createdData);
          setAboutData(createdData);
          toast.success("About page created successfully");
        } else {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`Failed to create about page: ${response.status}`);
        }
      }
    } catch (error) {
      console.error("Error saving about data:", error);
      toast.error("Failed to save about page");
    } finally {
      setSaving(false);
    }
  };

  const handleAddTeamMember = () => {
    const teamMembers = getTeamMembers();
    const newMember = {
      id: Date.now().toString(),
      name: "New Team Member",
      role: "Role",
      bio: "Bio information"
    };
    
    updateTeamMembers([...teamMembers, newMember]);
  };

  const handleRemoveTeamMember = (id: string) => {
    const teamMembers = getTeamMembers();
    const updatedMembers = teamMembers.filter(member => member.id !== id);
    updateTeamMembers(updatedMembers);
    
    if (selectedMember === id) {
      setSelectedMember(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-health-secondary">About Page Editor</h2>
        <Button 
          onClick={handleSave}
          disabled={saving || loading}
          className="ml-auto"
        >
          {saving ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Saving
            </>
          ) : 'Save Changes'}
        </Button>
      </div>
      
      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow space-y-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Header</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={aboutData.title}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  value={aboutData.subtitle}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          {/* Hero Image Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Hero Image</h3>
            
            <Tabs defaultValue={imageUploadType} onValueChange={(val) => setImageUploadType(val as "url" | "file")}>
              <TabsList className="mb-4">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="file">Upload</TabsTrigger>
              </TabsList>
              
              <TabsContent value="url">
                <div>
                  <Label htmlFor="hero-image-url">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="hero-image-url"
                      value={aboutData.image_url}
                      onChange={(e) => handleImageChange('image_url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button
                      type="button" 
                      variant="outline"
                      onClick={() => handleImageChange('image_url', aboutData.image_url)}
                      className="flex-shrink-0"
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="file">
                <div>
                  <Label htmlFor="hero-image-upload">Upload Image</Label>
                  <div className="mt-2">
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="hero-image-upload" className="cursor-pointer w-full">
                        <div className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center h-48 ${uploadingImage ? 'border-health-primary' : 'border-gray-300 hover:border-health-primary'}`}>
                          {uploadingImage ? (
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-health-primary mx-auto mb-2"></div>
                              <p className="text-sm text-gray-500">Uploading...</p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <div className="flex justify-center mb-2">
                                <Image className="w-8 h-8 text-gray-400" />
                              </div>
                              <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                              <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                            </div>
                          )}
                        </div>
                        <input
                          id="hero-image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload('image_url', e)}
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-4">
              {aboutData.image_url && (
                <div className="relative h-48 rounded-md overflow-hidden">
                  <img 
                    src={aboutData.image_url} 
                    alt="Hero Preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white px-2 py-1 text-xs">
                    Preview
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Mission Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Mission</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="heading">Heading</Label>
                <Input
                  id="heading"
                  name="heading"
                  value={aboutData.heading}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={aboutData.content}
                  onChange={handleChange}
                  rows={5}
                />
              </div>
            </div>
          </div>
          
          {/* Vision Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Vision</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="heading_2">Heading</Label>
                <Input
                  id="heading_2"
                  name="heading_2"
                  value={aboutData.heading_2}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="content_2">Content</Label>
                <Textarea
                  id="content_2"
                  name="content_2"
                  value={aboutData.content_2}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>
            
            {/* Vision Image */}
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Vision Image</h4>
              
              <Tabs defaultValue={imageUploadType}>
                <TabsList className="mb-4">
                  <TabsTrigger value="url">URL</TabsTrigger>
                  <TabsTrigger value="file">Upload</TabsTrigger>
                </TabsList>
                
                <TabsContent value="url">
                  <div>
                    <Label htmlFor="vision-image-url">Image URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="vision-image-url"
                        value={aboutData.image_url_2}
                        onChange={(e) => handleImageChange('image_url_2', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                      <Button
                        type="button" 
                        variant="outline"
                        onClick={() => handleImageChange('image_url_2', aboutData.image_url_2)}
                        className="flex-shrink-0"
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="file">
                  <div>
                    <Label htmlFor="vision-image-upload">Upload Image</Label>
                    <div className="mt-2">
                      <div className="flex items-center justify-center w-full">
                        <label htmlFor="vision-image-upload" className="cursor-pointer w-full">
                          <div className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center h-48 ${uploadingImage ? 'border-health-primary' : 'border-gray-300 hover:border-health-primary'}`}>
                            {uploadingImage ? (
                              <div className="text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-health-primary mx-auto mb-2"></div>
                                <p className="text-sm text-gray-500">Uploading...</p>
                              </div>
                            ) : (
                              <div className="text-center">
                                <div className="flex justify-center mb-2">
                                  <Image className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                              </div>
                            )}
                          </div>
                          <input
                            id="vision-image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload('image_url_2', e)}
                            disabled={uploadingImage}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-4">
                {aboutData.image_url_2 && (
                  <div className="relative h-48 rounded-md overflow-hidden">
                    <img 
                      src={aboutData.image_url_2} 
                      alt="Vision Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white px-2 py-1 text-xs">
                      Preview
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Team Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Team</h3>
              <Button
                onClick={handleAddTeamMember}
                variant="outline"
                size="sm"
              >
                Add Team Member
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 space-y-2">
                <Label>Team Members</Label>
                <div className="space-y-1">
                  {getTeamMembers().map(member => (
                    <div 
                      key={member.id}
                      className={`flex items-center justify-between p-2 rounded ${selectedMember === member.id ? 'bg-health-light' : 'bg-muted/30 hover:bg-muted/50'} cursor-pointer`}
                      onClick={() => setSelectedMember(member.id)}
                    >
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-foreground/70">{member.role}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveTeamMember(member.id);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="w-full md:w-2/3">
                {selectedMember ? (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Edit Team Member</h4>
                    
                    {getTeamMembers().filter(m => m.id === selectedMember).map(member => (
                      <div key={member.id} className="space-y-4">
                        <div>
                          <Label htmlFor={`name-${member.id}`}>Name</Label>
                          <Input
                            id={`name-${member.id}`}
                            value={member.name}
                            onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`role-${member.id}`}>Role</Label>
                          <Input
                            id={`role-${member.id}`}
                            value={member.role}
                            onChange={(e) => handleMemberChange(member.id, 'role', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`bio-${member.id}`}>Bio</Label>
                          <Textarea
                            id={`bio-${member.id}`}
                            value={member.bio || ""}
                            onChange={(e) => handleMemberChange(member.id, 'bio', e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center border rounded-md p-6 bg-muted/10">
                    <p className="text-muted-foreground">Select a team member to edit</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={aboutData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="team_info">Team Information</Label>
                <Textarea
                  id="team_info"
                  name="team_info"
                  value={aboutData.team_info}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="company_history">Company History</Label>
                <Textarea
                  id="company_history"
                  name="company_history"
                  value={aboutData.company_history}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutEditor;
