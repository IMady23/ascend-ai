"use client";

import * as React from "react";
import { Activity, Droplets, Flame, TrendingUp } from "lucide-react";
import { cn } from "@/utils/cn";
import { ProgressHeader } from "@/components/adl/composites/onboarding/ProgressHeader";
import {
  WheelSelectorGroup,
  type WheelItem,
} from "@/components/adl/composites/onboarding/WheelSelector";
import { getProgressPosition, ONBOARDING_TRACKABLE_STEPS } from "@/stores/onboarding.store";
import { useCoach } from "@/lib/coach";

interface Step11_5BaselineActivityProps {
  fullName: string;
  baselineSteps: number;
  baselineWaterMl: number;
  baselineCalorieIntake: number;
  baselineCalorieBurn: number;
  onUpdate: (steps: number, waterMl: number, calorieIntake: number, calorieBurn: number) => void;
  onNext: () => void;
  onBack: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// WHEEL ITEMS
// ─────────────────────────────────────────────────────────────────────────────

// Steps: 0 - 50,000 in increments of 500
const STEPS_ITEMS: WheelItem[] = Array.from({ length: 101 }, (_, i) => ({
  value: i * 500,
  label: `${(i * 500).toLocaleString()}`,
}));

// Water: 500ml - 5000ml in increments of 250ml
const WATER_ITEMS: WheelItem[] = Array.from({ length: 19 }, (_, i) => ({
  value: 500 + i * 250,
  label: `${(500 + i * 250).toLocaleString()}`,
}));

// Calorie Intake: 1000 - 4000 in increments of 100
const CALORIE_INTAKE_ITEMS: WheelItem[] = Array.from({ length: 31 }, (_, i) => ({
  value: 1000 + i * 100,
  label: `${(1000 + i * 100).toLocaleString()}`,
}));

// Calorie Burn: 0 - 1000 in increments of 50
const CALORIE_BURN_ITEMS: WheelItem[] = Array.from({ length: 21 }, (_, i) => ({
  value: i * 50,
  label: `${(i * 50).toLocaleString()}`,
}));

/**
 * Screen 11.5 — Baseline Activity
 *
 * Collects current daily habits to establish a baseline:
 * - Daily steps
 * - Water intake (ml)
 * - Current calorie intake
 * - Current calorie burn from activity
 *
 * This data is used to:
 * 1. Set realistic starting targets
 * 2. Track progress from baseline
 * 3. Show personalized dashboard insights
 *
 * Conversation Rule:
 * - Explains this is about current habits, not goals
 * - AI will use this to show progress over time
 */
export function Step11_5BaselineActivity({
  fullName,
  baselineSteps,
  baselineWaterMl,
  baselineCalorieIntake,
  baselineCalorieBurn,
  onUpdate,
  onNext,
  onBack,
}: Step11_5BaselineActivityProps) {
  const firstName = fullName.trim().split(" ")[0] || "there";
  const { say, event } = useCoach();

  React.useEffect(() => {
    event({ type: "context_changed", context: "onboarding", step: 11.5, label: "baseline_activity" });
    say(
      `One last thing, ${firstName}. Tell me about your current daily habits — not goals, but what you're actually doing now. This helps me track your progress.`,
      "speaking"
    );
  }, []);

  const [steps, setSteps] = React.useState<number>(baselineSteps);
  const [waterMl, setWaterMl] = React.useState<number>(baselineWaterMl);
  const [calorieIntake, setCalorieIntake] = React.useState<number>(baselineCalorieIntake);
  const [calorieBurn, setCalorieBurn] = React.useState<number>(baselineCalorieBurn);

  // Sync to parent on every change
  React.useEffect(() => {
    onUpdate(steps, waterMl, calorieIntake, calorieBurn);
  }, [steps, waterMl, calorieIntake, calorieBurn, onUpdate]);

  const progress = getProgressPosition(11);

  return (
    <div className="flex flex-col min-h-[100svh]">
      {/* Progress header */}
      <div className="px-4 pt-4 pb-2 max-w-lg mx-auto w-full">
        <ProgressHeader
          currentStep={progress?.current ?? 11}
          totalSteps={ONBOARDING_TRACKABLE_STEPS}
          label="Current Habits"
          onBack={onBack}
          canGoBack
        />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full space-y-6">
        <div className="space-y-1 mb-4">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
            Your Current Daily Habits
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            This isn't about goals — it's about where you are right now. The AI will use this to show your progress over time.
          </p>
        </div>

        {/* Daily Steps */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-[var(--color-accent-blue)]" />
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-disabled)]">
              Daily Steps
            </p>
          </div>
          <WheelSelectorGroup
            columns={[
              {
                items: STEPS_ITEMS,
                selected: steps,
                onSelect: (v) => setSteps(Number(v)),
                label: "steps/day",
                "aria-label": "Select average daily steps",
              },
            ]}
            visibleCount={5}
            itemHeight={44}
          />
          <p className="text-[10px] text-[var(--color-text-disabled)]">
            Your typical daily step count
          </p>
        </div>

        {/* Water Intake */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Droplets size={16} className="text-[var(--color-accent-blue)]" />
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-disabled)]">
              Water Intake
            </p>
          </div>
          <WheelSelectorGroup
            columns={[
              {
                items: WATER_ITEMS,
                selected: waterMl,
                onSelect: (v) => setWaterMl(Number(v)),
                label: "ml/day",
                "aria-label": "Select average daily water intake",
              },
            ]}
            visibleCount={5}
            itemHeight={44}
          />
          <p className="text-[10px] text-[var(--color-text-disabled)]">
            Approximately {Math.round(waterMl / 250)} glasses per day
          </p>
        </div>

        {/* Current Calorie Intake */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-[var(--color-accent-orange)]" />
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-disabled)]">
              Current Calorie Intake
            </p>
          </div>
          <WheelSelectorGroup
            columns={[
              {
                items: CALORIE_INTAKE_ITEMS,
                selected: calorieIntake,
                onSelect: (v) => setCalorieIntake(Number(v)),
                label: "kcal/day",
                "aria-label": "Select average daily calorie intake",
              },
            ]}
            visibleCount={5}
            itemHeight={44}
          />
          <p className="text-[10px] text-[var(--color-text-disabled)]">
            What you're eating now, on average
          </p>
        </div>

        {/* Current Calorie Burn from Activity */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[var(--color-accent-workout)]" />
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-disabled)]">
              Daily Activity Burn
            </p>
          </div>
          <WheelSelectorGroup
            columns={[
              {
                items: CALORIE_BURN_ITEMS,
                selected: calorieBurn,
                onSelect: (v) => setCalorieBurn(Number(v)),
                label: "kcal/day",
                "aria-label": "Select average daily calorie burn from activity",
              },
            ]}
            visibleCount={5}
            itemHeight={44}
          />
          <p className="text-[10px] text-[var(--color-text-disabled)]">
            Estimated calories burned from exercise and activity
          </p>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-3 max-w-lg mx-auto w-full bg-gradient-to-t from-[var(--color-bg-base)] via-[var(--color-bg-base)] to-transparent">
        <button
          type="button"
          onClick={onNext}
          className={cn(
            "w-full h-14 rounded-2xl font-bold text-base text-white transition-all",
            "bg-[var(--color-accent-blue)] hover:brightness-110 shadow-lg shadow-[var(--color-accent-blue)]/20",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            "focus-visible:ring-[var(--color-accent-blue)] focus-visible:ring-offset-[var(--color-bg-base)]",
            "active:scale-[0.98]"
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
