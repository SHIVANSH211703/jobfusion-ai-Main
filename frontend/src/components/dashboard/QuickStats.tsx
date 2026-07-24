import {
  Briefcase,
  ClipboardList,
  FileText,
  Sparkles,
} from "lucide-react";
import StatCard from "./StatCard";

const stats = [
  {
    title: "ATS Score",
    value: "91%",
    icon: Sparkles,
  },
  {
    title: "Recommended Jobs",
    value: "126",
    icon: Briefcase,
  },
  {
    title: "Applications",
    value: "12",
    icon: ClipboardList,
  },
  {
    title: "Resumes",
    value: "2",
    icon: FileText,
  },
];

export default function QuickStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          icon={item.icon}
        />
      ))}
    </div>
  );
}