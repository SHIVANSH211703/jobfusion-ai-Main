"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { getTimeBasedGreeting } from "@/lib/greeting";

export default function WelcomeCard() {
  const { data: profile } = useProfile();
  const { data: currentUser } = useCurrentUser();

  const fullName = profile?.name || currentUser?.name;
  const firstName = fullName ? fullName.trim().split(" ")[0] : undefined;

  const { headline, secondary } = getTimeBasedGreeting(firstName);

  return (
    <section className="welcome-panel relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-4.5 sm:p-8 sm:rounded-3xl shadow-md">
      <div className="absolute -right-20 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-accent/10 blur-[80px] pointer-events-none" />

      <div className="relative flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Career intelligence</span>
          </div>

          <h1 className="text-2xl xs:text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl break-words">
            {headline}
          </h1>

          <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-muted-foreground sm:text-base">
            {secondary}
          </p>
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center w-full lg:w-auto">
          <Link
            href="/career-intelligence"
            className={`${buttonVariants({ variant: "outline", size: "lg" })} w-full sm:w-auto justify-center`}
          >
            View roadmap
          </Link>
          <Link
            href="/jobs"
            className={`${buttonVariants({ variant: "default", size: "lg" })} group inline-flex items-center justify-center gap-2 w-full sm:w-auto`}
          >
            <span>Explore jobs</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
