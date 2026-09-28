"use client";

import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import { BrainCircuit, CheckCircle2, FileText, Rocket, Search, Sparkles, UserCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Build your profile",
    description: "Set your target role, experience level, location preferences, and core technical skills.",
    icon: UserCheck,
  },
  {
    number: "02",
    title: "Upload & optimize your resume",
    description: "Scan against ATS algorithms, identify keyword gaps, and tailor bullet points with AI assistance.",
    icon: FileText,
  },
  {
    number: "03",
    title: "Discover matching jobs",
    description: "Explore verified opportunities scored by true skill match, salary range, and culture alignment.",
    icon: Search,
  },
  {
    number: "04",
    title: "Apply and track progress",
    description: "Manage applications across Applied, Screening, Interview, and Offer stages in one command center.",
    icon: Rocket,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-28 lg:py-32 bg-secondary/30 border-y border-border">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Structured Process</span>
          </div>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            A Clear Workflow From Resume to Offer
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Stop juggling spreadsheets and disparate job boards. JobFusion unifies your search into 4 straightforward stages.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm border border-primary/20">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-2xl font-extrabold text-muted-foreground/30 font-mono">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Step {step.number} Complete</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}