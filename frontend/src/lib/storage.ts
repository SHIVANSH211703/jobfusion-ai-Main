const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const isBrowser = typeof window !== "undefined";

export const storage = {
  getAccessToken(): string | null {
    if (!isBrowser) return null;

    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (!isBrowser) return null;

    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setAccessToken(token: string): void {
    if (!isBrowser) return;

    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  setRefreshToken(token: string): void {
    if (!isBrowser) return;

    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  setTokens(accessToken: string, refreshToken: string): void {
    if (!isBrowser) return;

    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  removeAccessToken(): void {
    if (!isBrowser) return;

    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  removeRefreshToken(): void {
    if (!isBrowser) return;

    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  clearTokens(): void {
    if (!isBrowser) return;

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};