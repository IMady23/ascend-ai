"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { TrendingUp, ShieldAlert } from "lucide-react";

export interface GoalSimulationPanelProps {
  currentGoal: string;
  className?: string;
}

export function GoalSimulationPanel({
  currentGoal,
  className
}: GoalSimulationPanelProps) {
  const [sleep, setSleep] = React.useState(7);
  const [workouts, setWorkouts] = React.useState(3);

  // Fake mathematical projection calculation based on inputs
  const baselineCompletion = 8; // months
  const sleepDelta = (sleep - 7) * 0.5; // better sleep reduces months
  const workoutDelta = (workouts - 3) * 1.2; // more workouts reduces months
  
  const projectedMonths = Math.max(2, baselineCompletion - sleepDelta - workoutDelta);
  const confidenceBand = sleep >= 8 && workouts >= 4 ? "±1 month" : "±3 months";

  return (
    <GlassCard className={cn("p-5 flex flex-col gap-5 border-[var(--color-accent-blue)]/20", className)}>
      <div>
        <Heading level="h4" className="text-base text-[var(--color-accent-blue)]">Goal Simulator</Heading>
        <Caption className="text-[var(--color-text-muted)]">Adjust assumptions to explore hypothetical trajectories for: {currentGoal}</Caption>
      </div>

      <div className="flex flex-col gap-4">
        
        {/* Slider 1 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <BodyText size="sm" className="font-semibold text-primary">Average Sleep</BodyText>
            <Caption className="font-mono">{sleep} hrs/night</Caption>
          </div>
          <input 
            type="range" 
            min="5" 
            max="10" 
            step="0.5" 
            value={sleep} 
            onChange={(e) => setSleep(parseFloat(e.target.value))}
            className="w-full accent-[var(--color-accent-blue)] h-1 bg-[var(--color-glass-border)] rounded-full appearance-none cursor-pointer"
          />
        </div>

        {/* Slider 2 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <BodyText size="sm" className="font-semibold text-primary">Workout Frequency</BodyText>
            <Caption className="font-mono">{workouts} sessions/wk</Caption>
          </div>
          <input 
            type="range" 
            min="1" 
            max="6" 
            step="1" 
            value={workouts} 
            onChange={(e) => setWorkouts(parseInt(e.target.value))}
            className="w-full accent-[var(--color-accent-blue)] h-1 bg-[var(--color-glass-border)] rounded-full appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[var(--color-accent-blue)]/5 border border-[var(--color-accent-blue)]/20 mt-2">
        <Caption className="text-[var(--color-accent-blue)] uppercase tracking-wider font-semibold mb-1">Projected Outcome</Caption>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-[var(--color-accent-blue)]/20">
            <TrendingUp size={20} className="text-[var(--color-accent-blue)]" />
          </div>
          <div>
            <Heading level="h3" className="text-2xl">{projectedMonths.toFixed(1)} Months</Heading>
            <Caption className="text-[var(--color-text-muted)] font-mono">Uncertainty: {confidenceBand}</Caption>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <ShieldAlert size={14} className="text-[var(--color-accent-gold)] shrink-0 mt-0.5" />
        <Caption className="text-[10px] text-[var(--color-text-muted)] leading-tight italic">
          Simulations are hypothetical explorations based on past behavioral math, not promises. The human body is non-linear.
        </Caption>
      </div>

    </GlassCard>
  );
}
