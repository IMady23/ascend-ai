"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Badge } from "@/components/adl/primitives/Badge";
import { BrainCircuit, Cpu, Zap, Activity } from "lucide-react";

export interface AIProviderCardProps {
  providerName: string;
  modelName: string;
  isActive?: boolean;
  latency: string;
  successRate: string;
  contextWindow: string;
  className?: string;
}

export function AIProviderCard({
  providerName,
  modelName,
  isActive = false,
  latency,
  successRate,
  contextWindow,
  className
}: AIProviderCardProps) {
  return (
    <GlassCard className={cn("p-5 border flex flex-col gap-4", isActive ? "border-[var(--current-accent,var(--color-accent-indigo))] bg-[var(--current-accent,var(--color-accent-indigo))]/5 shadow-sm" : "border-border-subtle opacity-70 hover:opacity-100", className)}>
      
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", isActive ? "bg-[var(--current-accent,var(--color-accent-indigo))]/20 text-[var(--current-accent,var(--color-accent-indigo))]" : "bg-base text-[var(--color-text-muted)]")}>
            <BrainCircuit size={20} />
          </div>
          <div>
            <Heading level="h4" className="text-base">{providerName}</Heading>
            <Caption className="text-secondary font-mono">{modelName}</Caption>
          </div>
        </div>
        
        {isActive ? (
          <Badge variant="outline" className="border-[var(--color-success)] text-[var(--color-success)] uppercase text-[9px] tracking-wider">Active Node</Badge>
        ) : (
          <Badge variant="outline" className="border-[var(--color-text-muted)] text-[var(--color-text-muted)] uppercase text-[9px] tracking-wider">Fallback</Badge>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border-subtle">
        <div className="flex flex-col items-center justify-center p-2 rounded-md bg-surface">
          <Zap size={12} className="text-[var(--color-accent-gold)] mb-1" />
          <Caption className="text-[10px] text-[var(--color-text-muted)] mb-0.5">Latency</Caption>
          <div className="font-mono text-xs font-semibold">{latency}</div>
        </div>
        <div className="flex flex-col items-center justify-center p-2 rounded-md bg-surface">
          <Activity size={12} className="text-[var(--color-success)] mb-1" />
          <Caption className="text-[10px] text-[var(--color-text-muted)] mb-0.5">Success</Caption>
          <div className="font-mono text-xs font-semibold">{successRate}</div>
        </div>
        <div className="flex flex-col items-center justify-center p-2 rounded-md bg-surface">
          <Cpu size={12} className="text-[var(--color-accent-blue)] mb-1" />
          <Caption className="text-[10px] text-[var(--color-text-muted)] mb-0.5">Context</Caption>
          <div className="font-mono text-xs font-semibold">{contextWindow}</div>
        </div>
      </div>

    </GlassCard>
  );
}
