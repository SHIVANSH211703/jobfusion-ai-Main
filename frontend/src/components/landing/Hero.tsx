"use client";

import Container from "@/components/layout/Container";
import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroDashboard from "./HeroDashboard";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-32">
      <HeroBackground />

      <Container>
        <div className="grid items-center gap-20 lg:grid-cols-2">
          <HeroContent />

          <HeroDashboard />
        </div>
      </Container>
    </section>
  );
}