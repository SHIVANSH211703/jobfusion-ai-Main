"use client";

import { CheckCircle2, Sparkles, TrendingUp } from "lucide-react";

import { StatusBadge } from "@/components/ui/premium";
import { useDashboard } from "@/hooks/useDashboard";

export default function ATSCard() {
  const { data, isLoading, isError } = useDashboard();
  const score = data?.data?.stats?.atsScore ?? null;
  const recommendations =
    data?.data?.latestResume?.atsAnalysis?.recommendations ?? [];
  const circumference = 2 * Math.PI * 54;
  const safeScore = score !== null ? Math.min(Math.max(score, 0), 100) : 0;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  if (isLoading) {
    return (
      <div className="surface-panel rounded-2xl border border-border p-6">
        <div className="h-5 w-32 animate-pulse rounded-full bg-muted" />
        <div className="mt-8 flex justify-center">
          <div className="h-36 w-36 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-sm text-rose-700 dark:text-rose-300">
        Unable to load ATS data.
      </div>
    );
  }

  if (score === null) {
    return (
      <div className="surface-panel rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">ATS Overview</p>
            <h2 className="mt-2 text-xl font-semibold text-foreground">Resume score</h2>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-dashed border-border bg-background p-6 text-center">
          <p className="text-base font-medium text-foreground">Upload your resume to see your ATS score</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Improve keywords, formatting, and role fit with AI-guided insights.
          </p>
        </div>
      </div>
    );
  }

  const statusLabel = safeScore >= 85 ? "Excellent" : safeScore >= 70 ? "Good" : "Needs improvement";
  const tone = safeScore >= 85 ? "success" : safeScore >= 70 ? "primary" : "warning";

  return (
    <div className="surface-panel rounded-2xl border border-border p-4.5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">ATS Overview</p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">Resume score</h2>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          <TrendingUp className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <div className="relative h-36 w-36">
          <svg className="-rotate-90" width="144" height="144">
            <circle cx="72" cy="72" r="54" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="10" />
            <circle
              cx="72"
              cy="72"
              r="54"
              fill="none"
              stroke="url(#atsGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
            <defs>
              <linearGradient id="atsGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h3 className="text-4xl font-semibold text-foreground">{Math.round(safeScore)}</h3>
            <span className="mt-1 text-sm text-muted-foreground">{statusLabel}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center">
        <StatusBadge label={statusLabel} tone={tone} />
      </div>

      <div className="mt-8 space-y-3">
        {recommendations.length > 0 ? (
          recommendations.slice(0, 3).map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-start gap-3 rounded-xl border border-border bg-background px-3 py-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 dark:text-emerald-300" />
              <span className="text-sm text-foreground">{item}</span>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>No ATS recommendations yet.</span>
          </div>
        )}
      </div>
    </div>
  );
}