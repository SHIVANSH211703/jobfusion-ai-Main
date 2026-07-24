import WelcomeCard from "@/components/dashboard/WelcomeCard";
import QuickStats from "@/components/dashboard/QuickStats";
import ATSCard from "@/components/dashboard/ATSCard";
import ProfileCompletion from "@/components/dashboard/ProfileCompletion";
import ActivityCard from "@/components/dashboard/ActivityCard";
import AISuggestions from "@/components/dashboard/AISuggestions";
import RecommendedJobs from "@/components/dashboard/RecommendedJobs";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <WelcomeCard />

      <QuickStats />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <ActivityCard />
          <RecommendedJobs />
        </div>

        <div className="space-y-6">
          <ATSCard />
          <ProfileCompletion />
          <AISuggestions />
        </div>
      </div>
    </div>
  );
}