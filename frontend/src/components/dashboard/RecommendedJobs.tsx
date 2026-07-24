import { ArrowRight, Briefcase, MapPin } from "lucide-react";

const jobs = [
  {
    company: "Google",
    role: "Frontend Engineer",
    location: "Bangalore, India",
    match: 94,
    skills: ["React", "Next.js", "TypeScript"],
  },
  {
    company: "Microsoft",
    role: "Software Engineer",
    location: "Hyderabad, India",
    match: 91,
    skills: ["Node.js", "React", "Azure"],
  },
  {
    company: "Amazon",
    role: "Full Stack Developer",
    location: "Remote",
    match: 88,
    skills: ["MongoDB", "Express", "React"],
  },
];

export default function RecommendedJobs() {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Recommended Jobs
        </h2>

        <button className="text-sm text-violet-600 hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-5">
        {jobs.map((job) => (
          <div
            key={`${job.company}-${job.role}`}
            className="rounded-xl border p-5 transition hover:border-violet-500 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {job.role}
                </h3>

                <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{job.company}</span>
                </div>

                <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
              </div>

              <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                {job.match}% Match
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-muted px-3 py-1 text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>

            <button className="mt-5 flex items-center gap-2 text-sm font-medium text-violet-600 hover:gap-3 transition-all">
              View Details
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}