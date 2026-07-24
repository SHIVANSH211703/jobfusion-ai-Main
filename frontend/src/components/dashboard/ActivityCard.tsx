import {
  FileText,
  Briefcase,
  Sparkles,
  User,
} from "lucide-react";

const activities = [
  {
    title: "Resume uploaded",
    time: "2 hours ago",
    icon: FileText,
    color: "bg-blue-500",
  },
  {
    title: "Applied for Frontend Developer",
    time: "Yesterday",
    icon: Briefcase,
    color: "bg-emerald-500",
  },
  {
    title: "ATS score improved to 91%",
    time: "2 days ago",
    icon: Sparkles,
    color: "bg-violet-500",
  },
  {
    title: "Profile updated",
    time: "3 days ago",
    icon: User,
    color: "bg-amber-500",
  },
];

export default function ActivityCard() {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Recent Activity
        </h2>

        <button className="text-sm text-violet-600 hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-6">
        {activities.map((activity, index) => {
          const Icon = activity.icon;

          return (
            <div
              key={index}
              className="flex items-start gap-4"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full ${activity.color} text-white`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p className="font-medium">
                  {activity.title}
                </p>

                <p className="text-sm text-muted-foreground">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}