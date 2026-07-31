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
    <div className="space-y-8 p-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            My Resumes
          </h1>

          <p className="text-muted-foreground mt-1">
            Create and manage your resumes.
          </p>

        </div>

        <Link href="/resume/create">

          <Button>
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