"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Badge } from "@/components/adl/primitives/Badge";

export interface RecoveryActivityCardProps {
  title: string;
  duration: string;
  intensity: "Restorative" | "Active" | "Passive";
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export function RecoveryActivityCard({
  title,
  duration,
  intensity,
  description,
  icon,
  className
}: RecoveryActivityCardProps) {
  
  const intensityColor = 
    intensity === "Restorative" ? "var(--color-accent-blue)" : 
    intensity === "Active" ? "var(--color-accent-green)" : 
    "var(--color-accent-indigo)";

  return (
    <GlassCard className={cn("p-4 flex gap-4 items-center group cursor-pointer hover:bg-surface transition-colors", className)}>
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-border-subtle"
        style={{ backgroundColor: `color-mix(in srgb, ${intensityColor} 10%, transparent)`, color: intensityColor }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <Heading level="h4" className="text-base">{title}</Heading>
          <Caption className="text-[var(--color-text-muted)] font-mono">{duration}</Caption>
        </div>
        <BodyText size="sm" className="text-secondary line-clamp-1">{description}</BodyText>
      </div>
    </GlassCard>
  );
}
