"use client";

import { motion } from "framer-motion";

const particles = [
  { top: "12%", left: "10%" },
  { top: "20%", left: "80%" },
  { top: "32%", left: "60%" },
  { top: "45%", left: "20%" },
  { top: "58%", left: "90%" },
  { top: "70%", left: "40%" },
  { top: "82%", left: "15%" },
  { top: "15%", left: "45%" },
  { top: "38%", left: "72%" },
  { top: "52%", left: "55%" },
  { top: "68%", left: "25%" },
  { top: "80%", left: "75%" },
];

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
          maskImage:
            "radial-gradient(circle at center, black 45%, transparent 100%)",
        }}
      />

      {/* Aurora Left */}
      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, -60, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-52 top-20 h-[700px] w-[700px] rounded-full bg-violet-600/30 blur-[180px]"
      />

      {/* Aurora Right */}
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 70, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -right-56 top-40 h-[700px] w-[700px] rounded-full bg-cyan-500/25 blur-[180px]"
      />

      {/* Center Glow */}
      <motion.div
        animate={{
          rotate: [0, 20, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/20 blur-[150px]"
      />

      {/* Gradient Beam */}
      <motion.div
        animate={{
          opacity: [0.25, 0.6, 0.25],
          scaleX: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="absolute left-1/2 top-0 h-[700px] w-[2px] -translate-x-1/2 bg-gradient-to-b from-violet-500 via-cyan-400 to-transparent blur-sm"
      />

      {/* Floating Particles */}
      {particles.map((particle, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.15, 0.5, 0.15],
            y: [0, -50, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.4,
          }}
          className="absolute rounded-full bg-white"
          style={{
            width: `${4 + (i % 3)}px`,
            height: `${4 + (i % 3)}px`,
            top: particle.top,
            left: particle.left,
          }}
        />
      ))}

      {/* Top Glow Line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50" />

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 h-60 w-full bg-gradient-to-t from-[#020617] to-transparent" />
    </div>
  );
}