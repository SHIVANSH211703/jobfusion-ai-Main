"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Command,
  Menu,
  Moon,
  Search,
  Sparkles,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "@/hooks/useNotifications";

interface Props {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({
  collapsed,
  setCollapsed,
  setMobileOpen,
}: Props) {
  const { data: user } = useCurrentUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const notifications = useNotifications(notificationsOpen);
  const markNotificationRead = useMarkNotificationRead();
  const markAllNotificationsRead = useMarkAllNotificationsRead();

  useEffect(() => {
    setQuery(searchParams.get("search") ?? "");
  }, [searchParams]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleJobSearch = () => {
    const trimmed = query.trim();
    const params = new URLSearchParams(searchParams.toString());

    if (trimmed) {
      params.set("search", trimmed);
    } else {
      params.delete("search");
    }

    const url = params.toString() ? `/jobs?${params.toString()}` : "/jobs";
    router.push(url);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleJobSearch();
    }

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      const input = event.currentTarget;
      input.focus();
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <header className="flex h-16 sm:h-20 items-center justify-between border-b border-border bg-card/90 px-3 text-foreground backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1 lg:flex-initial">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 lg:hidden"
          aria-label="Open mobile navigation menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={18} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hidden h-9 w-9 shrink-0 lg:inline-flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>

        <div className="relative min-w-0 flex-1 max-w-[140px] xs:max-w-[180px] sm:max-w-xs md:max-w-sm lg:w-[320px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            className="h-9 sm:h-11 w-full rounded-xl border border-border bg-background pl-8 sm:pl-10 pr-3 sm:pr-12 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary/60 focus-visible:ring-primary/30"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search jobs..."
          />

          <div className="absolute right-2 top-1/2 hidden sm:flex -translate-y-1/2 items-center gap-1 rounded-lg border border-border bg-muted px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Command className="h-3 w-3" />
            K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 border border-border bg-muted text-foreground hover:bg-secondary"
          aria-label="Toggle color theme"
          title={mounted && resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {mounted && resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button variant="secondary" size="icon" className="hidden sm:inline-flex h-9 w-9 border-border bg-muted text-foreground hover:bg-secondary">
          <Sparkles className="h-4 w-4" />
        </Button>

        <div className="relative">
          <Button
            variant="secondary"
            size="icon"
            className="relative h-9 w-9 border-border bg-muted text-foreground hover:bg-secondary"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={() => setNotificationsOpen((open) => !open)}
          >
            <Bell className="h-4 w-4" />
            {(notifications.data?.unreadCount ?? 0) > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground">{notifications.data?.unreadCount}</span>}
          </Button>
          {notificationsOpen && (
            <div className="absolute right-0 top-11 sm:top-12 z-50 w-[min(360px,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-xl">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div><h2 className="text-sm font-semibold">Notifications</h2><p className="text-xs text-muted-foreground">{notifications.data?.unreadCount ?? 0} unread</p></div>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" disabled={!notifications.data?.unreadCount || markAllNotificationsRead.isPending} onClick={() => markAllNotificationsRead.mutate()}>
                  <CheckCheck className="mr-1.5 h-3.5 w-3.5" />Read all
                </Button>
              </div>
              <div className="max-h-[min(420px,70vh)] overflow-y-auto">
                {notifications.isLoading && <p className="p-4 text-sm text-muted-foreground">Loading notifications...</p>}
                {notifications.isError && <p className="p-4 text-sm text-destructive">Unable to load notifications.</p>}
                {notifications.data?.notifications.length === 0 && <p className="p-4 text-sm text-muted-foreground">No notifications yet.</p>}
                {notifications.data?.notifications.map((notification) => (
                  <button
                    key={notification._id}
                    type="button"
                    onClick={() => { if (!notification.readAt) markNotificationRead.mutate(notification._id); }}
                    className={`block w-full border-b border-border px-4 py-3 text-left transition hover:bg-muted ${notification.readAt ? "opacity-70" : "bg-primary/5"}`}
                  >
                    <span className="flex items-start justify-between gap-3"><span className="text-sm font-medium">{notification.title}</span>{!notification.readAt && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}</span>
                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">{notification.message}</span>
                    <span className="mt-1 block text-[10px] text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 rounded-xl border border-border bg-muted p-1 sm:px-3 sm:py-2">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#2455d6,#0e8a84)] text-xs sm:text-sm font-semibold text-white">
            {initials || "—"}
          </div>

          <div className="hidden min-w-0 text-left md:block">
            <p className="truncate text-sm font-semibold text-foreground">{user?.name ?? "Loading..."}</p>
            <p className="truncate text-[11px] text-muted-foreground">{user?.headline || user?.role || "Career profile"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}