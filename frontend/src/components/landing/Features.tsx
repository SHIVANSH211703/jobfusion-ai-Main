"use client";

import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Briefcase,
  CheckCircle2,
  FileText,
  Route,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28 lg:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Product Capabilities</span>
          </div>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Everything You Need for a Modern Career Search
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Purpose-built tools that turn career planning, resume tailoring, and job applications into a single intelligent workflow.
          </p>
        </motion.div>

        {/* Feature Grid: Editorial & Asymmetric Showcase */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Resume Intelligence & ATS (Wide) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-border bg-card p-6 shadow-xs lg:col-span-2 sm:p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <FileText className="h-5 w-5" />
                </div>
                <Badge variant="intelligence">ATS Optimized</Badge>
              </div>
              <h3 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
                Resume Intelligence & ATS Optimization
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base max-w-xl">
                Scan your resume against real role algorithms. Detect missing keywords, measure formatting compliance, and receive instant rewrite recommendations.
              </p>
            </div>

            {/* Illustrative Product Widget */}
            <div className="mt-6 rounded-2xl border border-border bg-secondary/50 p-4 sm:p-5">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                <span>ATS Analysis Output</span>
                <span className="text-emerald-600 font-bold">94 / 100 Score</span>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 mt-3">
                <div className="rounded-xl border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Keyword Coverage</p>
                  <p className="text-lg font-bold text-foreground mt-0.5">92%</p>
                  <div className="h-1.5 w-full bg-muted rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[92%]" />
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Impact Metrics</p>
                  <p className="text-lg font-bold text-foreground mt-0.5">88%</p>
                  <div className="h-1.5 w-full bg-muted rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-accent rounded-full w-[88%]" />
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Format Readability</p>
                  <p className="text-lg font-bold text-foreground mt-0.5">98%</p>
                  <div className="h-1.5 w-full bg-muted rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[98%]" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: AI Job Matching */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-border bg-card p-6 shadow-xs sm:p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent border border-accent/20">
                  <Briefcase className="h-5 w-5" />
                </div>
                <Badge variant="default">91% Precision</Badge>
              </div>
              <h3 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
                AI Job Matching
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Match verified live postings based on your real experience and skills, not generic keyword search.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-secondary/50 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-foreground">Staff Frontend Engineer</p>
                  <p className="text-[11px] text-muted-foreground">Global Tech Corp • Remote</p>
                </div>
                <span className="rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-2 py-0.5">
                  91% Match
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-md bg-card border border-border px-2 py-0.5 text-[10px] text-muted-foreground">Next.js</span>
                <span className="rounded-md bg-card border border-border px-2 py-0.5 text-[10px] text-muted-foreground">TypeScript</span>
                <span className="rounded-md bg-card border border-border px-2 py-0.5 text-[10px] text-muted-foreground">Architecture</span>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Application Tracking Pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="rounded-3xl border border-border bg-card p-6 shadow-xs sm:p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <Badge variant="outline">Pipeline</Badge>
              </div>
              <h3 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
                Application Lifecycle Tracking
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Move candidates effortlessly through Applied, Screening, Interview, and Offer stages.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-secondary/50 p-3 space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-card border border-border px-3 py-2 text-xs">
                <span className="font-semibold text-foreground">Applied</span>
                <span className="font-bold text-primary">12</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-card border border-border px-3 py-2 text-xs">
                <span className="font-semibold text-foreground">Screening</span>
                <span className="font-bold text-accent">5</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-card border border-border px-3 py-2 text-xs">
                <span className="font-semibold text-foreground">Interviews</span>
                <span className="font-bold text-emerald-600">3 Scheduled</span>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Interview Preparation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-border bg-card p-6 shadow-xs sm:p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent border border-accent/20">
                  <Bot className="h-5 w-5" />
                </div>
                <Badge variant="intelligence">AI Coach</Badge>
              </div>
              <h3 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
                AI Interview Preparation
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Generate tailored technical and behavioral questions mapped directly to the job description and your resume.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-secondary/50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Custom Question Generator</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed italic bg-card p-2.5 rounded-xl border border-border">
                &ldquo;Describe how you scaled React performance for high-traffic enterprise applications.&rdquo;
              </p>
            </div>
          </motion.div>

          {/* Card 5: Career Intelligence Roadmap (Wide) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="rounded-3xl border border-border bg-card p-6 shadow-xs lg:col-span-3 sm:p-8 flex flex-col justify-between"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <Route className="h-5 w-5" />
                  </div>
                  <Badge variant="default">Career Intelligence</Badge>
                </div>
                <h3 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
                  Skill Gap & Career Roadmap
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-2xl">
                  Benchmark your current profile against senior roles. Identify high-leverage skills to learn and follow a generated milestone plan.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-xl border border-border bg-secondary/60 px-4 py-2.5">
                  <p className="text-[10px] font-semibold uppercase text-muted-foreground">Target Role</p>
                  <p className="text-sm font-bold text-foreground">Engineering Manager</p>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5">
                  <p className="text-[10px] font-semibold uppercase text-emerald-700 dark:text-emerald-300">Ready Skills</p>
                  <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">8 of 10 matched</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}