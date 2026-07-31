"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { Caption } from "@/components/adl/typography";

export interface UsageMeterProps {
  label: string;
  used: number;
  total: number;
  unit: string;
  color?: string;
  className?: string;
}

export function UsageMeter({ label, used, total, unit, color = "var(--color-accent-indigo)", className }: UsageMeterProps) {
  const percentage = Math.min(100, Math.max(0, (used / total) * 100));
  const isWarning = percentage > 85;
  const isDanger = percentage > 95;

  const barColor = isDanger ? "var(--color-accent-orange)" : isWarning ? "var(--color-accent-gold)" : color;

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      <div className="flex justify-between items-end">
        <Caption className="font-semibold text-primary">{label}</Caption>
        <Caption className="font-mono text-[10px]">
          <span className={cn(isDanger ? "text-[var(--color-accent-orange)] font-bold" : "text-primary")}>
            {used.toLocaleString()}
          </span>
          <span className="text-[var(--color-text-muted)]"> / {total.toLocaleString()} {unit}</span>
        </Caption>
      </div>
      
      <div className="h-2 w-full bg-surface rounded-full border border-border-subtle overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${percentage}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}
