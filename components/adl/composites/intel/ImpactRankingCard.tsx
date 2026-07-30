"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";

export interface HabitImpact {
  id: string;
  habit: string;
  impactScore: number; // 0-100
  correlation: string;
}

export interface ImpactRankingCardProps {
  title: string;
  habits: HabitImpact[];
  className?: string;
}

export function ImpactRankingCard({
  title,
  habits,
  className
}: ImpactRankingCardProps) {
  
  const sortedHabits = [...habits].sort((a, b) => b.impactScore - a.impactScore);

  return (
    <GlassCard className={cn("p-5 flex flex-col gap-4", className)}>
      <Heading level="h4" className="text-base">{title}</Heading>
      
      <div className="flex flex-col gap-3">
        {sortedHabits.map((h, index) => (
          <div key={h.id} className="flex items-center gap-4 group">
            <div className="w-6 text-center font-mono text-[var(--color-text-muted)] font-bold text-sm">
              #{index + 1}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <BodyText size="sm" className="font-semibold text-[var(--color-text-primary)]">{h.habit}</BodyText>
                <Caption className="text-[var(--color-accent-blue)] font-mono font-bold">{h.impactScore}</Caption>
              </div>
              <div className="h-1.5 w-full bg-[var(--color-bg-surface)] rounded-full overflow-hidden border border-[var(--color-glass-border)] relative">
                <div 
                  className="absolute top-0 bottom-0 left-0 rounded-full transition-all duration-1000 group-hover:opacity-80"
                  style={{ 
                    width: `${h.impactScore}%`,
                    backgroundColor: index === 0 ? "var(--color-accent-pink)" : 
                                     index === 1 ? "var(--color-accent-indigo)" : 
                                     "var(--color-accent-blue)" 
                  }} 
                />
              </div>
              <Caption className="text-[10px] text-[var(--color-text-muted)] mt-1 truncate">{h.correlation}</Caption>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-3 border-t border-[var(--color-glass-border)]">
        <Caption className="text-[10px] text-[var(--color-text-muted)] leading-tight italic">
          *Impact scores are derived from historical associations with positive performance outcomes. They do not guarantee future results.
        </Caption>
      </div>
    </GlassCard>
  );
}
