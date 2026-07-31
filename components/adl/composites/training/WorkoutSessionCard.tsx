"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Badge } from "@/components/adl/primitives/Badge";
import { Dumbbell } from "lucide-react";

export interface WorkoutSessionCardProps {
  title: string;
  type: string;
  duration: string;
  exercises: string[];
  status: "scheduled" | "completed" | "skipped";
  className?: string;
}

export function WorkoutSessionCard({
  title,
  type,
  duration,
  exercises,
  status,
  className
}: WorkoutSessionCardProps) {
  return (
    <GlassCard className={cn("p-4 flex flex-col gap-3 border-[var(--color-accent-indigo)]/20", className)}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[var(--color-accent-indigo)]/10 text-[var(--color-accent-indigo)]">
            <Dumbbell size={16} />
          </div>
          <div>
            <Heading level="h4" className="text-sm">{title}</Heading>
            <Caption className="text-[var(--color-text-muted)] font-mono text-[10px] uppercase tracking-wider">{type} • {duration}</Caption>
          </div>
        </div>
        <Badge variant="outline" className="border-[var(--color-accent-indigo)] text-[var(--color-accent-indigo)] text-[10px]">
          {status}
        </Badge>
      </div>
      <div className="pt-2 border-t border-border-subtle">
        <BodyText size="sm" className="text-secondary">
          {exercises.join(" • ")}
        </BodyText>
      </div>
    </GlassCard>
  );
}
