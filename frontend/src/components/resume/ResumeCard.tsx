"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import type { Resume } from "@/types/resume";

interface ResumeCardProps {
  resume: Resume;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function ResumeCard({
  resume,
  onView,
  onDelete,
}: ResumeCardProps) {
  if (!resume) return null;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-semibold">
            {resume.title}
          </h3>

          <p className="text-sm text-muted-foreground">
            {resume.personalInfo?.fullName}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {new Date(
              resume.updatedAt
            ).toLocaleDateString()}
          </span>

          <div className="flex gap-2">
            <Button
              size="sm"
             onClick={() =>
  onView?.(resume._id ?? resume.id!)
}
            >
              View
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={() =>
  onDelete?.(resume._id ?? resume.id!)
}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}