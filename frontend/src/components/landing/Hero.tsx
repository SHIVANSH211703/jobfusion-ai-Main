"use client";

import Container from "@/components/layout/Container";
import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroDashboard from "./HeroDashboard";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-36">
      <HeroBackground />

      {/* Top Glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      {/* Left Glow */}
      <div className="absolute left-0 top-1/3 h-72 w-72 rounded-full bg-violet-500/10 blur-[140px]" />

      {/* Right Glow */}
      <div className="absolute right-0 top-1/2 h-80 w-80 rounded-full bg-cyan-500/10 blur-[160px]" />

      <Container>
        <div className="relative grid items-center gap-20 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Left Content */}
          <div className="relative z-10">
            <HeroContent />
          </div>

          {/* Right Dashboard */}
          <div className="relative flex justify-center lg:justify-end">
            <HeroDashboard />
          </div>

        </div>
      </Container>

      {/* Bottom Fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-[#020617] via-[#020617]/70 to-transparent" />
    </section>
  );
}