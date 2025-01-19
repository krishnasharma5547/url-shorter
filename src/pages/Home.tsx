import React, { useState } from "react";
import Button from "../components/Button";
import URLShortenerForm from "../components/URLShortenerForm";
import QRGeneratorForm from "../components/QRGeneratorForm";
import api from "../services/api";
import LinkIcon from "../assets/LinkIcon";
import QRIcon from "../assets/QRIcon";
import Modal from "../components/Modal";
import Toast from "../components/Toast";

interface ShortenedURL {
  shortUrl: string;
  originalUrl: string;
  expireAt: string;
}

interface QRCodeResponse {
  success: boolean;
  data: string; // This is a base64 image string
}

const Home: React.FC = () => {
  const [shortenedURL, setShortenedURL] = useState<ShortenedURL | null>(null);
  const [qrCode, setQRCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    shortening: false,
    generating: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleURLShorten = async (data: {
    url: string;
    customAlias?: string;
    expiryDate?: string;
  }) => {
    try {
      setLoading((prev) => ({ ...prev, shortening: true }));
      setError(null);

      const response = await api.shortenURL({
        originalUrl: data.url,
        customAlias: data.customAlias || undefined,
        expireAfterDays: data.expiryDate
          ? calculateDays(data.expiryDate)
          : undefined,
      });

      setShortenedURL(response.data);
      setToast({
        message: "URL shortened successfully!",
        type: "success",
      });
      setIsModalOpen(true);
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to shorten URL",
        type: "error",
      });
    } finally {
      setLoading((prev) => ({ ...prev, shortening: false }));
    }
  };

  const handleQRGenerate = async (data: {
    url: string;
    foregroundColor: string;
    backgroundColor: string;
    size: string;
    logo?: File;
  }) => {
    try {
      setLoading((prev) => ({ ...prev, generating: true }));
      setError(null);

      const response = await api.generateQRCode({
        url: data.url,
        foregroundColor: data.foregroundColor,
        backgroundColor: data.backgroundColor,
        width: parseInt(data.size),
        height: parseInt(data.size),
        logoSizePercent: 20,
        logoPadding: 0,
        logoBackGroundShape: "rounded_square",
        logoBackGroundColour: "#FFFFFF",
        logoUrl: null,
      });

      setQRCode(response.data);
      setToast({
        message: "QR code generated successfully!",
        type: "success",
      });
      setIsModalOpen(true);
    } catch (err) {
      setToast({
        message:
          err instanceof Error ? err.message : "Failed to generate QR code",
        type: "error",
      });
      setQRCode(null);
    } finally {
      setLoading((prev) => ({ ...prev, generating: false }));
    }
  };

  const calculateDays = (expiryDate: string): number => {
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({
        message: "URL copied to clipboard!",
        type: "success",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: unknown) {
      setToast({
        message: "Failed to copy URL",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-page">
      {/* Hero Section */}
      <div className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-text bg-clip-text mb-6">
              Transform Your Links
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Shorten URLs & Generate Custom QR Codes Instantly
            </p>
            <div className="flex justify-center space-x-6">
              <Button
                variant="primary"
                onClick={() => scrollToSection("url-shortener")}
                className="bg-gradient-primary hover:opacity-90 transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center">
                  <LinkIcon className="w-6 h-6 mr-2" color="#ffffff" /> Shorten
                  URL
                </span>
              </Button>
              <Button
                variant="secondary"
                onClick={() => scrollToSection("qr-generator")}
                className="bg-gradient-secondary text-white hover:opacity-90 transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center">
                  <QRIcon className="w-6 h-6 mr-2" color="#ffffff" /> Generate
                  QR
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 text-red-600 p-4 rounded-md shadow-sm">
            {error}
          </div>
        </div>
      )}

      {/* URL Shortener Section */}
      <div id="url-shortener" className="py-16 backdrop-blur-sm bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <URLShortenerForm
            onSubmit={handleURLShorten}
            loading={loading.shortening}
          />
        </div>
      </div>

      {/* QR Generator Section */}
      <div id="qr-generator" className="py-16 backdrop-blur-sm bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <QRGeneratorForm
            onSubmit={handleQRGenerate}
            loading={loading.generating}
          />
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}

      {shortenedURL && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="URL Shortened Successfully!"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <span className="text-gray-600 break-all mr-2">
                {shortenedURL.shortUrl}
              </span>
              <Button
                variant="secondary"
                onClick={() => copyToClipboard(shortenedURL.shortUrl)}
                className="shrink-0"
              >
                Copy
              </Button>
            </div>
            {shortenedURL.expireAt && (
              <div className="text-sm text-gray-500">
                Expires: {new Date(shortenedURL.expireAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </Modal>
      )}

      {qrCode && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="QR Code Generated Successfully!"
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src={`data:image/png;base64,${qrCode}`}
                alt="Generated QR Code"
                className="w-64 h-64 border rounded-lg shadow-sm"
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                const link = document.createElement("a");
                link.href = `data:image/png;base64,${qrCode}`;
                link.download = "qr-code.png";
                link.click();
              }}
              className="w-full"
            >
              Download QR Code
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Home;
