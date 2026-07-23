"use client";

import Link from "next/link";
import Container from "./Container";
import {
  Sparkles,
  ArrowUpRight,
  Globe,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Resume Builder", href: "#" },
    { label: "ATS Analyzer", href: "#" },
    { label: "Interview Coach", href: "#" },
    { label: "Pricing", href: "#pricing" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

const socialLinks = [
  {
    name: "Website",
    href: "#",
    icon: Globe,
  },
  {
    name: "Email",
    href: "mailto:hello@jobfusion.ai",
    icon: Mail,
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#020617]">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-violet-600/10 blur-[150px]" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[150px]" />
      </div>

      <Container>
        <div className="relative py-20">
          <div className="grid gap-14 lg:grid-cols-[1.3fr_2fr]">
            {/* Left */}
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>

                <div>
                  <h2 className="text-3xl font-black text-white">
                    JobFusion AI
                  </h2>

                  <p className="text-white/50">
                    AI Powered Career Platform
                  </p>
                </div>
              </div>

              <p className="mt-8 max-w-md leading-8 text-white/60">
                Create ATS-friendly resumes, prepare for interviews,
                discover better jobs, and grow your career with AI.
              </p>

              <div className="mt-8 space-y-4 text-white/60">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-violet-400" />
                  hello@jobfusion.ai
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-cyan-400" />
                  +91 98765 43210
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-fuchsia-400" />
                  Indore, Madhya Pradesh
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                {socialLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:-translate-y-1 hover:border-violet-500/40 hover:bg-white/10"
                    >
                      <Icon className="h-5 w-5 text-white/70" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right */}
            <div className="grid gap-10 sm:grid-cols-3">
              {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title}>
                  <h3 className="text-lg font-semibold text-white">
                    {title}
                  </h3>

                  <div className="mt-6 space-y-4">
                    {links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="group flex items-center gap-2 text-white/55 transition hover:text-white"
                      >
                        {link.label}

                        <ArrowUpRight className="h-4 w-4 opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="my-12 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="flex flex-col items-center justify-between gap-5 text-sm text-white/45 md:flex-row">
            <p>
              © {new Date().getFullYear()} JobFusion AI. All rights reserved.
            </p>

            <div className="flex gap-8">
              <Link href="#" className="hover:text-white">
                Privacy
              </Link>

              <Link href="#" className="hover:text-white">
                Terms
              </Link>

              <Link href="#" className="hover:text-white">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}