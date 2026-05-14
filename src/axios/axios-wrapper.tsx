import axios, { AxiosError, AxiosResponse } from "axios";

const axiosWrapper = axios.create({
  headers: {
    "Content-Type": "application/json",
    appVersion: "1.0",
  },
});
interface ApiErrorResponse {
  status?: number;
  message?: string;
  [key: string]: unknown;
}

// ✅ Add correct typing for responses and errors
axiosWrapper.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      if (
        error.response.status === 401 ||
        error.response.data?.status === 401
      ) {
        const status = error.response?.status;
        const errorStatus = (error.response?.data as any)?.status;
      }
    }
    return Promise.reject(error);
  },
);

export default axiosWrapper;
