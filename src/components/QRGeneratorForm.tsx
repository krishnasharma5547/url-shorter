import React, { useState } from "react";
import Button from "./Button";
import api from "../services/api";

interface QRGeneratorFormProps {
  onSubmit: (data: {
    url: string;
    foregroundColor: string;
    backgroundColor: string;
    size: string;
    logo?: File;
  }) => void;
  loading?: boolean;
  result?: {
    success: boolean;
    qrCodeUrl: string;
  } | null;
}

const QRGeneratorForm: React.FC<QRGeneratorFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    url: "",
    foregroundColor: "#000000",
    backgroundColor: "#FFFFFF",
    size: "200",
    logo: undefined as File | undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (formData.url.trim()) {
      try {
        setLoading(true);
        setError(null);

        const response = await api.generateQRCode({
          url: formData.url,
          foregroundColor: formData.foregroundColor,
          backgroundColor: formData.backgroundColor,
          width: parseInt(formData.size),
          height: parseInt(formData.size),
          logoSizePercent: 20,
          logoPadding: 0,
          logoBackGroundShape: "rounded_square",
          logoBackGroundColour: "#FFFFFF",
          logoUrl: null,
        });

        setQrCodeUrl(response.qrCodeUrl);
        onSubmit(formData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate QR code"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, logo: file });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-gradient-text bg-clip-text">
        Generate QR Code
      </h2>
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-xl space-y-4 border border-gray-100">
        <div className="space-y-2">
          <label
            htmlFor="qr-url"
            className="block text-sm font-medium text-gray-700"
          >
            URL for QR Code
          </label>
          <input
            id="qr-url"
            type="url"
            placeholder="Enter URL for QR code..."
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="fg-color"
              className="block text-sm font-medium text-gray-700"
            >
              Foreground Color
            </label>
            <input
              id="fg-color"
              type="color"
              className="w-full p-1 h-10 border rounded-md"
              value={formData.foregroundColor}
              onChange={(e) =>
                setFormData({ ...formData, foregroundColor: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="bg-color"
              className="block text-sm font-medium text-gray-700"
            >
              Background Color
            </label>
            <input
              id="bg-color"
              type="color"
              className="w-full p-1 h-10 border rounded-md"
              value={formData.backgroundColor}
              onChange={(e) =>
                setFormData({ ...formData, backgroundColor: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="size"
            className="block text-sm font-medium text-gray-700"
          >
            QR Code Size (px)
          </label>
          <input
            id="size"
            type="range"
            min="100"
            max="500"
            step="50"
            className="w-full"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
          />
          <div className="text-center text-sm text-gray-600">
            {formData.size}px
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="logo"
            className="block text-sm font-medium text-gray-700"
          >
            Logo (Optional)
          </label>
          <input
            id="logo"
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded-md"
            onChange={handleLogoChange}
          />
        </div>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        {qrCodeUrl && (
          <div className="mt-4 flex justify-center">
            <img
              src={qrCodeUrl}
              alt="Generated QR Code"
              className="w-48 h-48 border rounded-lg shadow-sm"
            />
          </div>
        )}

        <Button
          variant="primary"
          className="w-full mt-4"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate QR"}
        </Button>
      </div>
    </div>
  );
};

export default QRGeneratorForm;
