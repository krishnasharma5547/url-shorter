import React, { useState } from "react";
import Button from "./Button";
import api from "../services/api";

interface URLShortenerFormProps {
  onSubmit: (data: {
    url: string;
    customAlias?: string;
    expiryDate?: string;
  }) => void;
  loading?: boolean;
  result?: {
    shortUrl: string;
    originalUrl: string;
    expireAt: string;
  } | null;
}

const URLShortenerForm: React.FC<URLShortenerFormProps> = ({ onSubmit, loading, result }) => {
  const [formData, setFormData] = useState({
    url: "",
    customAlias: "",
    expiryDate: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (formData.url.trim()) {
      try {
        setError(null);

        const response = await api.shortenURL({
          originalUrl: formData.url,
          customAlias: formData.customAlias || undefined,
          expireAfterDays: formData.expiryDate
            ? calculateDays(formData.expiryDate)
            : undefined,
        });

        onSubmit(formData);
        setFormData({ url: "", customAlias: "", expiryDate: "" });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to shorten URL");
      }
    }
  };

  const calculateDays = (expiryDate: string): number => {
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-gradient-text bg-clip-text">
        Shorten Your URL
      </h2>
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-xl space-y-4 border border-gray-100">
        <div className="space-y-2">
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700"
          >
            Long URL
          </label>
          <input
            id="url"
            type="url"
            placeholder="Paste your long URL here..."
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="alias"
            className="block text-sm font-medium text-gray-700"
          >
            Custom Alias (Optional)
          </label>
          <input
            id="alias"
            type="text"
            placeholder="Enter custom alias"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.customAlias}
            onChange={(e) =>
              setFormData({ ...formData, customAlias: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="expiry"
            className="block text-sm font-medium text-gray-700"
          >
            Expiry Date (Optional)
          </label>
          <input
            id="expiry"
            type="date"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.expiryDate}
            onChange={(e) =>
              setFormData({ ...formData, expiryDate: e.target.value })
            }
          />
        </div>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        {result && (
          <div className="mt-4 p-4 bg-green-50 rounded-md">
            <p className="text-green-700 font-medium">
              URL Shortened Successfully!
            </p>
            <a
              href={result.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {result.shortUrl}
            </a>
          </div>
        )}

        <Button
          variant="primary"
          className="w-full mt-4"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Shortening..." : "Shorten It!"}
        </Button>
      </div>
    </div>
  );
};

export default URLShortenerForm;
