"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "./Container";

const navLinks = [
  { title: "Features", href: "#features" },
  { title: "How it works", href: "#how-it-works" },
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
        const top = (section as HTMLElement).offsetTop - 140;
        if (window.scrollY >= top) current = item.href;
      });
      setActive(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    const section = document.querySelector(href);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <Container>
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`mt-3 sm:mt-4 transition-all duration-300 ${
            open
              ? "rounded-3xl border border-slate-200/90 bg-white/95 shadow-xl backdrop-blur-xl"
              : scrolled
              ? "rounded-full border border-slate-200/80 bg-white/75 shadow-[0_15px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl"
              : "rounded-full border border-transparent bg-transparent"
          }`}
        >
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm shrink-0">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm sm:text-base font-bold tracking-tight text-foreground">JobFusion AI</p>
                <p className="-mt-0.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  AI Career Platform
                </p>
              </div>
            </Link>

            <div className="hidden items-center gap-7 lg:flex">
              {navLinks.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className="relative text-sm font-medium text-muted-foreground transition hover:text-foreground"
                >
                  {item.title}
                  {active === item.href && (
                    <motion.span
                      layoutId="navbar-indicator"
                      className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-primary"
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <Link href="/login">
                <Button variant="ghost" className="px-4">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="shadow-xs gap-1.5">
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <button
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="rounded-full p-2 text-slate-700 transition hover:bg-slate-200/70 lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden border-t border-slate-200/70 bg-white/95 rounded-b-3xl lg:hidden"
              >
                <div className="space-y-4 px-5 py-5">
                  {navLinks.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={(e) => handleLinkClick(e, item.href)}
                      className="block text-sm font-medium text-slate-700 py-1"
                    >
                      {item.title}
                    </Link>
                  ))}
                  <div className="pt-2 flex flex-col gap-2.5">
                    <Link href="/login" onClick={() => setOpen(false)} className="block w-full">
                      <Button variant="outline" className="w-full justify-center rounded-xl text-slate-700">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setOpen(false)} className="block w-full">
                      <Button className="w-full justify-center rounded-xl bg-primary text-primary-foreground">
                        Get started
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </Container>
    </header>
  );
}