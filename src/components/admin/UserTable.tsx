
import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import UserDataHistory from "./UserDataHistory";

// Enhanced mock user data with status field
const mockUsers = [
  {
    id: "1",
    fullName: "John Doe",
    email: "john@example.com",
    country: "United States",
    occupation: "Doctor",
    status: true, // active
    gender: "Male",
    dob: "1985-05-15",
    nationality: "American",
    phone: "+1 555-123-4567",
    city: "New York",
    marital_status: "Married",
    sleep_hours: "7",
    exercise_frequency: "3 times/week",
    smoking_status: "Non-smoker",
    alcohol_consumption: "Occasional"
  },
  {
    id: "2",
    fullName: "Jane Smith",
    email: "jane@example.com",
    country: "Canada",
    occupation: "Nurse",
    status: true,
    gender: "Female",
    dob: "1990-08-22",
    nationality: "Canadian",
    phone: "+1 555-987-6543",
    city: "Toronto",
    marital_status: "Single",
    sleep_hours: "8",
    exercise_frequency: "Daily",
    smoking_status: "Non-smoker",
    alcohol_consumption: "Rare"
  },
  {
    id: "3",
    fullName: "Alice Johnson",
    email: "alice@example.com",
    country: "Australia",
    occupation: "Therapist",
    status: false, // inactive
    gender: "Female",
    dob: "1988-03-10",
    nationality: "Australian",
    phone: "+61 4XX XXX XXX",
    city: "Sydney",
    marital_status: "Divorced",
    sleep_hours: "6",
    exercise_frequency: "2 times/week",
    smoking_status: "Former smoker",
    alcohol_consumption: "Moderate"
  },
  {
    id: "4",
    fullName: "Robert Brown",
    email: "robert@example.com",
    country: "United Kingdom",
    occupation: "Researcher",
    status: true,
    gender: "Male",
    dob: "1975-11-30",
    nationality: "British",
    phone: "+44 20 XXXX XXXX",
    city: "London",
    marital_status: "Married",
    sleep_hours: "7",
    exercise_frequency: "Weekly",
    smoking_status: "Smoker",
    alcohol_consumption: "Frequent"
  },
  {
    id: "5",
    fullName: "Emily Davis",
    email: "emily@example.com",
    country: "Germany",
    occupation: "Physician",
    status: true,
    gender: "Female",
    dob: "1992-07-18",
    nationality: "German",
    phone: "+49 30 XXXXXXXX",
    city: "Berlin",
    marital_status: "Single",
    sleep_hours: "8",
    exercise_frequency: "4 times/week",
    smoking_status: "Non-smoker",
    alcohol_consumption: "Occasional"
  }
];

const UserTable = () => {
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [viewingDevice, setViewingDevice] = useState<{ name: string, endpoint: string } | null>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [viewingFormData, setViewingFormData] = useState<{ formType: string, userId: string, userName: string } | null>(null);

  // Device controls definitions
  const deviceControls = [
    {
      title: "Sound System",
      endpoint: "/sound-history",
      status: Math.random() > 0.5
    },
    {
      title: "LED Light Therapy",
      endpoint: "/led-history",
      color: ["red", "green", "blue", "purple", "yellow"][Math.floor(Math.random() * 5)]
    },
    {
      title: "Steam Generator",
      endpoint: "/steam-history",
      status: Math.random() > 0.5
    },
    {
      title: "Nanoflicker",
      endpoint: "/nanoflicker-history",
      status: Math.random() > 0.5
    },
    {
      title: "Temperature Tank",
      endpoint: "/temperature-tank-history",
      temperature: Math.floor(Math.random() * 30) + 60
    },
    {
      title: "Water Pump",
      endpoint: "/water-pump-history",
      status: Math.random() > 0.5
    }
  ];

  // Data forms definitions
  const dataForms = [
    {
      title: "Biofeedback",
      endpoint: "/biofeedback",
      fields: [
        { name: "heart_rate", label: "Heart Rate (BPM)" },
        { name: "heart_rate_variability", label: "Heart Rate Variability (ms)" },
        { name: "electromyography", label: "Electromyography (μV)" },
        { name: "electrodermal_activity", label: "Electrodermal Activity (μS)" },
        { name: "respiration_rate", label: "Respiration Rate (BPM)" }
      ]
    },
    {
      title: "Burn Progress",
      endpoint: "/burn-progress",
      fields: [
        { name: "wound_size", label: "Wound Size (cm²)" },
        { name: "epithelialization", label: "Epithelialization (%)" },
        { name: "exudate_amount", label: "Exudate Amount (ml)" },
        { name: "pain_level", label: "Pain Level (0-10)" },
        { name: "swelling", label: "Swelling (0-10)" }
      ]
    },
    {
      title: "Brain Monitoring",
      endpoint: "/brain-monitoring",
      fields: [
        { name: "alpha_waves", label: "Alpha Waves (Hz)" },
        { name: "theta_waves", label: "Theta Waves (Hz)" },
        { name: "beta_waves", label: "Beta Waves (Hz)" },
        { name: "gamma_waves", label: "Gamma Waves (Hz)" },
        { name: "heart_rate", label: "Heart Rate (BPM)" }
      ]
    },
    {
      title: "Heart-Brain Synchronicity",
      endpoint: "/heart-brain-synchronicity",
      fields: [
        { name: "heart_rate_variability", label: "Heart Rate Variability (ms)" },
        { name: "alpha_waves", label: "Alpha Waves (Hz)" },
        { name: "respiratory_sinus_arrhythmia", label: "RSA (ms)" },
        { name: "coherence_ratio", label: "Coherence Ratio" },
        { name: "brainwave_coherence", label: "Brainwave Coherence (%)" }
      ]
    }
  ];

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
  };

  const handleCloseUserModal = () => {
    setSelectedUser(null);
  };

  const handleViewDeviceHistory = (device: { title: string, endpoint: string }) => {
    setViewingDevice({
      name: device.title,
      endpoint: device.endpoint
    });
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
  };

  const handleCloseEditModal = () => {
    setEditingUser(null);
  };

  const handleUpdateUserStatus = (userId: string, newStatus: boolean) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    
    toast.success(`User status ${newStatus ? 'activated' : 'deactivated'}`);
  };

  const handleSaveUserEdit = (updatedUser: any) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? { ...user, ...updatedUser } : user
    ));
    setEditingUser(null);
    toast.success("User details updated successfully");
  };

  const handleViewUserFormData = (formType: string, userId: string, userName: string) => {
    setViewingFormData({
      formType,
      userId,
      userName
    });
  };

  const handleToggleDeviceStatus = (deviceTitle: string, status: boolean) => {
    toast.success(`${deviceTitle} set to ${status ? 'ON' : 'OFF'} for ${selectedUser?.fullName}`);
  };

  const handleChangeDeviceColor = (deviceTitle: string, color: string) => {
    toast.success(`${deviceTitle} color set to ${color} for ${selectedUser?.fullName}`);
  };

  const handleSetDeviceTemperature = (deviceTitle: string, temperature: string) => {
    toast.success(`${deviceTitle} temperature set to ${temperature}°F for ${selectedUser?.fullName}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-health-secondary mb-4">User Management</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
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
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={user.status} 
                        onCheckedChange={(checked) => handleUpdateUserStatus(user.id, checked)}
                      />
                      <span className={user.status ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                        {user.status ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewUser(user)}
                        className="p-0 h-8 w-8 rounded-full"
                        title="View user devices"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        className="p-0 h-8 w-8 rounded-full"
                        title="Edit user details"
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
      </div>

      {/* User Details Modal */}
      <Dialog open={!!selectedUser} onOpenChange={handleCloseUserModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details: {selectedUser?.fullName}</DialogTitle>
          </DialogHeader>

          {/* Tabs for Devices and Forms */}
          <div className="flex border-b mb-4">
            <button 
              className="py-2 px-4 border-b-2 border-health-primary text-health-primary font-medium"
            >
              Devices
            </button>
            <button 
              className="py-2 px-4 hover:text-health-primary"
              onClick={() => setSelectedUser({...selectedUser, viewingForms: true})}
            >
              Health Forms
            </button>
          </div>

          {selectedUser && !selectedUser.viewingForms ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deviceControls.map((device, index) => (
                  <div key={device.title} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{device.title}</h3>
                    </div>
                    
                    {device.title === "LED Light Therapy" ? (
                      <div className="mb-4">
                        <div className="text-sm text-foreground/70 mb-2">Current Color: <span className="font-medium">{device.color}</span></div>
                        <div className="flex gap-2 mb-4">
                          {["red", "green", "blue", "purple", "yellow", "white"].map(color => (
                            <button
                              key={color}
                              className={`w-6 h-6 rounded-full ${color === 'white' ? 'bg-gray-100 border' : `bg-${color}-500`}`}
                              style={{ 
                                backgroundColor: color === 'white' ? 'white' : color,
                                border: color === 'white' ? '1px solid #ddd' : 'none'
                              }}
                              onClick={() => handleChangeDeviceColor(device.title, color)}
                              aria-label={`Set color to ${color}`}
                            />
                          ))}
                        </div>
                      </div>
                    ) : device.title === "Temperature Tank" ? (
                      <div className="mb-4">
                        <div className="text-sm text-foreground/70 mb-2">Current Temperature: <span className="font-medium">{device.temperature}°F</span></div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            defaultValue={device.temperature}
                            className="w-20 px-2 py-1 border rounded"
                            min="60"
                            max="100"
                            onChange={(e) => handleSetDeviceTemperature(device.title, e.target.value)}
                          />
                          <span className="text-sm">°F</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground/70">Status</span>
                          <div className="flex items-center">
                            <span className="text-xs mr-2 text-foreground/70">
                              {device.status ? "ON" : "OFF"}
                            </span>
                            <Switch 
                              checked={device.status} 
                              onCheckedChange={(checked) => handleToggleDeviceStatus(device.title, checked)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewDeviceHistory(device)}
                      >
                        View History
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dataForms.map(form => (
                  <div key={form.title} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{form.title}</h3>
                    </div>
                    <p className="text-sm text-foreground/70 mb-4">View or manage user's {form.title.toLowerCase()} data</p>
                    <div className="flex justify-end">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewUserFormData(form.title, selectedUser.id, selectedUser.fullName)}
                      >
                        View Form Data
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Device History Modal */}
      {viewingDevice && selectedUser && (
        <UserDeviceHistory
          isOpen={!!viewingDevice}
          onClose={() => setViewingDevice(null)}
          title={viewingDevice.name}
          endpoint={viewingDevice.endpoint}
          userId={selectedUser.id}
          userName={selectedUser.fullName}
        />
      )}

      {/* User Edit Modal */}
      {editingUser && (
        <UserEditForm
          user={editingUser}
          onSave={handleSaveUserEdit}
          onCancel={handleCloseEditModal}
        />
      )}

      {/* User Form Data Modal */}
      {viewingFormData && (
        <UserDataHistory
          isOpen={!!viewingFormData}
          onClose={() => setViewingFormData(null)}
          title={viewingFormData.formType}
          userId={viewingFormData.userId}
          userName={viewingFormData.userName}
          fields={dataForms.find(form => form.title === viewingFormData.formType)?.fields || []}
        />
      )}
    </div>
  );
};

export default UserTable;
