"use client";

import { useRouter } from "next/navigation";

import ResumeCard from "./ResumeCard";

import { useDeleteResume } from "@/hooks/resume/useDeleteResume";

import type { Resume } from "@/types/resume";

interface ResumeListProps {
  resumes: Resume[];
}

export default function ResumeList({
  resumes,
}: ResumeListProps) {
  const router = useRouter();

  const deleteResume = useDeleteResume();

  if (!Array.isArray(resumes)) {
    return (
      <div className="py-10 text-center">
        Invalid resume data.
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="py-10 text-center">
        No resumes found.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

      {resumes.map((resume) => (

        <ResumeCard
          key={resume._id ?? resume.id}
          resume={resume}

          onView={(id) =>
            router.push(`/resume/${id}`)
          }

          onDelete={(id) =>
            deleteResume.mutate(id)
          }

        />

      ))}

    </div>
  );
}