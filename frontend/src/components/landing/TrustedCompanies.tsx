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
  {
    name: "Google",
    icon: Globe2,
  },
  {
    name: "Microsoft",
    icon: Building2,
  },
  {
    name: "Amazon",
    icon: BriefcaseBusiness,
  },
  {
    name: "Meta",
    icon: Layers3,
  },
  {
    name: "OpenAI",
    icon: Sparkles,
  },
  {
    name: "NVIDIA",
    icon: Cpu,
  },
];

const stats = [
  {
    value: "10K+",
    label: "Active Users",
  },
  {
    value: "500K+",
    label: "Resumes Generated",
  },
  {
    value: "95%",
    label: "ATS Success",
  },
  {
    value: "120+",
    label: "Hiring Partners",
  },
];

export default function TrustedCompanies() {
  return (
    <section className="relative py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-center text-sm uppercase tracking-[0.45em] text-white/45">
            Trusted by professionals worldwide
          </p>

          {/* Companies */}

          <div className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
            {companies.map((company, index) => {
              const Icon = company.icon;

              return (
                <motion.div
                  key={company.name}
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  viewport={{
                    once: true,
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                  }}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl transition"
                >
                  <Icon className="mx-auto h-10 w-10 text-white/50 transition group-hover:text-violet-400" />

                  <p className="mt-5 text-center font-semibold text-white/75">
                    {company.name}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Stats */}

          <div className="mt-24 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.12,
                }}
                whileHover={{
                  y: -6,
                }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl"
              >
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />

                <h2 className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-5xl font-black text-transparent">
                  {item.value}
                </h2>

                <p className="mt-3 text-white/60">
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