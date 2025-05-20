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
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export interface UserOut {
  id: string;
  email: string;
  full_name: string; // Changed from fullName to match API response
  country: string;
  occupation: string;
  user_status: "Active" | "Inactive" | "Pending"; // Changed from status to user_status to match API response
  // …other personal fields…
}

const deviceControls = [
  { title: "Sound System",       endpoint: "/sound-history",            status: Math.random() > 0.5 },
  { title: "LED Light Therapy",  endpoint: "/led-history",              color: ["red","green","blue","purple","yellow"][Math.floor(Math.random()*5)] },
  { title: "Steam Generator",    endpoint: "/steam-history",            status: Math.random() > 0.5 },
  { title: "Nanoflicker",        endpoint: "/nanoflicker-history",      status: Math.random() > 0.5 },
  { title: "Temperature Tank",   endpoint: "/temperature-tank-history", temperature: Math.floor(Math.random()*30)+60 },
  { title: "Water Pump",         endpoint: "/water-pump-history",        status: Math.random() > 0.5 },
];

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
];

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
                <TableCell className="font-medium">{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.country}</TableCell>
                <TableCell>{user.occupation}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.user_status === "Active" ? "bg-green-100 text-green-800" :
                    user.user_status === "Inactive" ? "bg-gray-100 text-gray-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {user.user_status}
                  </span>
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
              <DialogTitle>{selectedUser.full_name}</DialogTitle>
            </DialogHeader>

            {/* Toggle between device cards and form cards */}
            {viewingDevice ? (
              <UserDeviceHistory
                isOpen={!!viewingDevice}
                onClose={handleCloseDeviceHistory}
                title={viewingDevice.name}
                endpoint={viewingDevice.endpoint}
                userId={selectedUser.id}
                userName={selectedUser.full_name}
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
                            selectedUser.full_name
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