"use client";

import Container from "@/components/layout/Container";
import HeroContent from "./HeroContent";
import HeroDashboard from "./HeroDashboard";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-28 sm:pb-20 lg:pt-36">
      <div className="absolute inset-x-0 top-0 h-px bg-slate-200/80" />
      <div className="absolute left-[-8rem] top-8 h-72 w-72 rounded-full bg-blue-200/80 blur-[130px]" />
      <div className="absolute right-[-4rem] top-20 h-80 w-80 rounded-full bg-teal-200/70 blur-[140px]" />

      <Container>
        <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative z-10">
            <HeroContent />
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <HeroDashboard />
          </div>
        </div>
      </Container>
    </section>
  );
}