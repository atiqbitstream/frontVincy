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
  full_name: string;
  country: string;
  occupation: string;
  user_status: "Active" | "Inactive" | "Pending";
}

// Health monitoring forms configuration
const healthMonitoringForms = [
  {
    title: "Biofeedback",
    endpoint: "biofeedback",
    category: "health-monitoring",
    fields: [
      { name: "heart_rate", label: "Heart Rate (BPM)" },
      { name: "heart_rate_variability", label: "Heart Rate Variability (ms)" },
      { name: "electromyography", label: "Electromyography (μV)" },
      { name: "electrodermal_activity", label: "Electrodermal Activity (μS)" },
      { name: "respiration_rate", label: "Respiration Rate (BPM)" },
    ],
  },
  {
    title: "Burn Progress",
    endpoint: "burn-progress",
    category: "health-monitoring",
    fields: [
      { name: "wound_size", label: "Wound Size (cm²)" },
      { name: "epithelialization", label: "Epithelialization (%)" },
      { name: "exudate_amount", label: "Exudate Amount (ml)" },
      { name: "pain_level", label: "Pain Level (0-10)" },
      { name: "swelling", label: "Swelling (0-10)" },
    ],
  },
  {
    title: "Brain Monitoring",
    endpoint: "brain-monitoring",
    category: "health-monitoring",
    fields: [
      { name: "alpha_waves", label: "Alpha Waves (Hz)" },
      { name: "theta_waves", label: "Theta Waves (Hz)" },
      { name: "beta_waves", label: "Beta Waves (Hz)" },
      { name: "gamma_waves", label: "Gamma Waves (Hz)" },
      { name: "heart_rate", label: "Heart Rate (BPM)" },
    ],
  },
  {
    title: "Heart-Brain Synchronicity",
    endpoint: "heart-brain-synchronicity",
    category: "health-monitoring",
    fields: [
      { name: "heart_rate_variability", label: "Heart Rate Variability (ms)" },
      { name: "alpha_waves", label: "Alpha Waves (Hz)" },
      { name: "respiratory_sinus_arrhythmia", label: "RSA (ms)" },
      { name: "coherence_ratio", label: "Coherence Ratio" },
      { name: "brainwave_coherence", label: "Brainwave Coherence (%)" },
    ],
  },
];

// Device controls configuration
const deviceControlForms = [
  {
    title: "Sound System",
    endpoint: "sound",
    category: "device-controls",
    fields: [
      { name: "status", label: "Status" },
      { name: "volume", label: "Volume" },
      { name: "frequency", label: "Frequency (Hz)" },
    ],
  },
  {
    title: "Steam Generator",
    endpoint: "steam",
    category: "device-controls",
    fields: [
      { name: "status", label: "Status" },
      { name: "intensity", label: "Intensity" },
      { name: "duration", label: "Duration (minutes)" },
    ],
  },
  {
    title: "Temperature Tank",
    endpoint: "temp-tank",
    category: "device-controls",
    fields: [
      { name: "temperature", label: "Temperature (°C)" },
      { name: "status", label: "Status" },
    ],
  },
  {
    title: "Water Pump",
    endpoint: "water-pump",
    category: "device-controls",
    fields: [
      { name: "status", label: "Status" },
      { name: "flow_rate", label: "Flow Rate" },
      { name: "pressure", label: "Pressure" },
    ],
  },
  {
    title: "Nanoflicker",
    endpoint: "nano-flicker",
    category: "device-controls",
    fields: [
      { name: "status", label: "Status" },
      { name: "frequency", label: "Frequency (Hz)" },
      { name: "intensity", label: "Intensity" },
    ],
  },
  {
    title: "LED Light Therapy",
    endpoint: "led-color",
    category: "device-controls",
    fields: [
      { name: "color", label: "Color" },
      { name: "intensity", label: "Intensity" },
      { name: "duration", label: "Duration (minutes)" },
    ],
  },
];

// Combine all forms
const allDataForms = [...healthMonitoringForms, ...deviceControlForms];

const UserTable = () => {
  const [users, setUsers] = useState<UserOut[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserOut | null>(null);
  const [viewingDevice, setViewingDevice] = useState<{ name: string; endpoint: string } | null>(null);
  const [viewingFormData, setViewingFormData] = useState<{ 
    formType: string; 
    userId: string; 
    userName: string;
    userEmail: string; // Add userEmail
    endpoint: string;
    category: string;
    fields: Array<{ name: string; label: string }>;
  } | null>(null);
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
  }, [API_URL, token]);

  const { user } = useAuth();
  const adminEmail = user?.email;

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

  const handleViewUserFormData = (form: typeof allDataForms[0], userId: string, userName: string, userEmail: string) => {
    setViewingFormData({ 
      formType: form.title, 
      userId, 
      userName,
      userEmail, // Pass userEmail
      endpoint: form.endpoint,
      category: form.category,
      fields: form.fields
    });
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
          <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedUser.full_name} - Data Management</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Health Monitoring Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Health Monitoring</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {healthMonitoringForms.map((form) => (
                    <div
                      key={form.title}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-blue-50"
                    >
                      <h4 className="font-semibold mb-2">{form.title}</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        View and manage {form.title.toLowerCase()} data
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleViewUserFormData(form, selectedUser.id, selectedUser.full_name, selectedUser.email)}
                      >
                        View Data
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device Controls Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-600">Device Controls</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {deviceControlForms.map((form) => (
                    <div
                      key={form.title}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-green-50"
                    >
                      <h4 className="font-semibold mb-2">{form.title}</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        View and manage {form.title.toLowerCase()} settings
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleViewUserFormData(form, selectedUser.id, selectedUser.full_name, selectedUser.email)}
                      >
                        View Settings
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
          userEmail={viewingFormData.userEmail}
          endpoint={viewingFormData.endpoint}
          category={viewingFormData.category}
          fields={viewingFormData.fields}
        />
      )}
    </div>
  );
};

export default UserTable;