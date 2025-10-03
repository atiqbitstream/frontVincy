import { useState, useEffect } from "react";
import { Edit, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { UserHubItem } from "@/lib/api";

const UserHubTable = () => {
  const [userHubs, setUserHubs] = useState<UserHubItem[]>([]);
  const [selectedUserHub, setSelectedUserHub] = useState<UserHubItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    category: "",
    description: "",
    url: "",
    status: true
  });

  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  // Load user hubs on mount
  useEffect(() => {
    fetchUserHubs();
  }, []);

  const fetchUserHubs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/user-hub/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setUserHubs(data);
    } catch (error) {
      console.error("Failed to load user hubs:", error);
      toast.error("Could not load user hub data");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUserHub = (userHub: UserHubItem) => {
    setSelectedUserHub(userHub);
    setEditForm({
      name: userHub.name,
      email: userHub.email,
      category: userHub.category,
      description: userHub.description || "",
      url: userHub.url || "",
      status: userHub.status
    });
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedUserHub(null);
    setEditForm({
      name: "",
      email: "",
      category: "",
      description: "",
      url: "",
      status: true
    });
  };

  const handleFormChange = (field: keyof typeof editForm, value: string | boolean) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = async () => {
    if (!selectedUserHub) return;

    if (!editForm.name || !editForm.email || !editForm.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/admin/user-hub/${selectedUserHub.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          category: editForm.category,
          description: editForm.description || null,
          url: editForm.url || null,
          status: editForm.status
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const updatedUserHub = await response.json();
      
      // Update local state
      setUserHubs(prev => prev.map(hub => 
        hub.id === selectedUserHub.id ? updatedUserHub : hub
      ));
      
      handleCloseEditDialog();
      toast.success("User hub updated successfully");
    } catch (error) {
      console.error("Failed to update user hub:", error);
      toast.error("Failed to update user hub");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (userHub: UserHubItem) => {
    try {
      const response = await fetch(`${API_URL}/admin/user-hub/${userHub.id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const updatedUserHub = await response.json();
      
      // Update local state
      setUserHubs(prev => prev.map(hub => 
        hub.id === userHub.id ? updatedUserHub : hub
      ));
      
      toast.success(`User hub ${updatedUserHub.status ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error("Failed to toggle status:", error);
      toast.error("Failed to toggle status");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">User Hub Management</h2>
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Loading user hub data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">User Hub Management</h2>
      <p className="text-gray-600">Manage user submissions to hub categories</p>

      <div className="bg-white rounded-lg shadow overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userHubs.map((userHub) => (
              <TableRow key={userHub.id}>
                <TableCell className="font-medium">{userHub.name}</TableCell>
                <TableCell>{userHub.email}</TableCell>
                <TableCell>{userHub.category}</TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate" title={userHub.description || 'No description'}>
                    {userHub.description || 'No description'}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  {userHub.url ? (
                    <a 
                      href={userHub.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate block"
                      title={userHub.url}
                    >
                      {userHub.url}
                    </a>
                  ) : (
                    <span className="text-gray-400">No URL</span>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {userHub.created_by || 'Unknown'}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userHub.status 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {userHub.status ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditUserHub(userHub)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(userHub)}
                      className={userHub.status ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                      title={userHub.status ? "Deactivate" : "Activate"}
                    >
                      {userHub.status ? (
                        <ToggleRight className="h-4 w-4" />
                      ) : (
                        <ToggleLeft className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {userHubs.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No user hub submissions found.</p>
        </div>
      )}

      {/* Edit User Hub Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User Hub Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name" className="text-sm font-medium">Name *</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-email" className="text-sm font-medium">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-category" className="text-sm font-medium">Category *</Label>
              <Input
                id="edit-category"
                value={editForm.category}
                onChange={(e) => handleFormChange('category', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-url" className="text-sm font-medium">URL</Label>
              <Input
                id="edit-url"
                type="url"
                value={editForm.url}
                onChange={(e) => handleFormChange('url', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="edit-description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                rows={3}
                placeholder="Enter description..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-status"
                checked={editForm.status}
                onChange={(e) => handleFormChange('status', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="edit-status" className="text-sm font-medium">Active Status</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseEditDialog} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserHubTable;