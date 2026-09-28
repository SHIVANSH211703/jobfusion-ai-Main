"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface GlassCardProps extends React.ComponentPropsWithoutRef<"div"> {
  glow?: boolean;
}

export function GlassCard({ className, glow = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "surface-panel relative overflow-hidden rounded-2xl border border-border bg-card",
        glow && "glow-ring",
        className
      )}
      {...props}
    />
  );
}

export function CountUp({
  value,
  duration = 1200,
  decimals = 0,
  suffix = "",
  className,
}: {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    const startValue = 0;

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const nextValue = startValue + (value - startValue) * eased;

      setDisplayValue(nextValue);

      if (progress < 1) {
        ref.current = requestAnimationFrame(step);
      }
    };

    ref.current = requestAnimationFrame(step);

    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [duration, value]);

  const output = Number(displayValue).toFixed(decimals);

  return <span className={className}>{output}{suffix}</span>;
}

export function StatusBadge({
  label,
  tone = "neutral",
  className,
}: {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "primary" | "intelligence";
  className?: string;
}) {
  const palette = {
    neutral: "border-border bg-secondary text-secondary-foreground",
    success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    warning: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    danger: "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    primary: "border-primary/20 bg-primary/10 text-primary",
    intelligence: "border-accent/20 bg-accent/10 text-accent dark:text-teal-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase",
        palette[tone],
        className
      )}
    >
      {label}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-muted/60",
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
    </div>
  );
}
