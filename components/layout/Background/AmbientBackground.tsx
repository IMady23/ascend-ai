"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function AmbientBackground() {
  const { currentAccentColor } = useTheme();
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  if (!mounted) return null;

  const animateClass = reducedMotion ? "" : "ambient-blob-animate";

  return (
    <div
      className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[var(--color-bg-base)]"
      style={{ ["--ambient-accent" as string]: currentAccentColor }}
    >
      <div
        className={`absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-[0.04] ${animateClass}`}
        style={{
          background: "radial-gradient(circle, var(--color-accent-gold) 0%, transparent 60%)",
        }}
      />

      <div
        className={`absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full opacity-[0.03] ${animateClass}`}
        style={{
          background: "radial-gradient(circle, var(--color-accent-workout) 0%, transparent 60%)",
          animationDelay: "2s",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-primary) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Skip mouse-tracking glow — it forces layout work on every mousemove */}
    </div>
  );
}
