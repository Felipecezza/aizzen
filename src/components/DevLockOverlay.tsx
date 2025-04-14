import React from "react";
import { Lock } from "lucide-react";

interface DevLockOverlayProps {
  message?: string;
  className?: string;
}

const DevLockOverlay: React.FC<DevLockOverlayProps> = ({ 
  message = "Em desenvolvimento",
  className = ""
}) => {
  return (
    <div className={`absolute inset-0 bg-black/45 flex items-center justify-center z-20 rounded-lg ${className}`}>
      <div className="text-center space-y-3">
        <Lock className="h-14 w-14 text-primary mx-auto drop-shadow-lg" />
        <p className="text-white font-medium px-4">
          {message}
        </p>
      </div>
    </div>
  );
};

export default DevLockOverlay; 