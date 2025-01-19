import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const baseStyles =
    "fixed top-4 right-4 z-50 rounded-lg shadow-lg p-4 transition-all duration-500 transform";
  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]} animate-fade-in`}>
      <div className="flex items-center">
        <span className="mr-2">{type === "success" ? "✓" : "✕"}</span>
        {message}
        <button
          onClick={onDismiss}
          className="ml-4 text-white/80 hover:text-white"
        >
          <span className="sr-only">Dismiss</span>
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
