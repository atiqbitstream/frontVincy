import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import DeviceCard from "@/components/DeviceCard";
import DataForm from "@/components/DataForm";
import HistoryModal from "@/components/HistoryModal";
import DataHistoryModal from "@/components/DataHistoryModal";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import {
  Volume2,
  Lightbulb,
  CloudFog,
  Award,
  Thermometer,
  Waves,
  Heart,
  Brain,
  Activity,
  Flame
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const API_URL = import.meta.env.VITE_API_URL;

interface DeviceState {
  [key: string]: any;
}

interface LatestValuesResponse {
  sound: DeviceState | null;
  steam: DeviceState | null;
  temp_tank: DeviceState | null;
  water_pump: DeviceState | null;
  nano_flicker: DeviceState | null;
  led_color: DeviceState | null;
}

const Dashboard = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  
  const [modalData, setModalData] = useState({ isOpen: false, title: "", endpoint: "" });
  const [dataHistoryModal, setDataHistoryModal] = useState({
    isOpen: false,
    title: "",
    endpoint: "",
    fields: [] as {name: string, label: string}[]
  });
  const [deviceStates, setDeviceStates] = useState<LatestValuesResponse>({
    sound: null,
    steam: null,
    temp_tank: null,
    water_pump: null,
    nano_flicker: null,
    led_color: null
  });
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);

  // Fetch all device states on mount and set up polling
  useEffect(() => {
    const fetchLatestDeviceStates = async () => {
      if (!user || !token) return;

      try {
        const response = await fetch(`${API_URL}/device-controls/latest`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          // Handle unauthorized
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch device states");
        }

        const data: LatestValuesResponse = await response.json();
        setDeviceStates(data);
      } catch (error) {
        console.error("Error loading device states:", error);
        // Only show toast error on initial load, not during polling
        if (isLoadingDevices) {
          toast.error("Failed to load device states");
        }
      } finally {
        setIsLoadingDevices(false);
      }
    };

    // Initial fetch
    fetchLatestDeviceStates();

    // Set up polling every 3 seconds
    const pollInterval = setInterval(() => {
      fetchLatestDeviceStates();
    }, 3000);

    // Cleanup interval on unmount
    return () => {
      clearInterval(pollInterval);
    };
  }, [user, token, isLoadingDevices]);

  const handleViewHistory = (title: string, endpoint: string) => {
    setModalData({
      isOpen: true,
      title,
      endpoint
    });
  };

  const handleViewDataHistory = (title: string, endpoint: string, fields: {name: string, label: string}[]) => {
    setDataHistoryModal({
      isOpen: true,
      title,
      endpoint,
      fields
    });
  };

  const closeModal = () => {
    setModalData({ isOpen: false, title: "", endpoint: "" });
  };

  const closeDataHistoryModal = () => {
    setDataHistoryModal({ isOpen: false, title: "", endpoint: "", fields: [] });
  };

  // Function to get initial state for a device
  const getDeviceInitialState = (deviceKey: string) => {
    const deviceData = deviceStates[deviceKey as keyof LatestValuesResponse];
    if (!deviceData) return null;
    
    // The value is stored under the same key as the device key
    // For example: sound device has value under "sound" key
    return deviceData[deviceKey];
  };

  // Device control definitions
  const deviceControls = [
    {
      title: "Sound System",
      description: "Control ambient sound therapy settings",
      icon: <Volume2 className="h-5 w-5" />,
      endpoint: "/sound",
      historyEndpoint: "/sound",
      deviceKey: "sound"
    },
    {
      title: "LED Light Therapy",
      description: "Adjust LED light color for therapy",
      icon: <Lightbulb className="h-5 w-5" />,
      endpoint: "/led-color",
      historyEndpoint: "/led-color",
      hasColorPicker: true,
      deviceKey: "led_color"
    },
    {
      title: "Steam Generator",
      description: "Manage steam output and duration",
      icon: <CloudFog className="h-5 w-5" />,
      endpoint: "/steam",
      historyEndpoint: "/steam",
      deviceKey: "steam"
    },
    {
      title: "Nanoflicker",
      description: "Control nanoflicker frequency and intensity",
      icon: <Award className="h-5 w-5" />,
      endpoint: "/nano-flicker",
      historyEndpoint: "/nano-flicker",
      deviceKey: "nano_flicker"
    },
    {
      title: "Temperature Tank",
      description: "Adjust temperature levels for therapy",
      icon: <Thermometer className="h-5 w-5" />,
      hasSlider: true,
      endpoint: "/temp-tank",
      historyEndpoint: "/temp-tank",
      deviceKey: "temp_tank"
    },
    {
      title: "Water Pump",
      description: "Control water circulation system",
      icon: <Waves className="h-5 w-5" />,
      endpoint: "/water-pump",
      historyEndpoint: "/water-pump",
      deviceKey: "water_pump"
    }
  ];

  // Data form definitions
  const dataForms = [
    {
      title: "Biofeedback",
      description: "Enter patient biofeedback measurements",
      endpoint: "/biofeedback",
      icon: <Heart className="h-5 w-5" />,
      fields: [
        { name: "heart_rate", label: "Heart Rate (BPM)" },
        { name: "heart_rate_variability", label: "Heart Rate Variability (ms)" },
        { name: "electromyography", label: "Electromyography (μV)" },
        { name: "electrodermal_activity", label: "Electrodermal Activity (μS)" },
        { name: "respiration_rate", label: "Respiration Rate (BPM)" },
        { name: "blood_pressure", label: "Blood Pressure (mmHg)" },
        { name: "temperature", label: "Body Temperature (°C)" },
        { name: "brainwave_activity", label: "Brainwave Activity (Hz)" },
        { name: "oxygen_saturation", label: "Oxygen Saturation (%)" },
        { name: "blood_glucose_levels", label: "Blood Glucose Levels (mg/dL)" },
        { name: "galvanic_skin_response", label: "Galvanic Skin Response (μS)" }
      ]
    },
    {
      title: "Burn Progress",
      description: "Document burn wound healing measurements",
      endpoint: "/burn-progress",
      icon: <Flame className="h-5 w-5" />,
      fields: [
        { name: "wound_size_depth", label: "Wound Depth (cm)" },
        { name: "epithelialization", label: "Epithelialization (%)" },
        { name: "exudate_amount_type", label: "Exudate Type (Score 0–5)" },
        { name: "infection_indicators", label: "Infection Indicators (Score 0–10)" },
        { name: "granulation_tissue", label: "Granulation Tissue (%)" },
        { name: "pain_levels", label: "Pain Levels (General Score 0–10)" },
        { name: "swelling", label: "Swelling (0–10)" },
        { name: "swelling_edema", label: "Swelling/Edema (0–10)" },
        { name: "scarring", label: "Scarring (Severity Score 0–10)" },
        { name: "functional_recovery", label: "Functional Recovery (%)" },
        { name: "color_changes", label: "Color Changes (Score 0–10)" },
        { name: "temperature_wound_site", label: "Wound Site Temperature (°C)" },
        { name: "blood_flow_perfusion", label: "Blood Flow/Perfusion (ml/min)" },
        { name: "nutritional_status", label: "Nutritional Status (Score 0–10)" },
        { name: "systemic_indicators", label: "Systemic Indicators (Score 0–10)" }
      ]
    },
    {
      title: "Brain Monitoring",
      description: "Record EEG and brain activity metrics",
      endpoint: "/brain-monitoring",
      icon: <Brain className="h-5 w-5" />,
      fields: [
        { name: "alpha_waves", label: "Alpha Waves (Hz)" },
        { name: "theta_waves", label: "Theta Waves (Hz)" },
        { name: "beta_waves", label: "Beta Waves (Hz)" },
        { name: "gamma_waves", label: "Gamma Waves (Hz)" },
        { name: "heart_rate", label: "Heart Rate (BPM)" },
        { name: "heart_rate_variability", label: "Heart Rate Variability (ms)" },
        { name: "electromyography", label: "Electromyography (μV)" },
        { name: "respiration_rate", label: "Respiration Rate (BPM)" },
        { name: "electrodermal_activity", label: "Electrodermal Activity (μS)" },
        { name: "peripheral_skin_temperature", label: "Peripheral Skin Temperature (°C)" }
      ]
    },
    {
      title: "Heart-Brain Synchronicity",
      description: "Measure heart and brain coherence data",
      endpoint: "/heart-brain-synchronicity",
      icon: <Activity className="h-5 w-5" />,
      fields: [
        { name: "heart_rate_variability", label: "Heart Rate Variability (ms)" },
        { name: "alpha_waves", label: "Alpha Waves (Hz)" },
        { name: "respiratory_sinus_arrhythmia", label: "RSA (ms)" },
        { name: "coherence_ratio", label: "Coherence Ratio" },
        { name: "brainwave_coherence", label: "Brainwave Coherence (%)" },
        { name: "blood_pressure_variability", label: "Blood Pressure Variability (mmHg)" },
        { name: "electrodermal_activity", label: "Electrodermal Activity (μS)" },
        { name: "breathing_patterns", label: "Breathing Patterns (Score or BPM)" },
        { name: "subjective_measures", label: "Subjective Measures (Self-Reported Score)" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-health-secondary">Health Monitoring Dashboard</h1>
          <p className="text-gray-600">Control devices and monitor patient data</p>
        </header>

        <section className="mb-12">
          <div className="flex items-center mb-6">
            <div className="bg-health-light p-2 rounded-md text-health-primary mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sliders"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/></svg>
            </div>
            <h2 className="text-xl font-semibold">Device Controls</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {deviceControls.map((device) => (
              <DeviceCard
                key={device.title}
                title={device.title}
                description={device.description}
                icon={device.icon}
                hasSlider={device.hasSlider}
                hasColorPicker={device.hasColorPicker}
                endpoint={device.endpoint}
                historyEndpoint={device.historyEndpoint}
                onViewHistory={handleViewHistory}
                initialState={getDeviceInitialState(device.deviceKey)}
                isLoadingInitial={isLoadingDevices}
              />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center mb-6">
            <div className="bg-health-light p-2 rounded-md text-health-primary mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-list"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
            </div>
            <h2 className="text-xl font-semibold">Health Data Forms</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {dataForms.map((form) => (
              <Card key={form.title} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-health-light p-2 rounded-full text-health-primary mr-3">
                      {form.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{form.title}</h3>
                      <p className="text-sm text-muted-foreground">{form.description}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => handleViewDataHistory(form.title, form.endpoint, form.fields)}
                      className="text-sm text-health-primary font-medium flex items-center hover:underline"
                    >
                      View History
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                    <button 
                      onClick={() => document.getElementById(`form-${form.title}`)?.scrollIntoView({ behavior: 'smooth' })}
                      className="bg-health-primary text-white px-3 py-1.5 rounded-md text-sm hover:bg-health-secondary transition-colors"
                    >
                      Submit New Data
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataForms.map((form) => (
              <div id={`form-${form.title}`} key={`form-${form.title}`}>
                <DataForm
                  title={form.title}
                  description={form.description}
                  fields={form.fields}
                  endpoint={form.endpoint}
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      <HistoryModal
        isOpen={modalData.isOpen}
        onClose={closeModal}
        title={modalData.title}
        endpoint={modalData.endpoint}
      />

      <DataHistoryModal
        isOpen={dataHistoryModal.isOpen}
        onClose={closeDataHistoryModal}
        title={dataHistoryModal.title}
        endpoint={dataHistoryModal.endpoint}
        fields={dataHistoryModal.fields}
      />
    </div>
  );
};

export default Dashboard;