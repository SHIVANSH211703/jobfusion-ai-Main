"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell relative flex h-screen overflow-hidden bg-background text-foreground">
      <div className="hidden lg:flex">
        <Sidebar collapsed={collapsed} />
      </div>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden max-w-full">
        <Navbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setMobileOpen={setMobileOpen}
        />

        <main className="flex-1 overflow-y-auto px-3.5 py-4 sm:px-6 sm:py-5 lg:px-8 max-w-full">
          <div className="mx-auto max-w-[1480px] w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}