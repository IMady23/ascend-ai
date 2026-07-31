"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { ProgressRing } from "@/components/adl/composites/progress/Progress";
import { Caption } from "@/components/adl/typography";

export interface MacroRingProps {
  label: string;
  current: number;
  target: number;
  color: string;
  size?: number;
  unit?: string;
  className?: string;
}

export function MacroRing({
  label,
  current,
  target,
  color,
  size = 80,
  unit = "g",
  className
}: MacroRingProps) {
  const progress = target > 0 ? (current / target) * 100 : 0;
  
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <ProgressRing
          value={progress}
          size={size}
          strokeWidth={size * 0.1}
          color={color}
          className="absolute inset-0"
          icon={<React.Fragment />}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-sm font-bold tracking-tighter" style={{ color: "var(--color-text-primary)" }}>
            {current}
          </span>
          <Caption className="text-[var(--color-text-muted)] text-[10px] uppercase font-semibold">
            / {target}{unit}
          </Caption>
        </div>
      </div>
      <Caption className="text-secondary font-medium tracking-wide">
        {label}
      </Caption>
    </div>
  );
}
