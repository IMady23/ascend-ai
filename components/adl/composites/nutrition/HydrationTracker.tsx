"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Droplets, Plus } from "lucide-react";
import { cn } from "@/utils/cn";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, Caption } from "@/components/adl/typography";

export interface HydrationTrackerProps {
  currentMl: number;
  targetMl: number;
  onAdd: (ml: number) => void;
  className?: string;
}

export function HydrationTracker({
  currentMl,
  targetMl,
  onAdd,
  className
}: HydrationTrackerProps) {
  const percentage = targetMl > 0 ? Math.min((currentMl / targetMl) * 100, 100) : 0;
  
  return (
    <GlassCard className={cn("p-5 flex items-center justify-between overflow-hidden relative", className)}>
      {/* Background Liquid Fill Effect */}
      <div className="absolute inset-0 z-0 bg-[var(--color-bg-surface)] opacity-50" />
      <motion.div 
        className="absolute bottom-0 left-0 right-0 z-0 bg-blue-500/10 backdrop-blur-sm"
        initial={{ height: 0 }}
        animate={{ height: `${percentage}%` }}
        transition={{ type: "spring", bounce: 0.2, duration: 1 }}
      />
      
      <div className="relative z-10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
          <Droplets size={24} />
        </div>
        <div>
          <Heading level="h4" className="text-lg">Hydration</Heading>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-mono text-xl font-bold">{currentMl}</span>
            <Caption className="text-[var(--color-text-muted)]">/ {targetMl} ml</Caption>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 flex gap-2">
        <button 
          onClick={() => onAdd(250)}
          className="px-3 py-1.5 rounded-lg bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-glass-hover)] border border-[var(--color-glass-border)] flex items-center gap-1 transition-colors text-xs font-medium"
        >
          <Plus size={14} /> 250
        </button>
        <button 
          onClick={() => onAdd(500)}
          className="px-3 py-1.5 rounded-lg bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-glass-hover)] border border-[var(--color-glass-border)] flex items-center gap-1 transition-colors text-xs font-medium"
        >
          <Plus size={14} /> 500
        </button>
      </div>
    </GlassCard>
  );
}
