"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Top Header */}
      <header className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-xs">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-sm sm:text-base font-bold tracking-tight text-foreground">JobFusion AI</span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden xs:inline">Back to Home</span>
          <span className="xs:hidden">Home</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-3.5 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-5 sm:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground break-words">
              {title}
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
              {subtitle}
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4.5 sm:p-8 shadow-sm">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} JobFusion AI. Professional Career Intelligence.
      </footer>
    </div>
  );
}