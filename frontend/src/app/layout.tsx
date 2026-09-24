import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "react-hot-toast";

import QueryProvider from "@/providers/QueryProvider";
import AuthProvider from "@/providers/AuthProvider";

export const metadata: Metadata = {
  title: {
    default: "JobFusion AI",
    template: "%s | JobFusion AI",
  },
  description:
    "AI-powered career platform to build resumes, improve ATS score, prepare for interviews, and land your dream job.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased"
      >
        <QueryProvider>
          <AuthProvider>
            {children}

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
              }}
            />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}