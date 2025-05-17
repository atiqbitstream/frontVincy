// src/components/DataForm.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

interface Field {
  name: string;
  label: string;
}

interface DataFormProps {
  title: string;
  description: string;
  fields: Field[];
  endpoint: string;    // e.g. "/biofeedback", "/burn-progress", etc.
}

const DataForm = ({ title, description, fields, endpoint }: DataFormProps) => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !token) {
      toast.error("Please log in first.");
      return;
    }

    // ensure no empty fields
    const missing = Object.entries(formData)
      .filter(([, v]) => v.trim() === "")
      .map(([k]) => k);
    if (missing.length) {
      toast.error("Fill in all fields before submitting.");
      return;
    }

    setLoading(true);
    try {
      // build JSON payload, casting to numbers
      const payload: Record<string, any> = {};
      for (const [key, val] of Object.entries(formData)) {
        payload[key] = parseFloat(val);
      }
      payload.user_email = user.email;
      payload.created_by = user.email;

      const res = await fetch(
        `${API_URL}/health-monitoring${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Submission failed");
      }

      toast.success(`${title} submitted successfully.`);
      // reset form
      setFormData(fields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {}));
    } catch (error: any) {
      console.error(`Error submitting ${title}:`, error);
      toast.error(error.message || `Failed to submit ${title}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-health-secondary mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="grid grid-cols-1 gap-4 mb-6 flex-1">
          {fields.map((field) => (
            <div key={field.name} className="space-y-1">
              <Label htmlFor={field.name} className="health-label">
                {field.label}
              </Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                placeholder="0.00"
                value={formData[field.name]}
                onChange={handleInputChange}
                className="health-input"
                disabled={loading}
              />
            </div>
          ))}
        </div>

        <Button
          type="submit"
          className="w-full bg-health-primary hover:bg-health-secondary"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
              Submitting...
            </div>
          ) : (
            "Submit Data"
          )}
        </Button>
      </form>
    </div>
  );
};

export default DataForm;
