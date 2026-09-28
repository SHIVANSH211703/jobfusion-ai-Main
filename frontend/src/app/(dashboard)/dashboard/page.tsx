"use client";

import WelcomeCard from "@/components/dashboard/WelcomeCard";
import QuickStats from "@/components/dashboard/QuickStats";
import ATSCard from "@/components/dashboard/ATSCard";
import ProfileCompletion from "@/components/dashboard/ProfileCompletion";
import ActivityCard from "@/components/dashboard/ActivityCard";
import AISuggestions from "@/components/dashboard/AISuggestions";
import RecommendedJobs from "@/components/dashboard/RecommendedJobs";
import UpcomingInterviews from "@/components/dashboard/UpcomingInterviews";

export default function DashboardPage() {
  return (
    <div className="space-y-5 sm:space-y-8 pb-6 sm:pb-8">
      <WelcomeCard />

      <QuickStats />

      <div className="grid grid-cols-1 gap-5 sm:gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="space-y-5 sm:space-y-6">
          <ActivityCard />
          <RecommendedJobs />
        </div>

        <div className="space-y-5 sm:space-y-6">
          <ATSCard />
          <ProfileCompletion />
          <UpcomingInterviews />
          <AISuggestions />
        </div>
      </div>
    </div>
  );
}