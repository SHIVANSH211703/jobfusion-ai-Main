"use client";

interface ATSAnalysisProps {
  analysis: {
    score: number;
    aiSummary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
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