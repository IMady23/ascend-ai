"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { Heading, Caption } from "@/components/adl/typography";
import { Zap } from "lucide-react";

export type ReadinessState = "Peak Performance" | "Ready" | "Moderate" | "Fatigued" | "Recovery Needed";

export interface ReadinessGaugeProps {
  score: number; // 0-100
  state: ReadinessState;
  className?: string;
}

const stateColors: Record<ReadinessState, string> = {
  "Peak Performance": "var(--color-accent-blue)",
  "Ready": "var(--color-success)",
  "Moderate": "var(--color-accent-gold)",
  "Fatigued": "var(--color-accent-orange)",
  "Recovery Needed": "var(--color-danger)"
};

export function ReadinessGauge({
  score,
  state,
  className
}: ReadinessGaugeProps) {
  const size = 240;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI; // Semi-circle
  const offset = circumference - (score / 100) * circumference;
  
  const color = stateColors[state];
  const rotation = (score / 100) * 180 - 90; // -90 to +90 degrees

  return (
    <div className={cn("relative flex flex-col items-center", className)} style={{ width: size, height: size / 1.5 }}>
      
      {/* Background Glow */}
      <div 
        className="absolute bottom-0 w-3/4 h-1/2 rounded-t-full blur-3xl opacity-20 transition-colors duration-1000"
        style={{ backgroundColor: color }}
      />

      <div className="relative overflow-hidden" style={{ width: size, height: size / 2 }}>
        <svg width={size} height={size} className="relative filter drop-shadow-md">
          {/* Track */}
          <path
            d={`M ${strokeWidth/2} ${size/2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth/2} ${size/2}`}
            fill="none"
            stroke="var(--color-bg-surface)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="opacity-50"
          />
          {/* Progress */}
          <motion.path
            d={`M ${strokeWidth/2} ${size/2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth/2} ${size/2}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, type: "spring", bounce: 0.1 }}
          />
        </svg>

        {/* Needle */}
        <motion.div 
          className="absolute bottom-0 left-1/2 w-1 h-[45%] bg-[var(--color-text-primary)] rounded-full origin-bottom shadow-lg z-20"
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
          style={{ x: "-50%" }}
        >
          <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-[var(--color-text-primary)]" />
        </motion.div>
        
        {/* Needle Base */}
        <div className="absolute bottom-0 left-1/2 w-6 h-6 rounded-full bg-surface border-4 border-[var(--color-text-primary)] transform -translate-x-1/2 translate-y-1/2 z-30" />
      </div>

      <div className="flex flex-col items-center mt-4 relative z-10">
        <div className="flex items-center gap-1.5" style={{ color }}>
          <Zap size={18} className={state === "Peak Performance" ? "animate-pulse" : ""} />
          <Heading level="h2" className="text-3xl tracking-tight">{score}</Heading>
        </div>
        <Caption className="text-primary font-semibold mt-1 tracking-wider uppercase text-xs">{state}</Caption>
      </div>

    </div>
  );
}
