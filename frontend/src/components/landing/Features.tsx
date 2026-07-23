"use client";

import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import {
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  FileText,
  Sparkles,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";

const cards = [
  {
    title: "AI Resume Builder",
    description:
      "Generate ATS-friendly resumes with AI suggestions tailored to every job.",
    icon: FileText,
    className: "lg:col-span-2 lg:row-span-2",
    gradient: "from-violet-600/20 to-fuchsia-500/10",
  },
  {
    title: "Smart Job Matching",
    description:
      "Find opportunities that match your skills instantly.",
    icon: BriefcaseBusiness,
    className: "",
    gradient: "from-cyan-500/20 to-sky-500/10",
  },
  {
    title: "AI Interview Coach",
    description:
      "Practice HR & technical interviews with instant AI feedback.",
    icon: Bot,
    className: "",
    gradient: "from-pink-500/20 to-rose-500/10",
  },
  {
    title: "Resume Analyzer",
    description:
      "Boost your ATS score with personalized recommendations.",
    icon: BrainCircuit,
    className: "",
    gradient: "from-emerald-500/20 to-teal-500/10",
  },
  {
    title: "Career Analytics",
    description:
      "Track applications, interviews and career growth with beautiful insights.",
    icon: BarChart3,
    className: "lg:col-span-2",
    gradient: "from-orange-500/20 to-yellow-500/10",
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
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-5 py-2 text-sm text-violet-300">
            <Sparkles className="h-4 w-4" />
            Platform Features
          </div>

          <h2 className="mt-8 text-5xl font-black md:text-6xl">
            Everything You Need
            <span className="mt-2 block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              To Get Hired Faster
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/60">
            JobFusion AI combines resume creation, interview preparation,
            ATS optimization, analytics and smart job discovery into one
            intelligent platform.
          </p>
        </motion.div>

        <div className="mt-20 grid auto-rows-[260px] gap-6 lg:grid-cols-3">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
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
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -8,
                }}
                className={`group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl ${card.className}`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`}
                />

                <div className="relative flex h-full flex-col justify-between p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    <ArrowUpRight className="h-6 w-6 text-white/30 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" />
                  </div>

                  <div>
                    <h3 className="text-3xl font-bold">
                      {card.title}
                    </h3>

                    <p className="mt-4 max-w-md leading-7 text-white/65">
                      {card.description}
                    </p>
                  </div>

                  {card.title === "AI Resume Builder" && (
                    <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm text-white/60">
                          ATS Score
                        </span>

                        <span className="font-bold text-emerald-400">
                          94%
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          whileInView={{
                            width: "94%",
                          }}
                          transition={{
                            duration: 1.4,
                          }}
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
                        />
                      </div>
                    </div>
                  )}

                  {card.title === "Career Analytics" && (
                    <div className="mt-6 flex gap-4">
                      <div className="flex-1 rounded-2xl bg-white/10 p-4">
                        <p className="text-xs text-white/50">
                          Applications
                        </p>

                        <h4 className="mt-2 text-3xl font-black text-cyan-400">
                          128
                        </h4>
                      </div>

                      <div className="flex-1 rounded-2xl bg-white/10 p-4">
                        <p className="text-xs text-white/50">
                          Interviews
                        </p>

                        <h4 className="mt-2 text-3xl font-black text-violet-400">
                          21
                        </h4>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}