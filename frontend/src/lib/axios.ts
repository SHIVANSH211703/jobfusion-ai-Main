import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import { API } from "@/constants/api";

interface RetryAxiosRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: API.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as RetryAxiosRequestConfig;

    if (
  error.response?.status !== 401 ||
  originalRequest?._retry ||
  originalRequest?.url?.includes(API.AUTH.LOGIN) ||
  originalRequest?.url?.includes(API.AUTH.REGISTER) ||
  originalRequest?.url?.includes(API.AUTH.ME) ||
  originalRequest?.url?.includes(API.AUTH.REFRESH_TOKEN)
) {
  return Promise.reject(error);
}

originalRequest._retry = true; {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${API.BASE_URL}${API.AUTH.REFRESH_TOKEN}`,
          {},
          {
            withCredentials: true,
          }
        );

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;