"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { Heading, Caption } from "@/components/adl/typography";
import { Activity } from "lucide-react";

export interface HealthScoreRingProps {
  score: number;
  label?: string;
  trend?: "up" | "down" | "neutral";
  size?: number;
  className?: string;
}

export function HealthScoreRing({
  score,
  label = "Health Score",
  trend = "neutral",
  size = 200,
  className
}: HealthScoreRingProps) {
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  let color = "var(--color-success)";
  if (score < 70) color = "var(--color-accent-gold)";
  if (score < 40) color = "var(--color-danger)";

  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)} style={{ width: size, height: size }}>
      
      {/* Background Glow */}
      <div 
        className="absolute inset-0 rounded-full blur-2xl opacity-20 transition-colors duration-1000"
        style={{ backgroundColor: color, transform: "scale(0.8)" }}
      />

      <svg width={size} height={size} className="relative z-10 -rotate-90 filter drop-shadow-md">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-bg-surface)"
          strokeWidth={strokeWidth}
          className="opacity-50"
        />
        {/* Indicator */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <Activity size={size * 0.12} className="mb-1" style={{ color }} />
        <Heading level="h2" className="font-mono tracking-tighter" style={{ fontSize: size * 0.28, lineHeight: 1 }}>
          {score}
        </Heading>
        <Caption className="text-[var(--color-text-muted)] font-semibold uppercase tracking-wider mt-1" style={{ fontSize: size * 0.06 }}>
          {label}
        </Caption>
      </div>

    </div>
  );
}
