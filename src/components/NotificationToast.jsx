import React, { useState, useEffect } from "react";

export default function NotificationToast({ message, type = "info", duration = 5000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onClose?.(), 300); // Allow fade out animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  const typeStyles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800"
  };

  const iconStyles = {
    success: "text-green-400",
    error: "text-red-400", 
    warning: "text-yellow-400",
    info: "text-blue-400"
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ"
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
      <div className={`rounded-lg border p-4 shadow-lg ${typeStyles[type]}`}>
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${iconStyles[type]} mr-3 text-lg font-bold`}>
            {icons[type]}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(() => onClose?.(), 300);
            }}
            className="flex-shrink-0 ml-3 text-lg leading-none hover:opacity-70"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

