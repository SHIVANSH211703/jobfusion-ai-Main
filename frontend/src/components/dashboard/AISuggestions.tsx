"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { useDashboard } from "@/hooks/useDashboard";

export default function AISuggestions() {
  const { data, isLoading, isError } = useDashboard();
  const suggestions =
    data?.data?.latestResume?.atsAnalysis?.recommendations ?? [];

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
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
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
        Unable to load AI suggestions.
      </div>
    );
  }

  const items = suggestions.length > 0 ? suggestions : ["Upload and analyze a resume to receive AI suggestions."];

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-violet-600" />
        <h2 className="text-lg font-semibold">AI Suggestions</h2>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-xl bg-muted/50 p-3">
            <Sparkles className="mt-1 h-4 w-4 text-violet-600" />
            <p className="flex-1 text-sm">{item}</p>
          </div>
        ))}
      </div>

      <Link href="/ai-resume" className="mt-6 flex items-center gap-2 text-sm font-medium text-violet-600 transition-all hover:gap-3">
        Improve Resume
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}