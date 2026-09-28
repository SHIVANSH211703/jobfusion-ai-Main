"use client";

import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import {
  Building2,
  Cpu,
  BriefcaseBusiness,
  Globe2,
  Layers3,
  Sparkles,
} from "lucide-react";

const companies = [
  { name: "Google", icon: Globe2 },
  { name: "Microsoft", icon: Building2 },
  { name: "Amazon", icon: BriefcaseBusiness },
  { name: "Meta", icon: Layers3 },
  { name: "OpenAI", icon: Sparkles },
  { name: "NVIDIA", icon: Cpu },
];

const stats = [
  { value: "10K+", label: "Active Job Seekers" },
  { value: "500K+", label: "Resumes Optimized" },
  { value: "95%", label: "Average ATS Pass Rate" },
  { value: "120+", label: "Hiring Partners" },
];

export default function TrustedCompanies() {
  return (
    <section className="relative border-y border-border/60 bg-muted/20 py-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
            Trusted by candidates hired across leading tech teams
          </p>

          {/* Companies Grid */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {companies.map((company, index) => {
              const Icon = company.icon;

              return (
                <motion.div
                  key={company.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -3 }}
                  className="group flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/30 hover:shadow-sm"
                >
                  <Icon className="h-7 w-7 text-muted-foreground/70 transition-colors group-hover:text-primary" />
                  <p className="mt-3 text-xs font-semibold text-muted-foreground transition-colors group-hover:text-foreground">
                    {company.name}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Stats Grid */}
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -3 }}
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs"
              >
                <div className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                  {item.value}
                </div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}