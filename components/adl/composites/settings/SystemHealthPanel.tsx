"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Badge } from "@/components/adl/primitives/Badge";

export interface HealthMetric {
  label: string;
  status: "Healthy" | "Warning" | "Action Needed";
  detail?: string;
}

export interface SystemHealthPanelProps {
  metrics: HealthMetric[];
  className?: string;
}

export function SystemHealthPanel({ metrics, className }: SystemHealthPanelProps) {
  return (
    <GlassCard className={cn("p-5 space-y-4", className)}>
      <Heading level="h4" className="text-base">System Health</Heading>
      
      <div className="flex flex-col gap-3">
        {metrics.map((metric, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--color-bg-surface)] transition-colors group border border-transparent hover:border-[var(--color-glass-border)]">
            <div className="flex flex-col">
              <BodyText size="sm" className="font-semibold text-[var(--color-text-primary)]">{metric.label}</BodyText>
              {metric.detail && (
                <Caption className="text-[var(--color-text-muted)] text-[10px]">{metric.detail}</Caption>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                metric.status === "Healthy" ? "bg-[var(--color-success)] shadow-[0_0_8px_var(--color-success)]" :
                metric.status === "Warning" ? "bg-[var(--color-accent-gold)] shadow-[0_0_8px_var(--color-accent-gold)]" :
                "bg-[var(--color-accent-orange)] shadow-[0_0_8px_var(--color-accent-orange)]"
              )} />
              <Caption className="font-mono text-[10px] uppercase tracking-wider">{metric.status}</Caption>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
