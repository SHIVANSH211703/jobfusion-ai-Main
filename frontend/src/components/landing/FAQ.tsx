"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/layout/Container";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How does the AI resume builder and ATS score work?",
    answer: "Our system evaluates your resume structure, keyword distribution, and experience bullets against modern Applicant Tracking System (ATS) parsers and hiring guidelines, providing concrete scores and bullet-by-bullet improvement tips.",
  },
  {
    question: "Can I upload my existing PDF or Word resume?",
    answer: "Yes, you can upload existing documents in PDF or DOCX formats. JobFusion extracts your work history, education, and skills while preserving your historical versions.",
  },
  {
    question: "What makes Job Matching different from standard search engines?",
    answer: "Rather than simple title searches, JobFusion calculates multi-dimensional compatibility across your verified skills, experience depth, preferred compensation, and location.",
  },
  {
    question: "How does the Application Tracking Pipeline function?",
    answer: "Whenever you apply or track a job, you can organize it across stages: Applied, Screening, Interview, and Offer. Add notes, link your specific resume version, and record interview feedback.",
  },
  {
    question: "What is the Career Intelligence Roadmap?",
    answer: "Career Intelligence lets you select an aspirational role (e.g., Staff Engineer, VP of Product). It analyzes gaps between your current resume and senior market requirements, producing step-by-step milestones to close those gaps.",
  },
  {
    question: "Can I cancel or change my plan anytime?",
    answer: "Yes, you can upgrade, downgrade, or cancel your subscription at any time with no lock-in periods or cancellation fees.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 sm:py-28 lg:py-32 bg-secondary/20 border-t border-border">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Common Inquiries</span>
          </div>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Everything you need to know about the platform, ATS optimization, and career intelligence.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl space-y-3">
          {faqs.map((faq, index) => {
            const expanded = open === index;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xs transition-colors"
              >
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-foreground hover:text-primary transition-colors cursor-pointer select-none"
                >
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="px-5 pb-5 text-xs sm:text-sm leading-relaxed text-muted-foreground border-t border-border/50 pt-3">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}