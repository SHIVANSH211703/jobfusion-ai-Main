"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const applications = [
  { company: "Google", role: "Staff Frontend Engineer", status: "Interview", tone: "bg-emerald-500 text-emerald-700 dark:text-emerald-300" },
  { company: "Stripe", role: "Full Stack Engineer", status: "Screening", tone: "bg-primary text-primary" },
  { company: "Vercel", role: "Senior Next.js Developer", status: "Applied", tone: "bg-accent text-accent" },
];

export default function HeroDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative w-full max-w-[500px]"
    >
      <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-primary/10 to-accent/10 blur-xl pointer-events-none" />
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm border border-primary/20">
              DC
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Product Preview</p>
              <h3 className="text-base font-bold text-foreground">John Doe</h3>
            </div>
          </div>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase text-emerald-700 dark:text-emerald-300">
            Active Search
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-secondary/40 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">ATS Readiness Score</p>
              <div className="mt-1 text-4xl font-extrabold text-foreground tracking-tight">94%</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "94%" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <StatCard icon={<BriefcaseBusiness className="h-4 w-4" />} label="Saved Jobs" value="126" accent="text-primary" />
          <StatCard icon={<Sparkles className="h-4 w-4" />} label="AI Actions" value="48" accent="text-accent" />
          <StatCard icon={<BarChart3 className="h-4 w-4" />} label="Match Fit" value="91%" accent="text-emerald-600" />
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-secondary/30 p-3.5">
          <div className="mb-2.5 flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Pipeline Status</span>
            <span className="text-primary font-bold">3 Active</span>
          </div>
          <div className="space-y-2">
            {applications.map((app) => (
              <div key={app.company} className="flex items-center justify-between rounded-xl bg-card border border-border/80 px-3 py-2 shadow-2xs">
                <div>
                  <p className="text-xs font-bold text-foreground">{app.company}</p>
                  <p className="text-[11px] text-muted-foreground">{app.role}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-accent/20 bg-accent/5 p-3.5">
          <div className="flex items-start gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground">AI Career Insight</p>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                Resume aligns with 94% of Staff Frontend requirements. Quantify team leadership metrics for +18% interview rate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-2xs">
      <div className={`mb-1.5 inline-flex rounded-lg bg-secondary p-1.5 ${accent}`}>{icon}</div>
      <p className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold tracking-tight text-foreground">{value}</p>
    </div>
  );
}