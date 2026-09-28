import { useMemo } from "react";
import {
  Briefcase,
  Clock3,
  CheckCircle2,
  XCircle,
  CalendarClock,
  SearchCheck,
} from "lucide-react";
import type { JobApplication } from "@/types/job";
import { formatFollowUpDate } from "./applicationUtils";

interface ApplicationStatsProps {
  applications: JobApplication[];
  onSelectFilter?: (status: string) => void;
  activeFilter?: string;
}

export default function ApplicationStats({
  applications,
  onSelectFilter,
  activeFilter,
}: ApplicationStatsProps) {
  const stats = useMemo(() => {
    const total = applications.length;
    let applied = 0;
    let screening = 0;
    let interview = 0;
    let offer = 0;
    let rejected = 0;
    let followUpsDue = 0;

    applications.forEach((app) => {
      switch (app.status) {
        case "applied":
          applied++;
          break;
        case "screening":
          screening++;
          break;
        case "interview":
        case "technical":
        case "hr":
          interview++;
          break;
        case "offer":
          offer++;
          break;
        case "rejected":
          rejected++;
          break;
      }

      if (app.followUpDate) {
        const followUp = formatFollowUpDate(app.followUpDate);
        if (followUp && (followUp.isOverdue || followUp.isToday)) {
          followUpsDue++;
        }
      }
    });

    return { total, applied, screening, interview, offer, rejected, followUpsDue };
  }, [applications]);

  const cards = [
    {
      key: "all",
      label: "Total Applications",
      count: stats.total,
      icon: Briefcase,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    {
      key: "applied",
      label: "Applied",
      count: stats.applied,
      icon: SearchCheck,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      key: "interview",
      label: "Interviews",
      count: stats.interview,
      icon: Clock3,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      key: "offer",
      label: "Offers",
      count: stats.offer,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      key: "rejected",
      label: "Rejected",
      count: stats.rejected,
      icon: XCircle,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
    ...(stats.followUpsDue > 0
      ? [
          {
            key: "followups",
            label: "Follow-ups Due",
            count: stats.followUpsDue,
            icon: CalendarClock,
            color: "text-orange-600 dark:text-orange-400",
            bg: "bg-orange-500/10",
            border: "border-orange-500/20",
          },
        ]
      : []),
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeFilter === card.key;
        return (
          <button
            key={card.key}
            type="button"
            onClick={() => onSelectFilter?.(card.key)}
            className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200 hover:shadow-md hover:border-primary/40 ${
              isSelected
                ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                : "bg-card border-border/80"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground truncate">
                {card.label}
              </span>
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${card.bg} ${card.color}`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {card.count}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
