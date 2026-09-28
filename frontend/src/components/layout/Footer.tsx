"use client";

import Link from "next/link";
import Container from "./Container";
import { ArrowUpRight, Globe, Mail, MapPin, Sparkles } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Resume builder", href: "#features" },
    { label: "ATS analyzer", href: "#features" },
    { label: "Interview prep", href: "#features" },
    { label: "Pricing", href: "#pricing" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Resources", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Cookies", href: "#" },
    { label: "Security", href: "#" },
  ],
};

const socials = [
  { name: "Website", href: "#", icon: Globe },
  { name: "Email", href: "mailto:hello@jobfusion.ai", icon: Mail },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-card">
      <Container>
        <div className="py-10 sm:py-16">
          <div className="grid gap-10 sm:gap-12 lg:grid-cols-[1.2fr_1.8fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm shrink-0">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xl font-bold tracking-tight text-foreground">JobFusion AI</p>
                  <p className="text-[10px] uppercase font-semibold tracking-[0.2em] text-muted-foreground">AI Career Platform</p>
                </div>
              </div>

              <p className="mt-4 sm:mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                A smarter, data-driven way to position your resume, discover fitting roles, and manage your full application lifecycle.
              </p>

              <div className="mt-5 sm:mt-6 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2.5"><Mail className="h-4 w-4 text-primary shrink-0" /> support@jobfusion.ai</div>
                <div className="flex items-center gap-2.5"><MapPin className="h-4 w-4 text-primary shrink-0" /> Enterprise Career Intelligence</div>
              </div>

              <div className="mt-6 sm:mt-7 flex gap-3">
                {socials.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} href={item.href} aria-label={item.name} className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-slate-300 hover:bg-slate-100">
                      <Icon className="h-4 w-4" />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-8 grid-cols-2 sm:grid-cols-3">
              {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title} className={title === "Legal" ? "col-span-2 sm:col-span-1" : ""}>
                  <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</h3>
                  <div className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3">
                    {links.map((link) => (
                      <Link key={link.label} href={link.href} className="group flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base text-slate-600 transition hover:text-slate-900">
                        <span>{link.label}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100 shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 sm:mt-12 border-t border-slate-200 pt-6 text-xs sm:text-sm text-slate-500">
            <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
              <p>© {new Date().getFullYear()} JobFusion AI. All rights reserved.</p>
              <p>Built for serious job seekers.</p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}