"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, ChartNoAxesCombined } from "lucide-react";

import { useAnalytics } from "@/hooks/useAnalytics";

const rateLabels = [
  ["Response rate", "responseRate"],
  ["Interview conversion", "interviewConversion"],
  ["Offer rate", "offerRate"],
] as const;

export default function AnalyticsPage() {
  const { data, isLoading, isError } = useAnalytics();

  if (isLoading) return <div className="p-8 text-sm text-muted-foreground">Loading application analytics...</div>;
  if (isError || !data) return <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">Unable to load application analytics.</div>;

  const monthMax = Math.max(1, ...data.applicationsOverTime.map((entry) => entry.count));

  return (
    <div className="space-y-7 pb-8">
      <header className="border-b border-border pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Career intelligence</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold">Application analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your funnel, calculated from tracked applications.</p>
      </header>

      {data.totalApplications === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-5 sm:p-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><BriefcaseBusiness className="h-5 w-5" /></div>
          <h2 className="mt-4 text-lg font-semibold">No application data yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Apply to jobs to build your career funnel and see response trends.</p>
          <Link href="/jobs" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">Explore jobs <ArrowRight className="h-4 w-4" /></Link>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
            <Metric label="Applications" value={data.totalApplications.toString()} />
            {rateLabels.map(([label, key]) => <Metric key={key} label={label} value={data[key] === null ? "Not enough data" : `${data[key]}%`} />)}
          </section>

          <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
              <h2 className="text-base font-semibold">Application stages</h2>
              <div className="mt-4 space-y-3">
                {Object.entries(data.statuses).filter(([, count]) => count > 0).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between border-b border-border pb-2 text-sm">
                    <span className="capitalize text-muted-foreground">{status}</span><span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
              <Link href="/applications" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">View applications <ArrowRight className="h-4 w-4" /></Link>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
              <div className="flex items-center gap-2"><ChartNoAxesCombined className="h-4 w-4 text-primary" /><h2 className="text-base font-semibold">Applications over time</h2></div>
              {data.applicationsOverTime.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {data.applicationsOverTime.map((entry) => {
                    const date = new Date(entry.year, entry.month - 1, 1);
                    return <div key={`${entry.year}-${entry.month}`} className="grid grid-cols-[70px_minmax(0,1fr)_28px] sm:grid-cols-[90px_minmax(0,1fr)_32px] items-center gap-2 sm:gap-3 text-xs sm:text-sm"><span className="text-muted-foreground truncate">{date.toLocaleDateString(undefined, { month: "short", year: "2-digit" })}</span><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(entry.count / monthMax) * 100}%` }} /></div><span className="text-right tabular-nums">{entry.count}</span></div>;
                  })}
                </div>
              ) : <p className="mt-5 text-sm text-muted-foreground">No monthly application history is available.</p>}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-3 text-2xl font-semibold">{value}</p></div>;
}