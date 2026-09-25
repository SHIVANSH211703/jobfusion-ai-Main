import type { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
}

export function getApiErrorMessage(
  error: unknown,
  fallback: string
): string {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  return axiosError.response?.data?.message || fallback;
}