import type { ReactNode } from "react";
import { ArrowUpRight, LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: ReactNode;
  icon: LucideIcon;
  accentClass?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  accentClass = "border-primary/20 bg-primary/10 text-primary",
}: Props) {
  return (
    <div className="group surface-panel relative overflow-hidden rounded-2xl border border-border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${accentClass}`}>
          <Icon className="h-5 w-5" />
        </div>

        <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 transition group-hover:text-primary" />
      </div>

      <div className="mt-6 space-y-2">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
        <div className="min-h-[2.25rem]">{value}</div>
      </div>
    </div>
  );
}