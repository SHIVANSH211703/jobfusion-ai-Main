"use client";

import { create } from "zustand";

import { storage } from "@/lib/storage";

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;

  accessToken: string | null;
  refreshToken: string | null;

  initialize: () => void;

  login: (accessToken: string, refreshToken: string) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,

  isInitialized: false,

  accessToken: null,

  refreshToken: null,

  initialize: () => {
    const accessToken = storage.getAccessToken();
    const refreshToken = storage.getRefreshToken();

    set({
      accessToken,
      refreshToken,
      isAuthenticated: !!accessToken,
      isInitialized: true,
    });
  },

  login: (accessToken, refreshToken) => {
    storage.setTokens(accessToken, refreshToken);

    set({
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });
  },

  logout: () => {
    storage.clearTokens();

    set({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },
}));