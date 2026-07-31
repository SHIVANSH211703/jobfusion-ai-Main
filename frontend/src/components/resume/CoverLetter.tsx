"use client";

interface CoverLetterProps {
  coverLetter: string;
}

export default function CoverLetter({
  coverLetter,
}: CoverLetterProps) {
  return (
    <div className="rounded-lg border p-6">

      <h2 className="text-2xl font-bold mb-5">
        AI Cover Letter
      </h2>

      <div className="whitespace-pre-wrap leading-8">
        {coverLetter}
      </div>

    </div>
  );
}