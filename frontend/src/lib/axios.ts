import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import { API } from "@/constants/api";
import { storage } from "@/lib/storage";

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: API.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = storage.getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryAxiosRequestConfig;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = storage.getRefreshToken();

        if (!refreshToken) {
          storage.clearTokens();

          return Promise.reject(error);
        }

        const response = await axios.post(
          `${API.BASE_URL}${API.AUTH.REFRESH_TOKEN}`,
          {
            refreshToken,
          }
        );

       const { tokens } = response.data.data;

storage.setTokens(
  tokens.accessToken,
  tokens.refreshToken
);

originalRequest.headers.Authorization =
  `Bearer ${tokens.accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        storage.clearTokens();

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