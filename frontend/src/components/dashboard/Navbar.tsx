"use client";

import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Moon,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({
  collapsed,
  setCollapsed,
}: Props) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
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
            className="w-80 pl-10"
            placeholder="Search jobs..."
          />
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
            SR
          </div>

          <div>
            <p className="text-sm font-semibold">
              Shivansh Rai
            </p>

            <p className="text-xs text-muted-foreground">
              Integration Engineer
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}