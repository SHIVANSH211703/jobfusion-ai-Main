"use client";

import { motion } from "framer-motion";

export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />

      {/* Primary Glow */}
      <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px]" />

      {/* Accent Glow */}
      <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[140px]" />

      {/* Subtle Grid */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}