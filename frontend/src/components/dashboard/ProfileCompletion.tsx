import {
  CheckCircle2,
  Circle,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";

const items = [
  {
    label: "Basic Information",
    completed: true,
    icon: User,
  },
  {
    label: "Education",
    completed: true,
    icon: GraduationCap,
  },
  {
    label: "Experience",
    completed: true,
    icon: Briefcase,
  },
  {
    label: "Resume Uploaded",
    completed: false,
    icon: FileText,
  },
  {
    label: "Skills Added",
    completed: false,
    icon: Award,
  },
];

export default function ProfileCompletion() {
  const progress = 60;

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Profile Completion
        </h2>

        <span className="text-lg font-bold text-violet-600">
          {progress}%
        </span>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-muted-foreground" />

                <span className="text-sm">
                  {item.label}
                </span>
              </div>

              {item.completed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}