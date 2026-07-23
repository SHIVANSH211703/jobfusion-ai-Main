"use client";

import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import {
  Upload,
  BrainCircuit,
  Sparkles,
  Rocket,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Upload Resume",
    description:
      "Import your existing resume or create one from scratch with our AI-powered builder.",
    icon: Upload,
  },
  {
    number: "02",
    title: "AI Analysis",
    description:
      "Our AI evaluates your resume against ATS systems and hiring best practices.",
    icon: BrainCircuit,
  },
  {
    number: "03",
    title: "Optimize",
    description:
      "Receive personalized improvements, keyword suggestions, and formatting upgrades.",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "Apply Smarter",
    description:
      "Export your optimized resume and confidently apply to your dream companies.",
    icon: Rocket,
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-5 py-2 text-sm text-violet-300">
            How It Works
          </div>

          <h2 className="mt-8 text-5xl font-black md:text-6xl">
            Get Hired in
            <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Four Simple Steps
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-white/60">
            From resume creation to landing interviews, JobFusion AI helps
            you through every stage of your career journey.
          </p>
        </motion.div>

        <div className="relative mt-24">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-violet-500/50 via-cyan-500/30 to-transparent lg:block" />

          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12 }}
                  className={`flex flex-col items-center gap-10 lg:flex-row ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
                      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500">
                        <Icon className="h-8 w-8 text-white" />
                      </div>

                      <span className="text-sm font-semibold tracking-[0.25em] text-violet-300">
                        STEP {step.number}
                      </span>

                      <h3 className="mt-3 text-3xl font-bold">
                        {step.title}
                      </h3>

                      <p className="mt-4 leading-7 text-white/60">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 hidden h-8 w-8 rounded-full border-4 border-slate-950 bg-gradient-to-br from-violet-500 to-cyan-500 lg:block" />

                  <div className="hidden flex-1 lg:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}