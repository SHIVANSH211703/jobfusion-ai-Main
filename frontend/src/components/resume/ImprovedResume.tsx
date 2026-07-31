"use client";

import type { Resume } from "@/types/resume";

interface ImprovedResumeProps {
  resume: Resume;
  changes: string[];
}

export default function ImprovedResume({
  resume,
  changes,
}: ImprovedResumeProps) {
  return (
    <div className="space-y-6">

      <div className="rounded-lg border p-6">

        <h2 className="text-2xl font-bold mb-4">
          Improved Resume
        </h2>

        <p className="text-muted-foreground">
          {resume.summary}
        </p>

      </div>

      <div className="rounded-lg border p-6">

        <h3 className="text-xl font-semibold mb-4">
          AI Changes
        </h3>

        <ul className="list-disc pl-5 space-y-2">

          {changes.map((change, index) => (

            <li key={index}>
              {change}
            </li>

          ))}

        </ul>

      </div>

    </div>
  );
}