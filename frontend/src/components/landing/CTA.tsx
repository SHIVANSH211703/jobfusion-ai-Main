"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-primary/20 bg-[#0B1220] p-5 sm:p-12 lg:p-16 text-center text-white shadow-xl"
        >
          <div className="absolute inset-0 bg-radial-[at_top_right] from-primary/20 via-transparent to-transparent pointer-events-none" />

          <div className="relative max-w-2xl mx-auto space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>Take Control of Your Career</span>
            </div>

            <h2 className="text-2xl xs:text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white break-words">
              Build a Stronger Career Strategy Today
            </h2>

            <p className="text-xs sm:text-base leading-relaxed text-slate-300">
              Join forward-thinking engineers, designers, and product leaders who use JobFusion AI to find opportunities faster with data-backed resumes.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto font-semibold bg-primary hover:bg-primary/90 text-white shadow-md gap-2 justify-center">
                  <span>Get Started for Free</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold text-white border-white/20 hover:bg-white/10 hover:text-white justify-center">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}