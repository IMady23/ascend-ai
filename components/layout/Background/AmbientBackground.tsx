"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useTheme } from "@/providers/ThemeProvider";

export function AmbientBackground() {
  const { currentAccentColor } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Mouse Glow
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const springConfig = { damping: 40, stiffness: 100, mass: 1 };
  const glowX = useSpring(mouseX, springConfig);
  const glowY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[var(--color-bg-base)]">
      
      {/* Animated Gold Ambient Blob */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle, var(--color-accent-gold) 0%, transparent 60%)",
          opacity: 0.04
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.03, 0.05, 0.03],
          x: ["0%", "5%", "0%"],
          y: ["0%", "5%", "0%"],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Animated Violet Ambient Blob */}
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle, var(--color-accent-workout) 0%, transparent 60%)",
          opacity: 0.03
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.02, 0.04, 0.02],
          x: ["0%", "-5%", "0%"],
          y: ["0%", "-5%", "0%"],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Subtle Grid Overlay for Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(var(--color-text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-primary) 1px, transparent 1px)',
          backgroundSize: '64px 64px'
        }}
      />

      {/* Mouse Follower Glow */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full will-change-transform mix-blend-screen"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, var(--color-accent-gold) 0%, transparent 60%)",
          opacity: 0.02
        }}
      />
    </div>
  );
}
