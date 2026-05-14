import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import config from "./config";
import { HandleRefreshToken } from "@/components/auth/RefreshToken";

// Create an axios instance with type safety
const axiosInstance: AxiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const errorStatus = (error.response?.data as any)?.status;

    if (status === 401 || errorStatus === 401) {
      const now = new Date();
      const formatted = now.toUTCString();
      document.cookie = `auth_token=; path=/; expires=${formatted}`;
      document.cookie = `permissions=; path=/; expires=${formatted}`;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (typeof window !== "undefined") {
        location.reload();
      }
      window.location.href = "/signin";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
