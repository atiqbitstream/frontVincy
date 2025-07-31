import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Go back one step in history
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-health-secondary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
        <p className="text-gray-500 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <Button onClick={goBack} className="bg-health-primary hover:bg-health-secondary">
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
