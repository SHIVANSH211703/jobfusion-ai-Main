"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/layout/Container";
import { ChevronDown, Sparkles } from "lucide-react";

const faqs = [
  {
    question: "How does the AI resume builder work?",
    answer:
      "Our AI analyzes your experience, skills, and target role to generate a modern, ATS-friendly resume with optimized keywords and formatting.",
  },
  {
    question: "Can I upload my existing resume?",
    answer:
      "Yes. Upload your resume in PDF or DOCX format, and our AI will analyze it, improve it, and provide an ATS score with personalized suggestions.",
  },
  {
    question: "What is an ATS score?",
    answer:
      "An ATS score estimates how well your resume matches Applicant Tracking Systems used by recruiters. A higher score increases your chances of passing the initial screening.",
  },
  {
    question: "Do you support interview preparation?",
    answer:
      "Yes. Practice technical and HR interviews with AI-generated questions, instant feedback, and improvement suggestions.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely. You can upgrade, downgrade, or cancel your subscription whenever you want.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative py-32"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-5 py-2 text-sm text-violet-300">
            <Sparkles className="h-4 w-4" />
            FAQ
          </div>

          <h2 className="mt-8 text-5xl font-black md:text-6xl">
            Frequently Asked
            <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>

          <p className="mt-6 text-lg text-white/60">
            Everything you need to know before getting started.
          </p>
        </div>

        <div className="mx-auto mt-20 max-w-4xl space-y-5">
          {faqs.map((faq, index) => {
            const expanded = open === index;

            return (
              <motion.div
                key={faq.question}
                layout
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
              >
                <button
                  onClick={() =>
                    setOpen(expanded ? null : index)
                  }
                  className="flex w-full items-center justify-between px-8 py-7 text-left"
                >
                  <span className="text-lg font-semibold">
                    {faq.question}
                  </span>

                  <motion.div
                    animate={{
                      rotate: expanded ? 180 : 0,
                    }}
                  >
                    <ChevronDown />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                    >
                      <p className="px-8 pb-8 leading-8 text-white/60">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}