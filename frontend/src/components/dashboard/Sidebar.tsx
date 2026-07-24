"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  ClipboardList,
  User,
  Settings,
  Sparkles,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/auth/useLogout";

interface Props {
  collapsed: boolean;
}

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Resume",
    href: "/resume",
    icon: FileText,
  },
  {
    title: "Jobs",
    href: "/jobs",
    icon: Briefcase,
  },
  {
    title: "Applications",
    href: "/applications",
    icon: ClipboardList,
  },
  {
    title: "AI Resume",
    href: "/ai-resume",
    icon: Sparkles,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar({ collapsed }: Props) {
  const pathname = usePathname();

  const { mutate: logout, isPending } = useLogout();

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Logo */}
      <div className="border-b p-6">
        {collapsed ? (
          <div className="flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 font-bold text-white">
              JF
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold">
              JobFusion
              <span className="text-violet-600"> AI</span>
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              AI Career Copilot
            </p>
          </>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-xl px-4 py-3 transition-all duration-200",
                  active
                    ? "bg-violet-600 text-white shadow-lg"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed ? "justify-center" : "gap-3"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />

                {!collapsed && (
                  <span className="truncate">{item.title}</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="border-t p-3">
        <button
          onClick={() => logout()}
          disabled={isPending}
          className={cn(
            "flex w-full items-center rounded-xl px-4 py-3 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20 disabled:cursor-not-allowed disabled:opacity-50",
            collapsed ? "justify-center" : "gap-3"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />

          {!collapsed && (
            <span>
              {isPending ? "Logging out..." : "Logout"}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}