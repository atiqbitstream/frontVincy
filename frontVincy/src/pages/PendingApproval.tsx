// src/pages/PendingApproval.tsx

import { useNavigate } from "react-router-dom";
import { Clock, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const PendingApproval = () => {
  const navigate = useNavigate();

  // Check if user actually has pending status
  useEffect(() => {
    const pendingStatus = sessionStorage.getItem("accountPending");
    if (!pendingStatus) {
      // If no pending status flag, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  const handleBackToLogin = () => {
    // Clear the pending status flag
    sessionStorage.removeItem("accountPending");
    sessionStorage.removeItem("pendingEmail");
    navigate("/login");
  };

  const pendingEmail = sessionStorage.getItem("pendingEmail") || "your email";

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-primary/10 to-health-secondary/10 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <Clock className="h-16 w-16" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Account Pending Approval</h1>
          <p className="text-white/90 text-lg">
            Your registration is under review
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-6">
          {/* Status Message */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 text-lg mb-2">
                  Almost There!
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  Thank you for signing up for the W.O.M.B Platform. Your account has been
                  successfully created, but it requires administrator approval before you can
                  log in and access our services.
                </p>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="bg-health-primary/10 p-2 rounded-lg mr-3">
                <Mail className="h-5 w-5 text-health-primary" />
              </span>
              What Happens Next?
            </h3>

            <div className="space-y-4 ml-14">
              <div className="flex items-start">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-health-primary/10 text-health-primary font-semibold mr-3 flex-shrink-0">
                  1
                </span>
                <div>
                  <h4 className="font-semibold text-gray-800">Administrator Review</h4>
                  <p className="text-gray-600 text-sm">
                    Our admin team has been notified and will review your registration shortly.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-health-primary/10 text-health-primary font-semibold mr-3 flex-shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-semibold text-gray-800">Email Notification</h4>
                  <p className="text-gray-600 text-sm">
                    You'll receive an email at <strong>{pendingEmail}</strong> once your account
                    is approved or if we need additional information.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-health-primary/10 text-health-primary font-semibold mr-3 flex-shrink-0">
                  3
                </span>
                <div>
                  <h4 className="font-semibold text-gray-800">Start Using Platform</h4>
                  <p className="text-gray-600 text-sm">
                    Once approved, you can log in and access all features including health
                    monitoring, live sessions, and wellness resources.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Typical Approval Time</h4>
                <p className="text-blue-800 text-sm leading-relaxed">
                  Most accounts are reviewed within <strong>24-48 hours</strong>. If you don't
                  hear from us within 2 business days, please contact support at{" "}
                  <a 
                    href="mailto:Info@soulresidue.net" 
                    className="underline hover:text-blue-600 font-medium"
                  >
                    Info@soulresidue.net
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-3">💡 In the Meantime</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-health-primary mr-2">•</span>
                <span>Check your spam/junk folder for our approval email</span>
              </li>
              <li className="flex items-start">
                <span className="text-health-primary mr-2">•</span>
                <span>Add Info@soulresidue.net to your contacts to ensure delivery</span>
              </li>
              <li className="flex items-start">
                <span className="text-health-primary mr-2">•</span>
                <span>Visit our website to learn more about our services</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleBackToLogin}
              className="flex-1 bg-health-primary hover:bg-health-secondary text-white py-6 text-lg"
            >
              Back to Login
            </Button>
            <Button
              onClick={() => window.location.href = "mailto:Info@soulresidue.net"}
              variant="outline"
              className="flex-1 py-6 text-lg border-2"
            >
              <Mail className="mr-2 h-5 w-5" />
              Contact Support
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center text-sm text-gray-600">
          <p>
            Need immediate assistance? Email us at{" "}
            <a 
              href="mailto:Info@soulresidue.net" 
              className="text-health-primary hover:underline font-medium"
            >
              Info@soulresidue.net
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
