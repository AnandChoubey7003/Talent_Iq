import axios from "axios";

// Helper to determine the API baseURL
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    // If user provided a full URL, ensure it ends with /api
    return envUrl.endsWith("/api") ? envUrl : `${envUrl.replace(/\/+$/, "")}/api`;
  }
  // In production (same-domain deployment like Sevalla), default to /api
  // In local development without env variable, default to http://localhost:3000/api
  return import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api";
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // sends cookies when available
});

// Request interceptor to automatically attach Clerk Bearer token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      if (typeof window !== "undefined" && window.Clerk?.session) {
        const token = await window.Clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      console.warn("Failed to get Clerk session token for request:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;


