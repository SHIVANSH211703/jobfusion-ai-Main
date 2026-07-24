"use client";

import { ReactNode, useEffect } from "react";

import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { useAuthStore } from "@/store/auth.store";

interface Props {
  children: ReactNode;
}

export default function AuthProvider({
  children,
}: Props) {
  const initialize = useAuthStore((state) => state.initialize);

  const login = useAuthStore((state) => state.login);

  const logout = useAuthStore((state) => state.logout);

  const isInitialized = useAuthStore(
    (state) => state.isInitialized
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  useEffect(() => {
    initialize();
  }, [initialize]);

  const {
    data,
    isLoading,
    isSuccess,
    isError,
  } = useCurrentUser(
    isInitialized && !isAuthenticated
  );

  useEffect(() => {
    if (!isInitialized) return;

    if (isSuccess && data) {
      login();
      return;
    }

    // Only logout if the user was previously authenticated
    if (isError && isAuthenticated) {
      logout();
    }
  }, [
    isInitialized,
    isSuccess,
    isError,
    data,
    isAuthenticated,
    login,
    logout,
  ]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return children;
}