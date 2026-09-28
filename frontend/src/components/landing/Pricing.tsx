"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "$0",
    description: "Essential career tools for focused job seekers starting their next search.",
    features: [
      "1 Optimized Resume Profile",
      "Core ATS Score Analysis",
      "Job Discovery & Search",
      "Application Tracker (Up to 10)",
    ],
    highlighted: false,
    cta: "Start Free",
    href: "/register",
  },
  {
    name: "Professional",
    price: "$19",
    description: "Full intelligence suite for candidates aiming for top-tier competitive offers.",
    features: [
      "Unlimited Resume Versions",
      "Deep ATS Optimization & Keyword Gaps",
      "AI Resume Tailoring per Job",
      "Unlimited Application Lifecycle Pipeline",
      "AI Interview Question Prep",
      "Career Intelligence Roadmap",
    ],
    highlighted: true,
    cta: "Upgrade to Pro",
    href: "/register",
  },
  {
    name: "Executive & Teams",
    price: "$49",
    description: "Advanced roadmap tracking, career coaching integrations, and priority queue.",
    features: [
      "Everything in Professional",
      "Priority AI Generation Limits",
      "Executive Career Gap Benchmark",
      "Direct Export & PDF Styling",
      "Dedicated Career Support",
    ],
    highlighted: false,
    cta: "Get Executive",
    href: "/register",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-20 sm:py-28 lg:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Transparent Pricing</span>
          </div>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Invest in Your Next Career Move
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Choose the plan that fits where you are today. Upgrade or change anytime.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-3xl border p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.highlighted
                  ? "border-primary bg-card shadow-xl ring-2 ring-primary/20 relative"
                  : "border-border bg-card shadow-xs hover:border-border/80"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed min-h-[36px]">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground tracking-tight">{plan.price}</span>
                  {plan.price !== "$0" && <span className="text-sm font-medium text-muted-foreground">/month</span>}
                </div>

                <div className="mt-6">
                  <Link href={plan.href} className="w-full block">
                    <Button
                      variant={plan.highlighted ? "default" : "outline"}
                      className="w-full font-semibold shadow-xs"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 space-y-3 border-t border-border pt-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground">Includes:</p>
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}