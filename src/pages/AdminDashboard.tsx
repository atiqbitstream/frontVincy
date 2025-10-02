
import { useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import UserTable from "@/components/admin/UserTable";
import UserHubTable from "@/components/admin/UserHubTable";
import AboutEditor from "@/components/admin/AboutEditor";
import NewsManager from "@/components/admin/NewsManager";
import ContactEditor from "@/components/admin/ContactEditor";
import LiveSessionManager from "@/components/admin/LiveSessionManager";
import HubManager from "@/components/admin/HubManager";
import { useAuth } from "@/hooks/useAuth";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  
  // Function to render the active section
  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-health-secondary">Admin Dashboard</h2>
              <div className="flex gap-3">
                <button 
                  className="bg-health-primary text-white px-4 py-2 rounded-md hover:bg-health-secondary transition-colors"
                  onClick={() => setActiveSection("users")}
                >
                  View User Details
                </button>
                <button 
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                  onClick={() => setActiveSection("user-hub")}
                >
                  View Hub Info
                </button>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Welcome, Admin</h3>
              <p className="text-gray-700">
                This is your admin control panel. Use the navigation to manage users,
                content, and system settings.
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="font-medium text-blue-700">User Management</h4>
                  <p className="text-sm text-gray-600 mt-2">View and manage user accounts</p>
                </div>
                <div className="bg-green-50 p-4 rounded-md">
                  <h4 className="font-medium text-green-700">Content Management</h4>
                  <p className="text-sm text-gray-600 mt-2">Manage about us, news, and contact info</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-md">
                  <h4 className="font-medium text-purple-700">Live Sessions</h4>
                  <p className="text-sm text-gray-600 mt-2">Schedule and manage live sessions</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "users":
        return <UserTable />;
      case "user-hub":
        return <UserHubTable />;
      case "about":
        return <AboutEditor />;
      case "news":
        return <NewsManager />;
      case "contact":
        return <ContactEditor />;
      case "live-session":
        return <LiveSessionManager />;
      case "hub":
        return <HubManager />;
      default:
        return <div>Select a section from the navigation</div>;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <AdminNavbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="container mx-auto px-4 py-8">
        {renderSection()}
      </div>
    </div>
  );
};

export default AdminDashboard;
