import { CheckCircle2, TrendingUp } from "lucide-react";

export default function ATSCard() {
  const score = 91;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset =
    circumference - (score / 100) * circumference;

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          ATS Score
        </h2>

        <TrendingUp className="h-5 w-5 text-emerald-500" />
      </div>

      <div className="mt-8 flex justify-center">
        <div className="relative h-36 w-36">
          <svg
            className="-rotate-90"
            width="144"
            height="144"
          >
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
            <h3 className="text-4xl font-bold">
              {score}%
            </h3>

            <span className="text-sm text-muted-foreground">
              Excellent
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span className="text-sm">
            Strong keyword coverage
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span className="text-sm">
            Good project descriptions
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-amber-500" />
          <span className="text-sm">
            Add more quantified achievements
          </span>
        </div>
      </div>
    </div>
  );
}