"use client";

import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "Google",
    review:
      "JobFusion AI completely transformed my resume. I started getting interview calls within a week.",
  },
  {
    name: "Michael Chen",
    role: "Frontend Developer",
    company: "Microsoft",
    review:
      "The ATS optimization alone is worth it. My resume score jumped from 58% to 96%.",
  },
  {
    name: "Emily Davis",
    role: "Product Designer",
    company: "Adobe",
    review:
      "The AI interview coach gave me confidence before every interview. Highly recommended.",
  },
  {
    name: "David Wilson",
    role: "Backend Engineer",
    company: "Amazon",
    review:
      "Beautiful UI, powerful AI, and everything is incredibly easy to use.",
  },
  {
    name: "Sophia Brown",
    role: "Data Analyst",
    company: "Meta",
    review:
      "This is the best resume platform I've ever used. Everything feels premium.",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative py-32 overflow-hidden"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-5 py-2 text-sm text-violet-300">
            Testimonials
          </div>

          <h2 className="mt-8 text-5xl font-black md:text-6xl">
            Loved by
            <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Professionals
            </span>
          </h2>

          <p className="mt-6 text-lg text-white/60">
            Thousands of professionals trust JobFusion AI to improve their
            resumes and land better opportunities.
          </p>
        </div>

        <div className="relative mt-20 overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              duration: 35,
              ease: "linear",
            }}
            className="flex gap-6"
          >
            {[...testimonials, ...testimonials].map((item, index) => (
              <div
                key={index}
                className="min-w-[360px] rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
              >
                <div className="mb-5 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="leading-8 text-white/70">
                  "{item.review}"
                </p>

                <div className="mt-8">
                  <h3 className="font-bold text-lg">
                    {item.name}
                  </h3>

                  <p className="text-sm text-white/50">
                    {item.role} • {item.company}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}