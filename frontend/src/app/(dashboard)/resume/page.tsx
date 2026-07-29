"use client";

import { Button } from "@/components/ui/button";
import ResumeList from "@/components/resume/ResumeList";
import { useResumes } from "@/hooks/resume/useResumes";

export default function ResumePage() {
  const { data, isLoading } = useResumes();

  if (isLoading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  console.log(data);

  return (
    <div className="space-y-8 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          My Resumes
        </h1>

        <Button>Create Resume</Button>
      </div>

      <ResumeList resumes={data ?? []} />
    </div>
  );
}