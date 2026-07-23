"use client";

import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started.",
    features: [
      "1 AI Resume",
      "ATS Score",
      "Resume Templates",
      "Basic Analytics",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    description: "For professionals serious about their career.",
    features: [
      "Unlimited Resumes",
      "AI Resume Builder",
      "AI Interview Coach",
      "ATS Optimization",
      "Resume Analyzer",
      "Priority Support",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For universities and organizations.",
    features: [
      "Everything in Pro",
      "Dedicated Workspace",
      "Admin Dashboard",
      "API Access",
      "SSO",
      "Priority Success Manager",
    ],
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative py-32"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-5 py-2 text-sm text-violet-300">
            <Sparkles className="h-4 w-4" />
            Pricing
          </div>

          <h2 className="mt-8 text-5xl font-black md:text-6xl">
            Simple &
            <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Transparent Pricing
            </span>
          </h2>

          <p className="mt-6 text-lg text-white/60">
            Choose a plan that matches your career goals.
          </p>
        </motion.div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className={`relative overflow-hidden rounded-[32px] border p-8 backdrop-blur-xl ${
                plan.highlighted
                  ? "border-violet-500/50 bg-gradient-to-b from-violet-500/15 to-cyan-500/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-1 text-xs font-semibold">
                  Most Popular
                </div>
              )}

              <h3 className="text-3xl font-bold">
                {plan.name}
              </h3>

              <p className="mt-3 text-white/60">
                {plan.description}
              </p>

              <div className="mt-8 flex items-end gap-2">
                <span className="text-6xl font-black">
                  {plan.price}
                </span>

                {plan.price !== "Custom" && (
                  <span className="pb-2 text-white/50">
                    /month
                  </span>
                )}
              </div>

              <button
                className={`mt-8 w-full rounded-2xl py-4 font-semibold transition ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:opacity-90"
                    : "border border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                Get Started
              </button>

              <div className="mt-10 space-y-4">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <Check className="h-5 w-5 text-emerald-400" />
                    <span className="text-white/70">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center text-white/40">
          No credit card required • Cancel anytime • Secure payments
        </div>
      </Container>
    </section>
  );
}