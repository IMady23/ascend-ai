"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { Caption } from "@/components/adl/typography";
import { Sparkles } from "lucide-react";

export interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
  chapter?: string;
  className?: string;
}

export function XPBar({
  currentXP,
  maxXP,
  level,
  chapter,
  className
}: XPBarProps) {
  const percentage = Math.min((currentXP / maxXP) * 100, 100);

  return (
    <div className={cn("flex flex-col gap-3 w-full", className)}>
      <div className="flex items-end justify-between">
        <div>
          {chapter && (
            <Caption className="text-[var(--color-accent-gold)] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5">
              <Sparkles size={12} /> {chapter}
            </Caption>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">LVL {level}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="font-mono text-xl font-bold text-[var(--color-accent-gold)]">{currentXP.toLocaleString()}</span>
          <Caption className="text-[var(--color-text-muted)] ml-1">/ {maxXP.toLocaleString()} XP</Caption>
        </div>
      </div>
      
      <div className="h-3 w-full bg-[var(--color-bg-surface)] rounded-full overflow-hidden border border-[var(--color-glass-border)] relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
          className="h-full bg-gradient-to-r from-[var(--color-accent-orange)] to-[var(--color-accent-gold)] rounded-full relative"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </motion.div>
      </div>
    </div>
  );
}
