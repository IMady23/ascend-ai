"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { ShieldAlert } from "lucide-react";

export interface HolisticJourneyCardProps {
  title: string;
  icon: React.ReactNode;
  score: number;
  status: string;
  insights: string;
  disclaimer?: string;
  className?: string;
}

export function HolisticJourneyCard({
  title,
  icon,
  score,
  status,
  insights,
  disclaimer = "Wellness tracking based on nutritional consistency. Not a medical diagnosis.",
  className
}: HolisticJourneyCardProps) {
  return (
    <GlassCard className={cn("p-5 flex flex-col gap-4", className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface border border-border-subtle flex items-center justify-center text-[var(--color-accent-pink)]">
            {icon}
          </div>
          <div>
            <Heading level="h4" className="text-base">{title}</Heading>
            <Caption className="text-[var(--color-text-muted)] uppercase tracking-widest">{status}</Caption>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-2xl font-bold text-primary">{score}</div>
          <Caption className="text-[var(--color-text-muted)]">Score</Caption>
        </div>
      </div>
      
      <div className="p-3 rounded-[var(--radius-lg)] bg-surface/50 border border-border-subtle">
        <BodyText size="sm" className="text-secondary italic">"{insights}"</BodyText>
      </div>
      
      <div className="flex items-start gap-1.5 mt-auto">
        <ShieldAlert size={12} className="text-[var(--color-text-muted)] shrink-0 mt-0.5" />
        <Caption className="text-[10px] text-[var(--color-text-muted)] leading-tight">
          {disclaimer}
        </Caption>
      </div>
    </GlassCard>
  );
}
