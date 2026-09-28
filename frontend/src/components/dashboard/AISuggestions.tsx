"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { useDashboard } from "@/hooks/useDashboard";

export default function AISuggestions() {
  const { data, isLoading, isError } = useDashboard();
  const suggestions = data?.data?.latestResume?.atsAnalysis?.recommendations ?? [];

  if (isLoading) {
    return (
      <div className="surface-panel rounded-2xl border border-border p-6">
        <div className="h-5 w-32 animate-pulse rounded-full bg-muted" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-sm text-rose-700 dark:text-rose-300">
        Unable to load AI suggestions.
      </div>
    );
  }

  const items = suggestions.length > 0 ? suggestions : ["Upload and analyze a resume to receive AI suggestions."];

  return (
    <div className="surface-panel rounded-2xl border border-border p-4.5 sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">AI Assist</p>
          <h2 className="mt-0.5 text-xl font-bold text-foreground">Suggestions</h2>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3 shadow-2xs">
            <Sparkles className="mt-1 h-4 w-4 text-accent shrink-0" />
            <p className="flex-1 text-sm text-foreground leading-relaxed">{item}</p>
          </div>
        ))}
      </div>

      <Link href="/ai-resume" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary transition-all hover:gap-3">
        Improve Resume
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}