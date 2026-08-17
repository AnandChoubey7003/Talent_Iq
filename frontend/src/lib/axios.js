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
  withCredentials: true, // by adding this field browser will send the cookies to server automatically, on every single req
});

export default axiosInstance;

