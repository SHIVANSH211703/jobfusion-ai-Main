"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  UserCircle2,
} from "lucide-react";

const applications = [
  {
    company: "Google",
    role: "Frontend Engineer",
    status: "Interview",
    color: "bg-emerald-500",
  },
  {
    company: "Microsoft",
    role: "Software Engineer",
    status: "Applied",
    color: "bg-cyan-500",
  },
  {
    company: "Amazon",
    role: "SDE I",
    status: "Review",
    color: "bg-violet-500",
  },
];

export default function HeroDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative"
    >
      {/* Background Glow */}

      <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-r from-violet-600/20 via-fuchsia-500/10 to-cyan-500/20 blur-3xl" />

      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-7 shadow-2xl backdrop-blur-3xl">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-white/50">
              Welcome back
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Shivansh 👋
            </h2>

          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
            AI Online
          </div>

        </div>

        {/* Score */}

        <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-cyan-500/10 p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-white/60">
                Resume Score
              </p>

              <h2 className="mt-2 text-6xl font-black">
                94%
              </h2>

            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
              <TrendingUp className="h-8 w-8 text-cyan-400" />
            </div>

          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "94%" }}
              transition={{ duration: 1.6 }}
              className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400"
            />

          </div>

        </div>

        {/* Stats */}

        <div className="mt-6 grid grid-cols-3 gap-4">

          <StatCard
            icon={<BriefcaseBusiness className="h-5 w-5" />}
            title="Jobs"
            value="126"
            color="text-cyan-400"
          />

          <StatCard
            icon={<BrainCircuit className="h-5 w-5" />}
            title="AI Tips"
            value="48"
            color="text-violet-400"
          />

          <StatCard
            icon={<Sparkles className="h-5 w-5" />}
            title="Matches"
            value="91%"
            color="text-emerald-400"
          />

        </div>

        {/* Recent Applications */}

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">

          <div className="mb-5 flex items-center justify-between">

            <h3 className="font-semibold">
              Recent Applications
            </h3>

            <UserCircle2 className="h-5 w-5 text-white/50" />

          </div>

          <div className="space-y-4">

            {applications.map((item) => (

              <motion.div
                key={item.company}
                whileHover={{
                  x: 5,
                }}
                className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3"
              >

                <div>

                  <h4 className="font-semibold">
                    {item.company}
                  </h4>

                  <p className="text-sm text-white/50">
                    {item.role}
                  </p>

                </div>

                <div className="flex items-center gap-2">

                  <span
                    className={`h-2.5 w-2.5 rounded-full ${item.color}`}
                  />

                  <span className="text-sm text-white/70">
                    {item.status}
                  </span>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

        {/* AI Insight */}

        <motion.div
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="mt-6 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-5"
        >

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20">

              <CheckCircle2 className="h-6 w-6 text-cyan-400" />

            </div>

            <div>

              <h4 className="font-semibold">
                AI Recommendation
              </h4>

              <p className="mt-2 text-sm leading-7 text-white/65">
                Your resume is highly optimized.
                Add two React projects and one
                system design project to increase
                interview probability by nearly 18%.
              </p>

            </div>

          </div>

        </motion.div>

      </div>
    </motion.div>
  );
}

type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
};

function StatCard({
  icon,
  title,
  value,
  color,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      className="rounded-2xl border border-white/10 bg-white/5 p-4"
    >

      <div className="mb-4 flex items-center justify-between">

        <div className={color}>
          {icon}
        </div>

        <span className="text-xs text-white/40">
          Live
        </span>

      </div>

      <p className="text-sm text-white/50">
        {title}
      </p>

      <h3 className={`mt-2 text-3xl font-black ${color}`}>
        {value}
      </h3>

    </motion.div>
  );
}