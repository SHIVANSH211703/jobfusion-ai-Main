"use client";

import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Sarah Johnson", role: "Software Engineer", company: "Google", review: "The resume rewrites were sharp, relevant, and immediately gave me more confidence in every application." },
  { name: "Michael Chen", role: "Frontend Developer", company: "Microsoft", review: "I went from scattered job applications to a focused process with clear wins and measurable momentum." },
  { name: "Emily Davis", role: "Product Designer", company: "Adobe", review: "The ATS feedback made the difference. It was the first time my resume actually reflected my value." },
  { name: "David Wilson", role: "Backend Engineer", company: "Amazon", review: "The tool feels premium, but the real benefit is how much more targeted and efficient my search became." },
  { name: "Sophia Brown", role: "Data Analyst", company: "Meta", review: "Everything from matching to tracking felt designed around real career decisions, not generic templates." },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative overflow-hidden py-24 sm:py-28 lg:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-xs">
            Candidate Success
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Trusted by candidates focused on
            <span className="mt-2 block text-muted-foreground">serious career growth.</span>
          </h2>
        </div>

        <div className="relative mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
            className="flex gap-5"
          >
            {[...testimonials, ...testimonials].map((item, index) => (
              <article
                key={index}
                className="min-w-[320px] rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md sm:min-w-[360px]"
              >
                <div className="flex gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  “{item.review}”
                </p>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.role} • {item.company}
                  </p>
                </div>
              </article>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}