"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";

interface GuestGuardProps {
  children: ReactNode;
}

export default function GuestGuard({
  children,
}: GuestGuardProps) {
  const router = useRouter();

  const isInitialized = useAuthStore(
    (state) => state.isInitialized
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  useEffect(() => {
    if (!isInitialized) return;

    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}