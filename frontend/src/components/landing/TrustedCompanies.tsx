"use client";

import { motion } from "framer-motion";
import Container from "@/components/layout/Container";

const stats = [
  {
    value: "10K+",
    label: "Active Users",
  },
  {
    value: "500K+",
    label: "Resumes Created",
  },
  {
    value: "95%",
    label: "ATS Success Rate",
  },
  {
    value: "120+",
    label: "Hiring Partners",
  },
];

const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Netflix",
  "Adobe",
];

export default function TrustedCompanies() {
  return (
    <section className="relative py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-12 text-center text-sm uppercase tracking-[0.4em] text-white/50">
            Trusted by developers & companies
          </p>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {companies.map((company) => (
              <div
                key={company}
                className="flex h-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg font-semibold text-white/70 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/10"
              >
                {company}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
              }}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl"
            >
              <h3 className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-4xl font-black text-transparent">
                {item.value}
              </h3>

              <p className="mt-3 text-white/60">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}