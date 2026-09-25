"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  Moon,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useCurrentUser } from "@/hooks/auth/useCurrentUser";

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

  useEffect(() => {
    setQuery(searchParams.get("search") ?? "");
  }, [searchParams]);

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
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={18} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:inline-flex"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            className="w-60 pl-10 sm:w-72 lg:w-80"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search jobs..."
          />

          <button
            type="button"
            onClick={handleJobSearch}
            className="absolute right-2 top-1.5 rounded-md bg-violet-600 px-2 py-1 text-xs font-medium text-white hover:bg-violet-500"
          >
            Go
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <Moon size={18} />
        </Button>

        <Button variant="ghost" size="icon">
          <Bell size={18} />
        </Button>

        <div className="flex items-center gap-3 rounded-full border px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 font-semibold text-white">
            {initials || "—"}
          </div>

          <div>
            <p className="text-sm font-semibold">
              {user?.name ?? "Loading..."}
            </p>

            <p className="text-xs text-muted-foreground">
              {user?.headline || user?.role || ""}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}