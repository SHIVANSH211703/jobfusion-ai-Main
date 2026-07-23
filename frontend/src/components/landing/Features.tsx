"use client";

import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import {
  FileText,
  Brain,
  BriefcaseBusiness,
  Bot,
  BarChart3,
  Sparkles,
} from "lucide-react";

const features = [
  {
    title: "AI Resume Builder",
    description:
      "Create ATS-friendly resumes in minutes using AI-powered suggestions.",
    icon: FileText,
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    title: "Smart Job Matching",
    description:
      "Discover jobs perfectly matched to your skills and experience.",
    icon: BriefcaseBusiness,
    gradient: "from-cyan-500 to-sky-500",
  },
  {
    title: "Resume Analyzer",
    description:
      "Improve your resume score and increase interview chances.",
    icon: Brain,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "AI Interview",
    description:
      "Practice technical and HR interviews with an AI interviewer.",
    icon: Bot,
    gradient: "from-pink-500 to-rose-500",
  },
  {
    title: "Career Analytics",
    description:
      "Track applications, interviews and career progress.",
    icon: BarChart3,
    gradient: "from-orange-500 to-yellow-500",
  },
  {
    title: "Cover Letter Generator",
    description:
      "Generate personalized cover letters in seconds.",
    icon: Sparkles,
    gradient: "from-indigo-500 to-violet-500",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative py-32"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            Features
          </span>

          <h2 className="mt-6 text-4xl font-black md:text-6xl">
            Everything You Need
            <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              To Get Hired Faster
            </span>
          </h2>

          <p className="mt-6 max-w-3xl text-lg text-white/60">
            JobFusion AI combines resume creation, AI career coaching,
            interview preparation and job matching into one modern platform.
          </p>
        </motion.div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{
                  opacity: 0,
                  y: 50,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -10,
                }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
              >
                <div
                  className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient}`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-white/60">
                  {feature.description}
                </p>

                <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                  <div
                    className={`absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br ${feature.gradient} opacity-10 blur-3xl`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}