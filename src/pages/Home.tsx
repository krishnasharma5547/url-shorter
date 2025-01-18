import React, { useState } from "react";
import Button from "../components/Button";
import URLShortenerForm from "../components/URLShortenerForm";
import QRGeneratorForm from "../components/QRGeneratorForm";
import api from "../services/api";
import LinkIcon from "../assets/LinkIcon";
import QRIcon from "../assets/QRIcon";

interface ShortenedURL {
  shortUrl: string;
  originalUrl: string;
  expireAt: string;
}

interface QRCodeResult {
  success: boolean;
  qrCodeUrl: string;
}

const Home: React.FC = () => {
  const [shortenedURL, setShortenedURL] = useState<ShortenedURL | null>(null);
  const [qrCode, setQRCode] = useState<QRCodeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    shortening: false,
    generating: false,
  });

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

      setShortenedURL(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to shorten URL");
      setShortenedURL(null);
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
        logoUrl: null, // Handle logo upload if needed
      });

      setQRCode(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate QR code"
      );
      setQRCode(null);
    } finally {
      setLoading((prev) => ({ ...prev, generating: false }));
    }
  };

  const calculateDays = (expiryDate: string): number => {
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
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
            result={shortenedURL}
          />
        </div>
      </div>

      {/* QR Generator Section */}
      <div id="qr-generator" className="py-16 backdrop-blur-sm bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <QRGeneratorForm
            onSubmit={handleQRGenerate}
            loading={loading.generating}
            result={qrCode}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
