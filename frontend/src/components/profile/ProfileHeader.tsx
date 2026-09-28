"use client";

import { BadgeCheck, CalendarDays, Mail } from "lucide-react";

import AvatarUpload from "./AvatarUpload";

import type { Profile } from "@/types/profile";

interface ProfileHeaderProps {
  profile: Profile;
}

export default function ProfileHeader({
  profile,
}: ProfileHeaderProps) {
  const joinedDate = new Date(
    profile.createdAt
  ).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border bg-card p-4.5 sm:p-6 md:p-8 shadow-sm">
      <div className="flex flex-col items-center gap-6 sm:gap-8 md:flex-row">
        <AvatarUpload
          avatar={profile.avatar}
          name={profile.name}
        />

        <div className="flex-1 space-y-3 text-center md:text-left min-w-0 w-full">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">
              {profile.name}
            </h1>

            {profile.isEmailVerified && (
              <div className="inline-flex items-center justify-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 self-center md:self-auto">
                <BadgeCheck className="h-4 w-4" />
                Verified
              </div>
            )}
          </div>

          {profile.headline && (
            <p className="text-sm sm:text-base text-muted-foreground break-words">
              {profile.headline}
            </p>
          )}

          <div className="flex flex-col gap-2 text-xs sm:text-sm text-muted-foreground md:flex-row md:items-center md:gap-6">
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <Mail className="h-4 w-4 shrink-0" />
              <span className="break-all">{profile.email}</span>
            </div>

            <div className="flex items-center justify-center gap-2 md:justify-start">
              <CalendarDays className="h-4 w-4" />
              <span>Joined {joinedDate}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 pt-2 md:justify-start">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {profile.role}
            </span>

            {profile.experienceLevel && (
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                {profile.experienceLevel}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}