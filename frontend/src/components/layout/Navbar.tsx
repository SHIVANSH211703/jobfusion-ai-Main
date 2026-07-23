"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Container from "./Container";

const navLinks = [
  {
    title: "Features",
    href: "#features",
  },
  {
    title: "AI",
    href: "#ai",
  },
  {
    title: "Pricing",
    href: "#pricing",
  },
  {
    title: "Contact",
    href: "#contact",
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <Container>
        <motion.nav
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6 }}
          className={`mt-5 transition-all duration-300 ${
            scrolled
              ? "rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur-2xl shadow-2xl"
              : "rounded-2xl bg-transparent"
          }`}
        >
          <div className="flex h-16 items-center justify-between px-6">

            <Link href="/">
              <div className="flex items-center gap-2">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-400">

                  <Sparkles className="h-5 w-5 text-white"/>

                </div>

                <div>

                  <h2 className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-2xl font-black text-transparent">

                    JobFusion AI

                  </h2>

                </div>

              </div>
            </Link>

            <div className="hidden items-center gap-8 lg:flex">
              {navLinks.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group relative text-sm font-medium text-white/70 transition hover:text-white"
                >
                  {item.title}

                  <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300 group-hover:w-full"/>
                </Link>
              ))}
            </div>

            <div className="hidden items-center gap-3 lg:flex">

              <Button
                variant="ghost"
                className="rounded-xl text-white hover:bg-white/10"
              >
                Login
              </Button>

              <Button className="rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 px-6 shadow-lg shadow-violet-500/30 transition hover:scale-105">

                Get Started

              </Button>

            </div>

            <button
              className="lg:hidden"
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <X className="text-white"/>
              ) : (
                <Menu className="text-white"/>
              )}
            </button>

          </div>

          <AnimatePresence>

            {open && (

              <motion.div
                initial={{
                  opacity:0,
                  height:0
                }}
                animate={{
                  opacity:1,
                  height:"auto"
                }}
                exit={{
                  opacity:0,
                  height:0
                }}
                className="overflow-hidden lg:hidden"
              >

                <div className="space-y-5 border-t border-white/10 px-6 py-6">

                  {navLinks.map((item)=>(

                    <Link
                      key={item.title}
                      href={item.href}
                      className="block text-white/70 hover:text-white"
                    >
                      {item.title}
                    </Link>

                  ))}

                  <Button className="w-full rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500">

                    Get Started

                  </Button>

                </div>

              </motion.div>

            )}

          </AnimatePresence>

        </motion.nav>
      </Container>
    </header>
  );
}