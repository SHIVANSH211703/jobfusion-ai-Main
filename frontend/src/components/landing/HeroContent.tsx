"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Compass, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

import { TextCursor } from "@/components/ui/text-cursor";

const badges = ["ATS Optimization", "91% Match Precision", "Pipeline Automation", "Career Roadmap"];
const dynamicEyebrows = [
  "AI-POWERED CAREER PLATFORM",
  "REAL-TIME ATS SCORING",
  "AUTOMATED JOB MATCHING",
  "CAREER ROADMAP INTELLIGENCE",
];

export default function HeroContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-10"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
          <Sparkles className="h-3 w-3" />
        </span>
        <TextCursor words={dynamicEyebrows} typingSpeed={75} pauseDuration={2400} />
      </motion.div>

      <h1 className="text-3xl xs:text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
        Build a Smarter Career.
        <span className="mt-2 block bg-gradient-to-r from-primary via-blue-600 to-accent bg-clip-text text-transparent">
          Find Better Opportunities.
        </span>
      </h1>

      <p className="mt-5 sm:mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-lg">
        JobFusion AI brings resume optimization, intelligent job matching, and full application lifecycle tracking into one high-performance career command center.
      </p>

      <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-2.5">
        {badges.map((item) => (
          <span
            key={item}
            className="inline-flex items-center rounded-lg border border-border bg-card/80 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-foreground shadow-2xs backdrop-blur-xs"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mt-8 sm:mt-10 flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-4">
        <Link href="/register" className="w-full xs:w-auto">
          <Button size="lg" className="shadow-md hover:shadow-lg gap-2 w-full xs:w-auto justify-center">
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <a href="#features" className="w-full xs:w-auto">
          <Button variant="outline" size="lg" className="gap-2 w-full xs:w-auto justify-center">
            <Compass className="h-4 w-4 text-accent" />
            <span>Explore Features</span>
          </Button>
        </a>
      </div>

      <div className="mt-12 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star key={idx} className="h-3.5 w-3.5 fill-current" />
          ))}
        </div>
        <span className="font-medium text-foreground">4.9/5</span>
        <span>•</span>
        <span>Trusted by career-focused engineers & leaders</span>
      </div>
    </motion.div>
  );
}