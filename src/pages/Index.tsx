
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-health-secondary">W.O.M.B</h1>
        <p className="text-xl text-gray-600">Wellness Optimal Mind Body</p>
        <div className="animate-spin mt-6 h-8 w-8 border-t-2 border-b-2 border-health-primary rounded-full mx-auto"></div>
      </div>
    </div>
  );
};

export default Index;
