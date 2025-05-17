
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image } from "lucide-react";

const AboutEditor = () => {
  const [aboutData, setAboutData] = useState({
    title: "About W.O.M.B",
    subtitle: "Wellness Optimal Mind Body",
    mainHeading: "Our Mission",
    mainContent: `At W.O.M.B (Wellness Optimal Mind Body), we are dedicated to revolutionizing the way healthcare professionals deliver therapeutic treatments. Our platform bridges the gap between cutting-edge wellness technology and healthcare providers, creating seamless integrations that improve patient outcomes.

Founded in 2020, our team of medical professionals and technology experts has developed a comprehensive system for monitoring and controlling therapeutic devices remotely, allowing for more precise and personalized treatment plans.`,
    visionHeading: "Our Vision",
    visionContent: "We envision a future where healthcare professionals can provide optimal care without limitations of physical presence, where therapeutic devices work in harmony to create personalized healing environments, and where patients receive the highest standard of care through technological innovation.",
    teamHeading: "Our Team",
    heroImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    visionImage: "https://images.unsplash.com/photo-1521322800607-8c38375eef04",
    teamMembers: [
      {
        id: "1",
        name: "Dr. Sarah Johnson",
        role: "Chief Medical Officer",
        bio: "Dr. Johnson has over 15 years of experience in rehabilitation medicine and leads our medical research initiatives."
      },
      {
        id: "2",
        name: "Michael Chen",
        role: "Chief Technology Officer",
        bio: "Michael brings 20 years of expertise in IoT and healthcare technology integration."
      },
      {
        id: "3",
        name: "Lisa Rodriguez",
        role: "Head of Product Development",
        bio: "Lisa specializes in creating intuitive healthcare interfaces and workflow optimization."
      }
    ]
  });
  
  const [saving, setSaving] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [imageUploadType, setImageUploadType] = useState<"url" | "file">("url");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAboutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberChange = (memberId: string, field: string, value: string) => {
    setAboutData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(member => 
        member.id === memberId ? { ...member, [field]: value } : member
      )
    }));
  };

  const handleImageChange = (imageType: 'heroImage' | 'visionImage', value: string) => {
    setAboutData(prev => ({
      ...prev,
      [imageType]: value
    }));
  };

  const handleFileUpload = (imageType: 'heroImage' | 'visionImage', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    // In a real app, this would be an actual file upload to a storage service
    // Here we're simulating the upload with a timeout
    setTimeout(() => {
      // Create a URL for the selected file to preview (in a real app, this would be the uploaded file URL)
      const imageUrl = URL.createObjectURL(file);
      handleImageChange(imageType, imageUrl);
      setUploadingImage(false);
      toast.success(`${imageType === 'heroImage' ? 'Hero' : 'Vision'} image uploaded successfully`);
    }, 1500);
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // In a real app, this would be an API call to save the data
      console.log("Saving about data:", aboutData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate API delay
      toast.success("About page updated successfully");
    } catch (error) {
      console.error("Error saving about data:", error);
      toast.error("Failed to update about page");
    } finally {
      setSaving(false);
    }
  };

  const handleAddTeamMember = () => {
    const newMember = {
      id: Date.now().toString(),
      name: "New Team Member",
      role: "Role",
      bio: "Bio information"
    };
    
    setAboutData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, newMember]
    }));
  };

  const handleRemoveTeamMember = (id: string) => {
    setAboutData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member.id !== id)
    }));
    
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
          disabled={saving}
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
                    value={aboutData.heroImage}
                    onChange={(e) => handleImageChange('heroImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button
                    type="button" 
                    variant="outline"
                    onClick={() => handleImageChange('heroImage', aboutData.heroImage)}
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
                        onChange={(e) => handleFileUpload('heroImage', e)}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-4">
            {aboutData.heroImage && (
              <div className="relative h-48 rounded-md overflow-hidden">
                <img 
                  src={aboutData.heroImage} 
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
              <Label htmlFor="mainHeading">Heading</Label>
              <Input
                id="mainHeading"
                name="mainHeading"
                value={aboutData.mainHeading}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="mainContent">Content</Label>
              <Textarea
                id="mainContent"
                name="mainContent"
                value={aboutData.mainContent}
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
              <Label htmlFor="visionHeading">Heading</Label>
              <Input
                id="visionHeading"
                name="visionHeading"
                value={aboutData.visionHeading}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="visionContent">Content</Label>
              <Textarea
                id="visionContent"
                name="visionContent"
                value={aboutData.visionContent}
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
                      value={aboutData.visionImage}
                      onChange={(e) => handleImageChange('visionImage', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button
                      type="button" 
                      variant="outline"
                      onClick={() => handleImageChange('visionImage', aboutData.visionImage)}
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
                          onChange={(e) => handleFileUpload('visionImage', e)}
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-4">
              {aboutData.visionImage && (
                <div className="relative h-48 rounded-md overflow-hidden">
                  <img 
                    src={aboutData.visionImage} 
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
          
          <div>
            <Label htmlFor="teamHeading">Team Heading</Label>
            <Input
              id="teamHeading"
              name="teamHeading"
              value={aboutData.teamHeading}
              onChange={handleChange}
              className="mb-4"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 space-y-2">
              <Label>Team Members</Label>
              <div className="space-y-1">
                {aboutData.teamMembers.map(member => (
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
                  
                  {aboutData.teamMembers.filter(m => m.id === selectedMember).map(member => (
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
                          value={member.bio}
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
      </div>
    </div>
  );
};

export default AboutEditor;
