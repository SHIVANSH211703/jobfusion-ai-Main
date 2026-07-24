import { ArrowUpRight, LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
}: Props) {
  return (
    <div className="group rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-violet-500/10 p-3">
          <Icon className="h-6 w-6 text-violet-600" />
        </div>

        <ArrowUpRight className="h-5 w-5 text-muted-foreground transition group-hover:text-violet-600" />
      </div>

      <h2 className="mt-6 text-3xl font-bold">{value}</h2>

      <p className="mt-2 text-sm text-muted-foreground">
        {title}
      </p>
    </div>
  );
}