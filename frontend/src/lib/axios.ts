import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import { API } from "@/constants/api";
import { useAuthStore } from "@/store/auth.store";

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

// Request interceptor: attach short-lived access token as Bearer header if available
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let refreshPromise: Promise<string | null> | null = null;

// Response interceptor: handle 401 and refresh token flow (excluding logout)
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as RetryAxiosRequestConfig;

    const isExcluded =
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes(API.AUTH.LOGIN) ||
      originalRequest.url?.includes(API.AUTH.REGISTER) ||
      originalRequest.url?.includes(API.AUTH.ME) ||
      originalRequest.url?.includes(API.AUTH.REFRESH_TOKEN) ||
      originalRequest.url?.includes(API.AUTH.LOGOUT) ||
      originalRequest.url?.includes(API.AUTH.FORGOT_PASSWORD) ||
      originalRequest.url?.includes(API.AUTH.RESET_PASSWORD);

    if (error.response?.status !== 401 || isExcluded) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const response = await axios.post<{
            success: boolean;
            message: string;
            data?: { accessToken?: string };
          }>(
            `${API.BASE_URL}${API.AUTH.REFRESH_TOKEN}`,
            {},
            {
              withCredentials: true,
            }
          );

          const newAccessToken =
            response.data?.data?.accessToken || null;

          if (newAccessToken) {
            useAuthStore.getState().setAccessToken(newAccessToken);
          }

          return newAccessToken;
        })().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;