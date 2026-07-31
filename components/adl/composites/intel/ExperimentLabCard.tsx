"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Badge } from "@/components/adl/primitives/Badge";
import { FlaskConical, ArrowRight } from "lucide-react";

export interface ExperimentLabCardProps {
  experimentName: string;
  status: "Active" | "Completed" | "Planned";
  progress?: number; // 0-100
  beforeMetric: string;
  currentMetric: string;
  metricLabel: string;
  className?: string;
}

export function ExperimentLabCard({
  experimentName,
  status,
  progress = 50,
  beforeMetric,
  currentMetric,
  metricLabel,
  className
}: ExperimentLabCardProps) {
  return (
    <GlassCard className={cn("p-5 border-[var(--color-accent-pink)]/20", className)}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[var(--color-accent-pink)]/10 text-[var(--color-accent-pink)]">
            <FlaskConical size={16} />
          </div>
          <Heading level="h4" className="text-sm">{experimentName}</Heading>
        </div>
        <Badge variant="outline" className={cn(
          status === "Active" ? "border-[var(--color-accent-pink)] text-[var(--color-accent-pink)]" :
          status === "Completed" ? "border-[var(--color-success)] text-[var(--color-success)]" :
          "border-[var(--color-text-muted)] text-[var(--color-text-muted)]"
        )}>
          {status}
        </Badge>
      </div>

      <div className="bg-base/50 rounded-lg p-3 border border-border-subtle flex items-center justify-between mb-4">
        <div className="text-center flex-1">
          <Caption className="text-[var(--color-text-muted)] uppercase text-[9px] mb-1">Baseline</Caption>
          <div className="font-mono text-sm font-bold">{beforeMetric}</div>
        </div>
        <div className="shrink-0 px-2 text-[var(--color-text-muted)]">
          <ArrowRight size={14} />
        </div>
        <div className="text-center flex-1">
          <Caption className="text-[var(--color-accent-pink)] uppercase text-[9px] mb-1 font-bold">Current</Caption>
          <div className="font-mono text-sm font-bold text-[var(--color-accent-pink)]">{currentMetric}</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <Caption className="text-secondary text-xs">Tracking: {metricLabel}</Caption>
        {status === "Active" && (
          <Caption className="font-mono text-[10px]">{progress}% Done</Caption>
        )}
      </div>

    </GlassCard>
  );
}
