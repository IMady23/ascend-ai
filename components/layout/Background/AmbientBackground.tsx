"use client";

import React from "react";
import { useTheme } from "@/providers/ThemeProvider";

export function AmbientBackground() {
  const { currentAccentColor } = useTheme();

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-[var(--color-bg-base)]">
      {/* 
        Layer 2 & 3: Ambient Radial Glow 
        Uses native CSS transitions for GPU-accelerated opacity & color shifting 
      */}
      <div 
        className="absolute inset-0 transition-colors duration-[4000ms] ease-in-out"
        style={{
          background: `radial-gradient(circle at 0% 0%, ${currentAccentColor}1A 0%, transparent 60%)`,
          willChange: "background"
        }}
      />
      
      {/* Layer 4: Optional Premium Noise Texture (Subtle) */}
      <div 
        className="absolute inset-0 opacity-[0.015]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
