"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { Heading, Caption } from "@/components/adl/typography";

export interface RecoveryScoreRingProps {
  score: number;
  size?: number;
  className?: string;
}

export function RecoveryScoreRing({
  score,
  size = 120,
  className
}: RecoveryScoreRingProps) {
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  let color = "var(--color-success)";
  if (score < 70) color = "var(--color-accent-gold)";
  if (score < 40) color = "var(--color-danger)";

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      
      <svg width={size} height={size} className="relative z-10 -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-bg-surface)"
          strokeWidth={strokeWidth}
          className="opacity-50"
        />
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
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <Heading level="h3" className="font-mono tracking-tighter leading-none" style={{ fontSize: size * 0.35 }}>
          {score}
        </Heading>
        <Caption className="text-[var(--color-text-muted)] uppercase tracking-widest mt-1" style={{ fontSize: size * 0.1 }}>
          Recovery
        </Caption>
      </div>
    </div>
  );
}
