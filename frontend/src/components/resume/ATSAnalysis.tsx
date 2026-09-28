"use client";

import type { ATSAnalysisResponse } from "@/types/resume";

interface ATSAnalysisProps {
  analysis: ATSAnalysisResponse["data"];
}

export default function ATSAnalysis({
  analysis,
}: ATSAnalysisProps) {
  return (
    <div className="space-y-6">

      {/* ATS Score */}

      <div className="rounded-lg border p-6">

        <h2 className="text-xl font-bold mb-4">
          ATS Score
        </h2>

        <div className="text-5xl font-bold text-green-600">
          {analysis.score}/100
        </div>

      </div>

      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-bold">Analysis breakdown</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(analysis.categories).map(([category, score]) => (
            <div key={category}>
              <div className="mb-1 flex justify-between text-sm capitalize">
                <span className="text-muted-foreground">{category}</span>
                <span className="font-medium">{score}/100</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {analysis.jobSpecific && (
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-bold">Job-specific analysis</h2>
          <KeywordGroup title="Matched keywords" items={analysis.matchedKeywords} />
          <KeywordGroup title="Missing keywords" items={analysis.missingKeywords} />
          <KeywordGroup title="Recommendations for this job" items={analysis.jobSpecificRecommendations} />
        </div>
      )}

      <KeywordGroup title="Weak sections" items={analysis.weakSections} />

      {/* AI Summary */}

      <div className="rounded-lg border p-6">

        <h2 className="text-xl font-bold mb-4">
          AI Summary
        </h2>

        <p className="leading-7">
          {analysis.aiSummary}
        </p>

      </div>

      {/* Strengths */}

      <div className="rounded-lg border p-6">

        <h2 className="text-xl font-bold mb-4 text-green-600">
          Strengths
        </h2>

        <ul className="list-disc pl-5 space-y-2">

          {analysis.strengths.map((item, index) => (

            <li key={index}>
              {item}
            </li>

          ))}

        </ul>

      </div>

      {/* Weaknesses */}

      <div className="rounded-lg border p-6">

        <h2 className="text-xl font-bold mb-4 text-red-600">
          Weaknesses
        </h2>

        <ul className="list-disc pl-5 space-y-2">

          {analysis.weaknesses.map((item, index) => (

            <li key={index}>
              {item}
            </li>

          ))}

        </ul>

      </div>

      {/* Recommendations */}

      <div className="rounded-lg border p-6">

        <h2 className="text-xl font-bold mb-4 text-blue-600">
          Recommendations
        </h2>

        <ul className="list-disc pl-5 space-y-2">

          {analysis.recommendations.map(
            (item, index) => (

              <li key={index}>
                {item}
              </li>

            )
          )}

        </ul>

      </div>

    </div>
  );
}

function KeywordGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      {items.length > 0 ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">None identified</p>
      )}
    </div>
  );
}