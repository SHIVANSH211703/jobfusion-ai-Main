"use client";

import ModernTemplate from "./ModernTemplate";
import ClassicTemplate from "./ClassicTemplate";
import MinimalTemplate from "./MinimalTemplate";

import type { Resume } from "@/types/resume";

interface ResumePreviewProps {
  resume: Resume;
}

export default function ResumePreview({
  resume,
}: ResumePreviewProps) {

  switch (resume.template) {

    case "classic":
      return (
        <ClassicTemplate
          resume={resume}
        />
      );

    case "minimal":
      return (
        <MinimalTemplate
          resume={resume}
        />
      );

    case "modern":
    default:
      return (
        <ModernTemplate
          resume={resume}
        />
      );

  }
}