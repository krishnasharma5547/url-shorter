import React, { useState } from "react";
import Button from "./Button";

interface URLInputProps {
  title: string;
  placeholder: string;
  buttonText: string;
  onSubmit: (url: string) => void;
  className?: string;
}

const URLInput: React.FC<URLInputProps> = ({
  title,
  placeholder,
  buttonText,
  onSubmit,
  className = "",
}) => {
  const [url, setUrl] = useState("");

  const handleSubmit = () => {
    if (url.trim()) {
      onSubmit(url);
      setUrl("");
    }
  };

  return (
    <div className={`max-w-3xl mx-auto ${className}`}>
      <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="url"
            placeholder={placeholder}
            className="flex-grow p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button
            variant="primary"
            className="md:w-auto w-full"
            onClick={handleSubmit}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default URLInput;
