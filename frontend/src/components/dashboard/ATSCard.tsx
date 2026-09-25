"use client";

import { CheckCircle2, TrendingUp } from "lucide-react";

import { useDashboard } from "@/hooks/useDashboard";

export default function ATSCard() {
  const { data, isLoading, isError } = useDashboard();
  const score = data?.data?.stats?.atsScore ?? null;
  const recommendations =
    data?.data?.latestResume?.atsAnalysis?.recommendations ?? [];
  const circumference = 2 * Math.PI * 54;
  const safeScore = score !== null ? Math.min(Math.max(score, 0), 100) : 0;
  const strokeDashoffset =
    circumference - (safeScore / 100) * circumference;

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="h-6 w-28 animate-pulse rounded bg-muted" />
        <div className="mt-8 flex justify-center">
          <div className="h-36 w-36 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
        Unable to load ATS data.
      </div>
    );
  }

  if (score === null) {
    return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">ATS Score</h2>
          <TrendingUp className="h-5 w-5 text-emerald-500" />
        </div>

        <div className="mt-8 rounded-2xl border border-dashed bg-muted/30 p-6 text-center">
          <p className="text-base font-medium">Upload your resume to see your ATS score</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Analyze your resume to get keyword and formatting insights.
          </p>
        </div>
      </div>
    );
  }

  const statusLabel =
    safeScore >= 85 ? "Excellent" : safeScore >= 70 ? "Solid" : "Needs work";

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">ATS Score</h2>
        <TrendingUp className="h-5 w-5 text-emerald-500" />
      </div>

      <div className="mt-8 flex justify-center">
        <div className="relative h-36 w-36">
          <svg className="-rotate-90" width="144" height="144">
            <circle
              cx="72"
              cy="72"
              r="54"
              fill="none"
              stroke="currentColor"
              className="text-muted"
              strokeWidth="10"
            />

            <circle
              cx="72"
              cy="72"
              r="54"
              fill="none"
              stroke="rgb(139 92 246)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h3 className="text-4xl font-bold">{safeScore}%</h3>
            <span className="text-sm text-muted-foreground">{statusLabel}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {recommendations.length > 0 ? (
          recommendations.slice(0, 3).map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-sm">{item}</span>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>No ATS recommendations yet.</span>
          </div>
        )}
      </div>
    </div>
  );
}