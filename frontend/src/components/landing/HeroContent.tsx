"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  PlayCircle,
  Sparkles,
  CheckCircle2,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const badges = [
  "ATS Optimized",
  "AI Powered",
  "Resume Builder",
];

export default function HeroContent() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.8,
      }}
      className="relative"
    >
      {/* Announcement */}

      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 inline-flex items-center gap-3 rounded-full border border-violet-500/20 bg-white/5 px-5 py-2 backdrop-blur-xl"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-cyan-500">
          <Sparkles className="h-4 w-4 text-white" />
        </div>

        <span className="text-sm font-medium text-white/80">
          Introducing JobFusion AI 2.0
        </span>

        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
          NEW
        </span>
      </motion.div>

      {/* Heading */}

      <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl xl:text-8xl">
        Land Your

        <span className="mt-2 block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
          Dream Job
        </span>

        Faster With

        <span className="block text-white">
          Artificial Intelligence
        </span>
      </h1>

      {/* Description */}

      <p className="mt-8 max-w-2xl text-lg leading-8 text-white/65 md:text-xl">
        Build ATS-friendly resumes, generate personalized cover letters,
        practice AI-powered interviews, track job applications, and receive
        smart career recommendations—all in one intelligent platform.
      </p>

      {/* Tags */}

      <div className="mt-8 flex flex-wrap gap-3">
        {badges.map((item) => (
          <div
            key={item}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-xl"
          >
            {item}
          </div>
        ))}
      </div>

      {/* Buttons */}

      <div className="mt-12 flex flex-wrap gap-4">
        <Button className="group h-14 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 px-8 text-base shadow-xl shadow-violet-600/30">
          Start Building

          <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
        </Button>

        <Button
          variant="outline"
          className="h-14 rounded-2xl border-white/10 bg-white/5 px-8 text-base backdrop-blur-xl hover:bg-white/10"
        >
          <PlayCircle className="mr-2 h-5 w-5" />

          Watch Demo
        </Button>
      </div>

      {/* Social Proof */}

      <div className="mt-14 flex flex-wrap items-center gap-8">
        <div>
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className="h-5 w-5 fill-current"
              />
            ))}
          </div>

          <p className="mt-2 text-sm text-white/60">
            Trusted by thousands of job seekers
          </p>
        </div>

        <div className="h-10 w-px bg-white/10" />

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />

            <span>95% ATS Pass Rate</span>
          </div>

          <div className="flex items-center gap-2 text-cyan-400">
            <CheckCircle2 className="h-5 w-5" />

            <span>10,000+ Active Users</span>
          </div>
        </div>
      </div>

      {/* Floating Glow */}

      <div className="absolute -left-24 top-40 -z-10 h-48 w-48 rounded-full bg-violet-500/10 blur-[100px]" />
    </motion.div>
  );
}