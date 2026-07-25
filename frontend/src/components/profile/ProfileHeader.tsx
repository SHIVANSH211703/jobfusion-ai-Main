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
    <div className="rounded-2xl border bg-card p-8 shadow-sm">
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <AvatarUpload
          avatar={profile.avatar}
          name={profile.name}
        />

        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <h1 className="text-3xl font-bold tracking-tight">
              {profile.name}
            </h1>

            {profile.isEmailVerified && (
              <div className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                <BadgeCheck className="h-4 w-4" />
                Verified
              </div>
            )}
          </div>

          {profile.headline && (
            <p className="text-muted-foreground">
              {profile.headline}
            </p>
          )}

          <div className="flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center md:gap-6">
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <Mail className="h-4 w-4" />
              <span>{profile.email}</span>
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