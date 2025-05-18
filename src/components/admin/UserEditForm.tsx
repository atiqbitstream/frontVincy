// src/components/admin/UserEditForm.tsx

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";

interface UserEditFormProps {
  user: any;
  onSave: (updated: any) => void;
  onCancel: () => void;
}

const UserEditForm = ({ user, onSave, onCancel }: UserEditFormProps) => {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    id: user.id,
    fullName:          user.fullName || "",
    email:             user.email || "",
    password:          "",                // leave blank if unchanged
    gender:            user.gender || "",
    dob:               user.dob || "",
    nationality:       user.nationality || "",
    phone:             user.phone || "",
    city:              user.city || "",
    country:           user.country || "",
    occupation:        user.occupation || "",
    marital_status:    user.marital_status || "",
    sleep_hours:       user.sleep_hours || "",
    exercise_frequency:user.exercise_frequency || "",
    smoking_status:    user.smoking_status || "",
    alcohol_consumption: user.alcohol_consumption || "",
    status:            (user.status as "Active" | "Inactive" | "Pending") || "Active",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // validation (keep as is)
  if (!formData.fullName || !formData.email) {
    toast.error("Name and email are required.");
    return;
  }
  if (formData.password && formData.password.length < 6) {
    toast.error("Password must be at least 6 characters.");
    return;
  }

  // Build payload; convert status -> user_status, and add updated_by (from admin email)
  const payload: Record<string, any> = { ...formData };

  // Remap status to user_status
  if ("status" in payload) {
    payload.user_status = payload.status;
    delete payload.status;
  }

  // Remove id from payload if present
  delete payload.id;

  // Add updated_by from admin (current user)
  payload.updated_by = user.updated_by || "admin@example.com"; // fallback, or get from context

  // Optional: Remove password if empty
  if (!payload.password) delete payload.password;

  try {
    const res = await fetch(`${API_URL}/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    const updated = await res.json();
    onSave(updated);
    toast.success("User updated successfully");
  } catch (err: any) {
    console.error("Update failed:", err);
    toast.error(err.message || "Failed to update user.");
  }
};


  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User: {user.fullName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
              />
              <p className="text-sm text-gray-500">
                Leave blank to keep existing password
              </p>
            </div>
            {/* Gender */}
            <div className="space-y-1">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(v) => handleSelectChange("gender", v)}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Date of Birth */}
            <div className="space-y-1">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
              />
            </div>
            {/* Nationality */}
            <div className="space-y-1">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
              />
            </div>
            {/* Phone */}
            <div className="space-y-1">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            {/* City */}
            <div className="space-y-1">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            {/* Country */}
            <div className="space-y-1">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              />
            </div>
            {/* Occupation */}
            <div className="space-y-1">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
              />
            </div>
            {/* Marital Status */}
            <div className="space-y-1">
              <Label htmlFor="marital_status">Marital Status</Label>
              <Input
                id="marital_status"
                name="marital_status"
                value={formData.marital_status}
                onChange={handleInputChange}
              />
            </div>
            {/* Sleep Hours */}
            <div className="space-y-1">
              <Label htmlFor="sleep_hours">Sleep Hours</Label>
              <Input
                id="sleep_hours"
                name="sleep_hours"
                value={formData.sleep_hours}
                onChange={handleInputChange}
              />
            </div>
            {/* Exercise Frequency */}
            <div className="space-y-1">
              <Label htmlFor="exercise_frequency">Exercise Frequency</Label>
              <Input
                id="exercise_frequency"
                name="exercise_frequency"
                value={formData.exercise_frequency}
                onChange={handleInputChange}
              />
            </div>
            {/* Smoking Status */}
            <div className="space-y-1">
              <Label htmlFor="smoking_status">Smoking Status</Label>
              <Input
                id="smoking_status"
                name="smoking_status"
                value={formData.smoking_status}
                onChange={handleInputChange}
              />
            </div>
            {/* Alcohol Consumption */}
            <div className="space-y-1">
              <Label htmlFor="alcohol_consumption">Alcohol Consumption</Label>
              <Input
                id="alcohol_consumption"
                name="alcohol_consumption"
                value={formData.alcohol_consumption}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Status Select */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(v) => handleSelectChange("status", v)}
            >
              <SelectTrigger id="status" className="w-[120px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditForm;
