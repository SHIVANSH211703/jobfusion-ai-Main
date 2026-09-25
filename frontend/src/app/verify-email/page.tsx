"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import authService from "@/services/auth.service";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("This verification link is missing its token.");
      return;
    }

    authService.verifyEmail(token)
      .then((response) => {
        setStatus("success");
        setMessage(response.message);
      })
      .catch(() => {
        setStatus("error");
        setMessage("This verification link is invalid or has expired.");
      });
  }, [searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
        {status === "loading" && <Loader2 className="mx-auto h-10 w-10 animate-spin text-violet-600" />}
        {status === "success" && <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />}
        {status === "error" && <XCircle className="mx-auto h-10 w-10 text-destructive" />}
        <h1 className="mt-4 text-2xl font-bold">Email verification</h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        {status !== "loading" && (
          <Link href="/login" className="mt-6 inline-flex rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white">
            Continue to login
          </Link>
        )}
      </div>
    </main>
  );
}
