import axios, { AxiosError } from "axios";

const BASE_URL = "https://api.link-shortener.com";

interface ShortenURLRequest {
  originalUrl: string;
  customAlias?: string;
  expireAfterDays?: number;
}

interface QRCodeRequest {
  url: string;
  foregroundColor: string;
  backgroundColor: string;
  width: number;
  height: number;
  logoSizePercent?: number;
  logoPadding?: number;
  logoBackGroundShape?: string;
  logoBackGroundColour?: string;
  logoUrl?: string | null;
}

interface ShortenURLResponse {
  shortUrl: string;
  originalUrl: string;
  expireAt: string;
}

interface QRCodeResponse {
  success: boolean;
  qrCodeUrl: string;
}

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;
    throw new Error(
      axiosError.response?.data?.message ||
        axiosError.message ||
        "An error occurred"
    );
  }
  throw error;
};

const api = {
  shortenURL: async (data: ShortenURLRequest): Promise<ShortenURLResponse> => {
    try {
      const response = await axios.post(`${BASE_URL}/url/shorten`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  generateQRCode: async (data: QRCodeRequest): Promise<QRCodeResponse> => {
    try {
      const response = await axios.post(`${BASE_URL}/dynamic/qr`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getQRCodeImage: async (data: QRCodeRequest): Promise<Blob> => {
    try {
      const response = await axios.post(`${BASE_URL}/qr/image`, data, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getAnalytics: async (shortUrl: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/analytics/${shortUrl}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default api;
