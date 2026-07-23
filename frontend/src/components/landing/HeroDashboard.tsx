"use client";

import { motion } from "framer-motion";
import {
  FileText,
  BriefcaseBusiness,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

export default function HeroDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative"
    >
      {/* Glow */}
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-violet-600/20 to-cyan-500/20 blur-3xl" />

      <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">

        <div className="mb-8 flex items-center justify-between">

          <h3 className="text-xl font-bold">
            AI Dashboard
          </h3>

          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
            LIVE
          </span>

        </div>

        <div className="space-y-5">

          <DashboardCard
            icon={<FileText size={20} />}
            title="Resume Score"
            value="94%"
            color="text-emerald-400"
          />

          <DashboardCard
            icon={<BriefcaseBusiness size={20} />}
            title="Matched Jobs"
            value="126"
            color="text-cyan-400"
          />

          <DashboardCard
            icon={<TrendingUp size={20} />}
            title="ATS Success"
            value="98%"
            color="text-violet-400"
          />

          <div className="rounded-2xl bg-white/5 p-5">

            <div className="mb-3 flex items-center gap-2">

              <CheckCircle2
                className="text-emerald-400"
                size={18}
              />

              <p className="text-sm text-white/70">
                Interview Readiness
              </p>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/10">

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "87%" }}
                transition={{ duration: 1.5 }}
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
              />

            </div>

            <p className="mt-3 text-right text-sm text-white/60">
              87%
            </p>

          </div>

        </div>

      </div>
    </motion.div>
  );
}

type DashboardCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
};

function DashboardCard({
  icon,
  title,
  value,
  color,
}: DashboardCardProps) {
  return (
    <div className="rounded-2xl bg-white/5 p-5 transition hover:bg-white/10">

      <div className="mb-3 flex items-center gap-3 text-white/70">

        {icon}

        <span>{title}</span>

      </div>

      <h2 className={`text-5xl font-black ${color}`}>
        {value}
      </h2>

    </div>
  );
}