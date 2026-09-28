"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  ClipboardList,
  CalendarDays,
  ChartNoAxesCombined,
  BookmarkCheck,
  Route,
  User,
  Settings,
  Sparkles,
  LogOut,
  ArrowUpRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/auth/useLogout";

interface Props {
  collapsed: boolean;
  onNavigate?: () => void;
}

const navigationGroups = [
  {
    category: "OVERVIEW",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    category: "CAREER",
    items: [
      { title: "Jobs", href: "/jobs", icon: Briefcase },
      { title: "Saved Searches", href: "/saved-searches", icon: BookmarkCheck },
      { title: "Applications", href: "/applications", icon: ClipboardList },
      { title: "Interviews", href: "/interviews", icon: CalendarDays },
      { title: "Analytics", href: "/analytics", icon: ChartNoAxesCombined },
    ],
  },
  {
    category: "RESUME",
    items: [
      { title: "Resume", href: "/resume", icon: FileText },
      { title: "AI Resume", href: "/ai-resume", icon: Sparkles },
    ],
  },
  {
    category: "INTELLIGENCE",
    items: [
      { title: "Career Roadmap", href: "/career-intelligence", icon: Route },
    ],
  },
  {
    category: "ACCOUNT",
    items: [
      { title: "Profile", href: "/profile", icon: User },
      { title: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export default function Sidebar({ collapsed, onNavigate }: Props) {
  const pathname = usePathname();
  const { mutate: logout, isPending } = useLogout();

  return (
    <aside
      className={cn(
        "surface-panel flex h-screen flex-col border-r border-border text-sidebar-foreground transition-all duration-300 ease-out",
        collapsed ? "w-20" : "w-[270px] max-w-[85vw]"
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-5">
        {collapsed ? (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-sm">
            JF
          </div>
        ) : (
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-sm">
              JF
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">AI Career Platform</p>
              <h1 className="text-lg font-bold text-foreground tracking-tight">JobFusion AI</h1>
            </div>
          </Link>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {navigationGroups.map((group) => (
          <div key={group.category} className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-1">
                {group.category}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group relative flex items-center overflow-hidden rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    collapsed ? "justify-center" : "gap-3",
                    active
                      ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  {active && (
                    <span className="absolute inset-y-1.5 left-0.5 w-1 rounded-full bg-primary" />
                  )}
                  <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  {!collapsed && <span className="truncate">{item.title}</span>}
                  {!collapsed && active && <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-primary opacity-80" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={() => logout()}
          disabled={isPending}
          className={cn(
            "flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-500/10 hover:text-rose-800 disabled:cursor-not-allowed disabled:opacity-50 dark:text-rose-300 dark:hover:text-rose-200",
            collapsed ? "justify-center" : "gap-3"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>{isPending ? "Logging out..." : "Logout"}</span>}
        </button>
      </div>
    </aside>
  );
}