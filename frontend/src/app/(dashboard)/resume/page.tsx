"use client";

import Link from "next/link";

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

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            My Resumes
          </h1>

          <p className="text-muted-foreground mt-1 text-sm">
            Create and manage your resumes.
          </p>
        </div>

        <Link href="/resume/create" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            Create Resume
          </Button>
        </Link>
      </div>

      <ResumeList
        resumes={data ?? []}
      />

    </div>
  );
}