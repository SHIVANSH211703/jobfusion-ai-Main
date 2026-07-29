"use client";

import ResumeCard from "./ResumeCard";

import { useDeleteResume } from "@/hooks/resume/useResumes";

import type { Resume } from "@/types/resume";

interface ResumeListProps {
  resumes: Resume[];
}

export default function ResumeList({
  resumes,
}: ResumeListProps) {
  const deleteResume = useDeleteResume();

  if (!Array.isArray(resumes)) {
    return (
      <div className="text-center py-10">
        Invalid resume data.
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="text-center py-10">
        No resumes found.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {resumes.map((resume) => (
        <ResumeCard
          key={resume.id}
          resume={resume}
          onDelete={(id) =>
            deleteResume.mutate(id)
          }
        />
      ))}
    </div>
  );
}