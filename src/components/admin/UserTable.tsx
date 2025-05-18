// src/components/admin/UserTable.tsx

import { useState, useEffect } from "react";
import { Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserDeviceHistory from "./UserDeviceHistory";
import UserEditForm from "./UserEditForm";
import UserDataHistory from "./UserDataHistory";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export interface UserOut {
  id: string;
  fullName: string;
  email: string;
  country: string;
  occupation: string;
  status: "Active" | "Inactive" | "Pending";
  // …other personal fields…
}

const deviceControls = [
  { title: "Sound System",       endpoint: "/sound-history",            status: Math.random() > 0.5 },
  { title: "LED Light Therapy",  endpoint: "/led-history",              color: ["red","green","blue","purple","yellow"][Math.floor(Math.random()*5)] },
  { title: "Steam Generator",    endpoint: "/steam-history",            status: Math.random() > 0.5 },
  { title: "Nanoflicker",        endpoint: "/nanoflicker-history",      status: Math.random() > 0.5 },
  { title: "Temperature Tank",   endpoint: "/temperature-tank-history", temperature: Math.floor(Math.random()*30)+60 },
  { title: "Water Pump",         endpoint: "/water-pump-history",        status: Math.random() > 0.5 },
]; // :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}

const dataForms = [
  {
    title: "Biofeedback",
    endpoint: "/biofeedback",
    fields: [
      { name: "heart_rate",               label: "Heart Rate (BPM)" },
      { name: "heart_rate_variability",   label: "Heart Rate Variability (ms)" },
      { name: "electromyography",         label: "Electromyography (μV)" },
      { name: "electrodermal_activity",   label: "Electrodermal Activity (μS)" },
      { name: "respiration_rate",         label: "Respiration Rate (BPM)" },
    ],
  },
  {
    title: "Burn Progress",
    endpoint: "/burn-progress",
    fields: [
      { name: "wound_size",        label: "Wound Size (cm²)" },
      { name: "epithelialization", label: "Epithelialization (%)" },
      { name: "exudate_amount",    label: "Exudate Amount (ml)" },
      { name: "pain_level",        label: "Pain Level (0-10)" },
      { name: "swelling",          label: "Swelling (0-10)" },
    ],
  },
  {
    title: "Brain Monitoring",
    endpoint: "/brain-monitoring",
    fields: [
      { name: "alpha_waves",  label: "Alpha Waves (Hz)" },
      { name: "theta_waves",  label: "Theta Waves (Hz)" },
      { name: "beta_waves",   label: "Beta Waves (Hz)" },
      { name: "gamma_waves",  label: "Gamma Waves (Hz)" },
      { name: "heart_rate",   label: "Heart Rate (BPM)" },
    ],
  },
  {
    title: "Heart-Brain Synchronicity",
    endpoint: "/heart-brain-synchronicity",
    fields: [
      { name: "heart_rate_variability",       label: "Heart Rate Variability (ms)" },
      { name: "alpha_waves",                  label: "Alpha Waves (Hz)" },
      { name: "respiratory_sinus_arrhythmia", label: "RSA (ms)" },
      { name: "coherence_ratio",              label: "Coherence Ratio" },
      { name: "brainwave_coherence",          label: "Brainwave Coherence (%)" },
    ],
  },
]; // :contentReference[oaicite:2]{index=2}:contentReference[oaicite:3]{index=3}

const UserTable = () => {
  const [users, setUsers] = useState<UserOut[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserOut | null>(null);
  const [viewingDevice, setViewingDevice] = useState<{ name: string; endpoint: string } | null>(null);
  const [viewingFormData, setViewingFormData] = useState<{ formType: string; userId: string; userName: string } | null>(null);
  const [editingUser, setEditingUser] = useState<UserOut | null>(null);

  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  // Load users on mount
  useEffect(() => {
    fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setUsers)
      .catch((e) => {
        console.error("Failed to load users:", e);
        toast.error("Could not load users");
      });
  }, []);

  const { user } = useAuth();
  const adminEmail=user?.email;
  // Update status via dropdown
  const handleUpdateUserStatus = async (
    userId: string,
    newStatus: "Active" | "Inactive" | "Pending"
  ) => {
    // Optimistic UI
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_status: newStatus, updated_by:adminEmail }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success(`Status set to ${newStatus}`);
    } catch (e) {
      console.error("Status update failed:", e);
      toast.error("Could not update status");
      // Revert
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: u.status } : u))
      );
    }
  }; // :contentReference[oaicite:4]{index=4}:contentReference[oaicite:5]{index=5}

  const handleViewUser = (user: UserOut) => setSelectedUser(user);
  const handleCloseUserModal = () => setSelectedUser(null);

  const handleViewDeviceHistory = (device: { title: string; endpoint: string }) => {
    if (!selectedUser) return;
    setViewingDevice({ name: device.title, endpoint: `${device.endpoint}/users/${selectedUser.id}` });
  };
  const handleCloseDeviceHistory = () => setViewingDevice(null);

  const handleEditUser = (user: UserOut) => setEditingUser(user);
  const handleCloseEditModal = () => setEditingUser(null);

  const handleSaveUserEdit = (updated: UserOut) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updated.id ? updated : u))
    );
    setEditingUser(null);
    toast.success("User updated");
  };

  const handleViewUserFormData = (title: string, userId: string, userName: string) => {
    setViewingFormData({ formType: title, userId, userName });
  };
  const handleCloseFormHistory = () => setViewingFormData(null);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      <div className="bg-white rounded-lg shadow overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Occupation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.country}</TableCell>
                <TableCell>{user.occupation}</TableCell>
                <TableCell>
                  <Select
                    value={user.status}
                    onValueChange={(val) =>
                      handleUpdateUserStatus(user.id, val as any)
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewUser(user)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={handleCloseUserModal}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedUser.fullName}</DialogTitle>
            </DialogHeader>

            {/* Toggle between device cards and form cards */}
            {viewingDevice ? (
              <UserDeviceHistory
                isOpen={!!viewingDevice}
                onClose={handleCloseDeviceHistory}
                title={viewingDevice.name}
                endpoint={viewingDevice.endpoint}
                userId={selectedUser.id}
                userName={selectedUser.fullName}
              />
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dataForms.map((form) => (
                    <div
                      key={form.title}
                      className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <h3 className="font-semibold mb-2">{form.title}</h3>
                      <p className="text-sm text-foreground/70 mb-4">
                        View or manage {form.title.toLowerCase()}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleViewUserFormData(
                            form.title,
                            selectedUser.id,
                            selectedUser.fullName
                          )
                        }
                      >
                        View Form Data
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Edit User Form */}
      {editingUser && (
        <UserEditForm
          user={editingUser}
          onSave={handleSaveUserEdit}
          onCancel={handleCloseEditModal}
        />
      )}

      {/* Form Data History Modal */}
      {viewingFormData && (
        <UserDataHistory
          isOpen={!!viewingFormData}
          onClose={handleCloseFormHistory}
          title={viewingFormData.formType}
          userId={viewingFormData.userId}
          userName={viewingFormData.userName}
          fields={
            dataForms.find((f) => f.title === viewingFormData.formType)
              ?.fields || []
          }
        />
      )}
    </div>
  );
};

export default UserTable;
