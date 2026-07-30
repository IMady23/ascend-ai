"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, Caption } from "@/components/adl/typography";
import { Badge } from "@/components/adl/primitives/Badge";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

export interface WeightTrendCardProps {
  currentWeight: number;
  startWeight: number;
  targetWeight: number;
  unit?: string;
  trend: "up" | "down" | "stable";
  delta: number;
  className?: string;
}

export function WeightTrendCard({
  currentWeight,
  startWeight,
  targetWeight,
  unit = "kg",
  trend,
  delta,
  className
}: WeightTrendCardProps) {
  
  const isLossGoal = targetWeight < startWeight;
  const progress = isLossGoal 
    ? Math.max(0, Math.min(100, ((startWeight - currentWeight) / (startWeight - targetWeight)) * 100))
    : Math.max(0, Math.min(100, ((currentWeight - startWeight) / (targetWeight - startWeight)) * 100));

  const TrendIcon = trend === "down" ? TrendingDown : trend === "up" ? TrendingUp : Minus;
  const trendColor = trend === "down" ? "text-blue-400" : trend === "up" ? "text-orange-400" : "text-slate-400";

  return (
    <GlassCard className={cn("p-6 flex flex-col gap-6", className)}>
      <div className="flex justify-between items-start">
        <div>
          <Caption className="text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Current Weight</Caption>
          <div className="flex items-baseline gap-1">
            <Heading level="h2" className="text-4xl tracking-tight">{currentWeight}</Heading>
            <span className="text-[var(--color-text-muted)] font-mono">{unit}</span>
          </div>
        </div>
        <Badge variant="outline" className={cn("flex items-center gap-1", trendColor)}>
          <TrendIcon size={14} />
          <span>{Math.abs(delta)}{unit} this month</span>
        </Badge>
      </div>

      <div className="w-full space-y-2">
        <div className="flex justify-between text-xs text-[var(--color-text-muted)] font-mono">
          <span>{startWeight}{unit}</span>
          <span>{targetWeight}{unit}</span>
        </div>
        <div className="h-2 w-full bg-[var(--color-bg-surface)] rounded-full overflow-hidden border border-[var(--color-glass-border)] relative">
          <div 
            className="absolute top-0 bottom-0 left-0 bg-[var(--color-text-primary)] rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* Chart Placeholder */}
      <div className="h-24 w-full border border-dashed border-[var(--color-glass-border)] rounded-lg flex items-center justify-center text-[var(--color-text-muted)] text-xs">
        [Recharts Trendline Implementation]
      </div>
    </GlassCard>
  );
}
