"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Trash2, ExternalLink } from "lucide-react";
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

  const resumeId = resume._id ?? resume.id!;
  const hasAts = typeof resume.atsScore === "number" && resume.atsScore > 0;

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-md">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-semibold text-foreground">
                  {resume.title}
                </h3>
                {resume.isDefault && (
                  <Badge variant="secondary" className="text-[10px]">
                    Default
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {resume.personalInfo?.fullName || "Candidate Resume"}
              </p>
            </div>
          </div>

          {hasAts ? (
            <Badge
              variant="outline"
              className="shrink-0 border-accent/30 bg-accent/10 text-xs font-semibold text-accent"
            >
              ATS {resume.atsScore}%
            </Badge>
          ) : (
            <span className="shrink-0 text-[11px] text-muted-foreground">
              Not analyzed
            </span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border/60 pt-3">
          <span className="text-xs text-muted-foreground">
            Updated {new Date(resume.updatedAt).toLocaleDateString()}
          </span>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 rounded-lg text-xs"
              onClick={() => onView?.(resumeId)}
            >
              <span>View</span>
              <ExternalLink className="h-3 w-3" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="h-8 rounded-lg text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDelete?.(resumeId)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}