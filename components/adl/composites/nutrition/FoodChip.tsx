"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { Heading, Caption } from "@/components/adl/typography";
import { Sparkles } from "lucide-react";

export interface FoodChipProps {
  emoji: string;
  name: string;
  reason: string;
  className?: string;
}

export function FoodChip({
  emoji,
  name,
  reason,
  className
}: FoodChipProps) {
  return (
    <div className={cn(
      "flex items-start gap-3 p-3 rounded-[var(--radius-lg)] bg-[var(--color-bg-surface)] border border-[var(--color-glass-border)] hover:border-[var(--color-text-muted)] transition-colors",
      className
    )}>
      <div className="text-2xl mt-0.5 leading-none shrink-0 filter drop-shadow-sm">
        {emoji}
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <Heading level="h5" className="text-sm">{name}</Heading>
          <Sparkles size={12} className="text-[var(--color-accent-indigo)]" />
        </div>
        <Caption className="text-[var(--color-text-secondary)] leading-snug">
          {reason}
        </Caption>
      </div>
    </div>
  );
}
