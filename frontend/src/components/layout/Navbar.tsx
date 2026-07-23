"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "./Container";

const navLinks = [
  { title: "Features", href: "#features" },
  { title: "Pricing", href: "#pricing" },
  { title: "Testimonials", href: "#testimonials" },
  { title: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      let current = "";

      navLinks.forEach((item) => {
        const section = document.querySelector(item.href);

        if (!section) return;

        const top = (section as HTMLElement).offsetTop - 120;

        if (window.scrollY >= top) {
          current = item.href;
        }
      });

      setActive(current);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();

    setOpen(false);

    const section = document.querySelector(href);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <Container>
        <motion.nav
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`mt-5 transition-all duration-300 ${
            scrolled
              ? "rounded-2xl border border-white/10 bg-slate-950/65 shadow-2xl shadow-violet-950/40 backdrop-blur-3xl"
              : "rounded-2xl border border-transparent bg-transparent"
          }`}
        >
          <div className="flex h-16 items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.05 }}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-400 shadow-lg shadow-violet-500/40"
              >
                <Sparkles className="h-5 w-5 text-white" />
              </motion.div>

              <div>
                <h2 className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-xl font-black text-transparent">
                  JobFusion AI
                </h2>

                <p className="-mt-1 text-[11px] uppercase tracking-[0.35em] text-white/40">
                  AI Career Platform
                </p>
              </div>
            </Link>

            <div className="hidden items-center gap-8 lg:flex">
              {navLinks.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className="relative text-sm font-medium text-white/65 transition hover:text-white"
                >
                  {item.title}

                  {active === item.href && (
                    <motion.span
                      layoutId="navbar-active"
                      className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <Button
                variant="ghost"
                className="rounded-xl text-white hover:bg-white/10"
              >
                Sign In
              </Button>

              <Button className="group rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 px-6 shadow-xl shadow-violet-600/30">
                Get Started

                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>

            <button
              onClick={() => setOpen((prev) => !prev)}
              className="rounded-xl p-2 transition hover:bg-white/10 lg:hidden"
            >
              {open ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </button>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden border-t border-white/10 lg:hidden"
              >
                <div className="space-y-5 px-6 py-6">
                  {navLinks.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={(e) => handleLinkClick(e, item.href)}
                      className="block text-white/70 transition hover:text-white"
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