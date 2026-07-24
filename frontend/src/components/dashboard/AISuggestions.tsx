import { ArrowRight, Sparkles } from "lucide-react";

const suggestions = [
  "Add measurable achievements to your projects.",
  "Include Docker and AWS in your technical skills.",
  "Improve your professional summary with stronger keywords.",
  "Upload your latest resume to boost ATS score.",
];

export default function AISuggestions() {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-violet-600" />

        <h2 className="text-lg font-semibold">
          AI Suggestions
        </h2>
      </div>

      <div className="space-y-4">
        {suggestions.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 rounded-xl bg-muted/50 p-3"
          >
            <Sparkles className="mt-1 h-4 w-4 text-violet-600" />

            <p className="flex-1 text-sm">
              {item}
            </p>
          </div>
        ))}
      </div>

      <button className="mt-6 flex items-center gap-2 text-sm font-medium text-violet-600 transition-all hover:gap-3">
        Improve Resume
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}