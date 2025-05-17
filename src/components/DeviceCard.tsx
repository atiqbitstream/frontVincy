// src/components/DeviceCard.tsx

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "../hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

interface DeviceCardProps {
  title: string;
  description: string;
  icon: JSX.Element;
  hasSlider?: boolean;
  hasColorPicker?: boolean;
  endpoint: string;
  historyEndpoint: string;
  onViewHistory: (title: string, endpoint: string) => void;
}

const DeviceCard = ({
  title,
  description,
  icon,
  hasSlider = false,
  hasColorPicker = false,
  endpoint,
  historyEndpoint,
  onViewHistory,
}: DeviceCardProps) => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [isOn, setIsOn] = useState(false);
  const [temperature, setTemperature] = useState("72");
  const [selectedColor, setSelectedColor] = useState("red");
  const [isLoading, setIsLoading] = useState(false);

  // Derive the JSON field key (snake_case, no leading slash):
  const bodyKey = endpoint.slice(1).replace(/-/g, "_");

  // Fetch current state on mount
  useEffect(() => {
    if (!user || !token) return;
    const fetchState = async () => {
      try {
        const res = await fetch(
          `${API_URL}/device-controls${endpoint}/user/${user.email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch device state");
        const data = await res.json();
        // Figure out which field holds our value
        const fieldKey = Object.keys(data).find(
          (k) => k !== "id" && k !== "user_email"
        );
        if (fieldKey) {
          const value = data[fieldKey];
          if (typeof value === "boolean") setIsOn(value);
          else if (typeof value === "number") setTemperature(String(value));
          else if (typeof value === "string") setSelectedColor(value);
        }
      } catch (error) {
        console.error(`Error loading ${title} state:`, error);
      }
    };
    fetchState();
  }, [endpoint, token, user, title]);

  // Toggle handler
  const handleToggle = async (checked: boolean) => {
    setIsLoading(true);
    try {
      await fetch(`${API_URL}/device-controls${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          [bodyKey]: checked,
          user_email: user?.email,
          created_by: user?.email,
        }),
      });
      setIsOn(checked);
      toast.success(`${title} turned ${checked ? "ON" : "OFF"}`);
    } catch (error) {
      console.error(`Failed to toggle ${title}:`, error);
      toast.error(`Failed to toggle ${title}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Slider (temperature) handlers
  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || /^\d+$/.test(val)) {
      setTemperature(val);
    }
  };

  const handleTemperatureSubmit = async () => {
    setIsLoading(true);
    try {
      await fetch(`${API_URL}/device-controls${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          [bodyKey]: Number(temperature),
          user_email: user?.email,
          created_by: user?.email,
        }),
      });
      toast.success(`${title} temperature set to ${temperature}°F`);
    } catch (error) {
      console.error(`Failed to set ${title} temperature:`, error);
      toast.error(`Failed to set ${title} temperature`);
    } finally {
      setIsLoading(false);
    }
  };

  // Color-picker handler
  const handleColorChange = async (value: string) => {
    setIsLoading(true);
    try {
      await fetch(`${API_URL}/device-controls${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          [bodyKey]: value,
          user_email: user?.email,
          created_by: user?.email,
        }),
      });
      setSelectedColor(value);
      toast.success(`${title} color set to ${value}`);
    } catch (error) {
      console.error(`Failed to set ${title} color:`, error);
      toast.error(`Failed to set ${title} color`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewHistory = () => {
    onViewHistory(title, historyEndpoint);
  };

  return (
    <div className="device-card">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <div className="mr-3 text-health-primary">{icon}</div>
          <h3 className="font-medium">{title}</h3>
        </div>

        {!hasSlider && !hasColorPicker && (
          <div className="flex items-center">
            <span className="text-xs mr-2 text-foreground/70">
              {isOn ? "ON" : "OFF"}
            </span>
            <Switch
              checked={isOn}
              onCheckedChange={handleToggle}
              disabled={isLoading}
            />
          </div>
        )}
      </div>

      <p className="text-sm text-foreground/70 mb-4">{description}</p>

      {hasSlider && (
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={temperature}
              onChange={handleTemperatureChange}
              className="w-20 text-right"
              disabled={isLoading}
              aria-label="Temperature"
            />
            <span className="text-foreground/70">°F</span>
            <Button
              size="sm"
              onClick={handleTemperatureSubmit}
              disabled={isLoading}
            >
              Set
            </Button>
          </div>
        </div>
      )}

      {hasColorPicker && (
        <div className="mb-4">
          <Select
            value={selectedColor}
            onValueChange={handleColorChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="red">Red</SelectItem>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="purple">Purple</SelectItem>
              <SelectItem value="yellow">Yellow</SelectItem>
              <SelectItem value="white">White</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewHistory}
          disabled={isLoading}
        >
          View History
        </Button>
      </div>
    </div>
  );
};

export default DeviceCard;
