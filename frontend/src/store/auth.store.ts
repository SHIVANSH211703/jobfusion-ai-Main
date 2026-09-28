"use client";

import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  accessToken: string | null;

  initialize: () => void;
  login: (token?: string | null) => void;
  logout: () => void;

  setAccessToken: (token: string | null) => void;
  setAuthenticated: (value: boolean) => void;
  setInitialized: (value: boolean) => void;
}

const getStoredAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem("jobfusion_access_token");
  } catch {
    return null;
  }
};

const storeAccessToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      sessionStorage.setItem("jobfusion_access_token", token);
    } else {
      sessionStorage.removeItem("jobfusion_access_token");
    }
  } catch {
    // Ignore storage quota or access errors in restricted environments
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isInitialized: false,
  accessToken: null,

  initialize: () => {
    const token = getStoredAccessToken();
    set({
      isInitialized: true,
      accessToken: token,
    });
  },

  login: (token) => {
    if (token !== undefined) {
      storeAccessToken(token);
      set({
        isAuthenticated: true,
        accessToken: token,
      });
    } else {
      set({
        isAuthenticated: true,
      });
    }
  },

  logout: () => {
    storeAccessToken(null);
    set({
      isAuthenticated: false,
      accessToken: null,
    });
  },

  setAccessToken: (token) => {
    storeAccessToken(token);
    set((state) => ({
      accessToken: token,
      isAuthenticated: token ? true : state.isAuthenticated,
    }));
  },

  setAuthenticated: (value) =>
    set({
      isAuthenticated: value,
    }),

  setInitialized: (value) =>
    set({
      isInitialized: value,
    }),
}));