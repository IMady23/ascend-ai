"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";

interface HallEnvironmentProps {
  stage: number;
}

export function HallEnvironment({ stage }: HallEnvironmentProps) {
  const isTransitioning = stage > 5;
  const isFinalStage = stage >= 5;

  // Background colors per stage
  const bgColors = [
    "#05070A", // 0: Entrance (Cold, Dark)
    "#05070A", // 1: Decision (Cold, Dark)
    "#0A1020", // 2: Mind (Blue, Intellectual)
    "#080A0F", // 3: Discipline (Sharper, Metal)
    "#111111", // 4: Future (Warm white, Minimal)
    "#000000", // 5: Portal (Darker to make portal pop)
    "#000000", // 6: Transition
  ];

  // Mouse tracking removed from HallEnvironment to enforce strictly cinematic/non-interactive style
  // Parallax uses a subtle fixed sway now or is completely removed.
  // "Parallax uses a subtle fixed sway" -> Actually, the user said "Camera only moves on scroll/click. Not mouse."
  // So no mouse parallax at all.

  // Generate exactly 4 dust particles per spec
  const [particles] = useState(() => 
    Array.from({ length: 4 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
    }))
  );

  return (
    <motion.div 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      animate={{ backgroundColor: bgColors[stage] || bgColors[0] }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      {/* Dynamic Floor Reflection */}
      <motion.div 
        className="absolute bottom-0 w-full h-[40vh]"
        style={{
          background: "linear-gradient(to top, rgba(255,255,255,0.1), transparent)",
        }}
        animate={{
          opacity: isTransitioning ? 0 : (stage / 5) * 0.8 + 0.1, // Becomes brighter near portal
          y: isTransitioning ? 100 : 0,
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      {/* Floating Dust */}
      {!isTransitioning && particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white opacity-20 will-change-transform"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: [0, -50, 0],
            x: [0, 30, 0],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        />
      ))}

      {/* Foreground Depth Elements (No mouse tracking) */}
      <div className="absolute inset-0 z-50 pointer-events-none opacity-40">
        {/* Abstract geometrical shapes suggesting architecture near the camera */}
        <div className="absolute top-[-10%] left-[-5%] w-[30vh] h-[80vh] bg-[var(--color-bg-glass-standard)] border-r border-[var(--color-glass-border)] rounded-full rotate-12" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40vh] h-[60vh] bg-[var(--color-bg-glass-standard)] border-l border-[var(--color-glass-border)] rounded-full -rotate-12" />
      </div>
      
      {/* Volumetric center light */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full will-change-transform"
        style={{
          background: stage === 4 ? "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 60%)" : "radial-gradient(circle, rgba(37,99,255,0.02) 0%, transparent 60%)",
        }}
        animate={{
          opacity: isTransitioning ? 0 : (isFinalStage ? 1 : 0.5),
          scale: isFinalStage ? 1.5 : 1, // Only animates to 1.5 on final stage, no infinite breathing
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
