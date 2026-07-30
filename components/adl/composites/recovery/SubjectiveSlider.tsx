"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/utils/cn";
import { Caption } from "@/components/adl/typography";

export interface SubjectiveSliderProps {
  label: string;
  minLabel?: string;
  maxLabel?: string;
  color?: string;
  defaultValue?: number;
  className?: string;
}

export function SubjectiveSlider({
  label,
  minLabel = "Low",
  maxLabel = "High",
  color = "var(--color-accent-indigo)",
  defaultValue = 5,
  className
}: SubjectiveSliderProps) {
  const [value, setValue] = React.useState(defaultValue);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  const handleDrag = (e: any, info: any) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let x = info.point.x - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const val = Math.round((percentage / 100) * 10) || 1;
    setValue(val);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const val = Math.round((percentage / 100) * 10) || 1;
    setValue(val);
  };

  const fillPercentage = (value / 10) * 100;

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      <div className="flex justify-between items-center">
        <Caption className="text-[var(--color-text-primary)] font-semibold uppercase tracking-wider">{label}</Caption>
        <div className="font-mono text-[var(--color-text-primary)] font-bold">{value} <span className="text-[var(--color-text-muted)] text-xs font-sans font-normal">/ 10</span></div>
      </div>
      
      <div 
        ref={containerRef}
        className="h-8 w-full bg-[var(--color-bg-surface)] rounded-full border border-[var(--color-glass-border)] relative cursor-pointer touch-none"
        onClick={handleClick}
      >
        <motion.div 
          className="absolute top-0 bottom-0 left-0 rounded-full opacity-30"
          style={{ width: `${fillPercentage}%`, backgroundColor: color }}
          layout
        />
        <motion.div 
          className="absolute top-1 bottom-1 w-6 rounded-full shadow-md z-10 flex items-center justify-center pointer-events-none"
          style={{ left: `calc(${fillPercentage}% - 12px)`, backgroundColor: color }}
          layout
        />
      </div>

      <div className="flex justify-between px-1">
        <Caption className="text-[var(--color-text-muted)] text-[10px]">{minLabel}</Caption>
        <Caption className="text-[var(--color-text-muted)] text-[10px]">{maxLabel}</Caption>
      </div>
    </div>
  );
}
