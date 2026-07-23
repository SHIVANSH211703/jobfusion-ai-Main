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
  const initialize = useAuthStore((s) => s.initialize);

  const logout = useAuthStore((s) => s.logout);

  const isInitialized = useAuthStore(
    (s) => s.isInitialized
  );

  const isAuthenticated = useAuthStore(
    (s) => s.isAuthenticated
  );

  useEffect(() => {
    initialize();
  }, [initialize]);

  const { isLoading, isError } = useCurrentUser(
    isInitialized && isAuthenticated
  );

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) return;

    if (isError) {
      logout();
    }
  }, [
    isError,
    logout,
    isAuthenticated,
    isInitialized,
  ]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isAuthenticated && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return children;
}