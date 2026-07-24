"use client";

import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;

  initialize: () => void;
  login: () => void;
  logout: () => void;

  setAuthenticated: (value: boolean) => void;
  setInitialized: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,

  isInitialized: false,

  initialize: () => {
    set({
      isInitialized: true,
    });
  },

  login: () => {
    set({
      isAuthenticated: true,
    });
  },

  logout: () => {
    set({
      isAuthenticated: false,
    });
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