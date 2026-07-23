"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    >
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-5 py-2 text-sm text-violet-300">
        <Sparkles className="h-4 w-4" />

        AI Powered Career Platform
      </div>

      <h1 className="text-5xl font-black leading-tight lg:text-7xl">
        Build Your

        <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
          Dream Career
        </span>

        With Artificial Intelligence
      </h1>

      <p className="mt-8 max-w-xl text-lg leading-8 text-white/70">
        AI Resume Builder, ATS Optimization,
        Interview Preparation and Smart Job Matching
        in one modern platform.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <Button className="h-12 rounded-xl px-8">
          Start Free

          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          className="h-12 rounded-xl border-white/10 bg-white/5 backdrop-blur-xl"
        >
          <PlayCircle className="mr-2 h-5 w-5" />

          Watch Demo
        </Button>
      </div>
    </motion.div>
  );
}