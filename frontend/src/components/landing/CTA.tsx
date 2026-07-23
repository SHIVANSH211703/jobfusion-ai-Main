"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-32">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[180px]" />

        <div className="absolute right-0 top-0 h-[350px] w-[350px] rounded-full bg-cyan-500/20 blur-[150px]" />

        <div className="absolute left-0 bottom-0 h-[350px] w-[350px] rounded-full bg-fuchsia-500/20 blur-[150px]" />
      </div>

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-2xl md:p-20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-5 py-2 text-sm text-violet-300">
              <Sparkles className="h-4 w-4" />
              Start Today
            </div>

            <h2 className="mx-auto mt-8 max-w-4xl text-5xl font-black leading-tight md:text-7xl">
              Land Your
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                {" "}Dream Job{" "}
              </span>
              Faster With AI
            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/60">
              Build ATS-friendly resumes, prepare for interviews, optimize your
              applications, and track your career growth—all in one place.
            </p>

            <div className="mt-12 flex flex-col justify-center gap-5 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-4 font-semibold text-white transition hover:scale-105"
              >
                Get Started Free

                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="/login"
                className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-semibold transition hover:bg-white/10"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-white/40">
              <span>✓ Free Forever Plan</span>
              <span>✓ No Credit Card</span>
              <span>✓ ATS Optimized</span>
              <span>✓ AI Powered</span>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}