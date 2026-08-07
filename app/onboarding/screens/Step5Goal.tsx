"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Dumbbell, Target, RefreshCw } from "lucide-react";
import { cn } from "@/utils/cn";
import { ProgressHeader } from "@/components/adl/composites/onboarding/ProgressHeader";
import { ChoiceCard, ChoiceGroup } from "@/components/adl/composites/onboarding/ChoiceCard";
import { getProgressPosition, ONBOARDING_TRACKABLE_STEPS } from "@/stores/onboarding.store";
import { useCoach } from "@/lib/coach";
import type { PrimaryGoal } from "@/types/user";

interface Step5GoalProps {
  fullName: string;
  primaryGoal: PrimaryGoal;
  targetWeightKg: number | null;
  currentWeightKg: number;
  units: "metric" | "imperial";
  onUpdate: (goal: PrimaryGoal, targetWeight: number | null) => void;
  onNext: () => void;
  onBack: () => void;
}

// Goal definitions
const GOALS: Array<{
  value: PrimaryGoal;
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  badge?: string;
  // What the AI says AFTER the user continues (transition message)
  transitionMessage: string;
}> = [
  {
    value: "lose_fat",
    title: "Lose Fat",
    description: "Reduce body fat while preserving muscle",
    icon: <Flame size={20} />,
    accentColor: "var(--color-accent-orange)",
    transitionMessage:
      "A sustainable deficit. We'll protect your muscle while shedding fat.",
  },
  {
    value: "gain_muscle",
    title: "Gain Muscle",
    description: "Build strength and increase muscle mass",
    icon: <Dumbbell size={20} />,
    accentColor: "var(--color-accent-workout)",
    transitionMessage:
      "Controlled surplus. Enough fuel to build, not enough to store as fat.",
  },
  {
    value: "maintain",
    title: "Maintain & Improve",
    description: "Keep your weight, build fitness and health",
    icon: <Target size={20} />,
    accentColor: "var(--color-accent-nutrition)",
    transitionMessage:
      "Precision at maintenance. Performance and health, without the scale moving.",
  },
  {
    value: "recomp",
    title: "Body Recomposition",
    description: "Lose fat and gain muscle simultaneously",
    icon: <RefreshCw size={20} />,
    accentColor: "var(--color-accent-blue)",
    badge: "Advanced",
    transitionMessage:
      "Ambitious — and achievable. This needs precise macros and consistent training. We'll make it work.",
  },
];

/**
 * Screen 5 — Goal
 *
 * Conversation Rule:
 * - Opens by referencing what the AI just calculated (from Analyzing screen)
 * - After goal is selected, target weight input appears immediately
 * - User presses Continue ONCE to commit (no mid-screen AI chatter)
 * - AI transition message appears as the next screen loads (Phase 2G)
 *
 * Fixed UX order (per Phase 2B.5 review):
 *   Select goal → target weight appears → Continue → AI confirms
 * Not: Select goal → AI talks → target weight → Continue
 *
 * Principle 13 (Zero Dead Screens):
 * - OrbedCoachMessage references Analyzing results
 * - Goal cards have real descriptions, not placeholder text
 */
export function Step5Goal({ fullName, primaryGoal, targetWeightKg, currentWeightKg, units, onUpdate, onNext, onBack }: Step5GoalProps) {
  const firstName = fullName.trim().split(" ")[0] || "there";
  const { say, event } = useCoach();

  React.useEffect(() => {
    event({ type: "context_changed", context: "onboarding", step: 5, label: "goal" });
    say(`Your metabolism is calculated, ${firstName}. What do you actually want to achieve?`, "speaking");
   
  }, []);

  const [selectedGoal, setSelectedGoal] = React.useState<PrimaryGoal>(primaryGoal);
  const [showTargetWeight, setShowTargetWeight] = React.useState(!!primaryGoal);

  // Default target weight in display units
  const defaultTargetKg = targetWeightKg ??
    (selectedGoal === "lose_fat"
      ? Math.round(currentWeightKg * 0.9)
      : selectedGoal === "gain_muscle"
      ? Math.round(currentWeightKg * 1.08)
      : currentWeightKg);

  const defaultTargetDisplay = units === "metric"
    ? defaultTargetKg
    : Math.round(defaultTargetKg * 2.20462);

  const [targetInput, setTargetInput] = React.useState<string>(
    String(defaultTargetDisplay)
  );

  // Sync to parent whenever selection or target changes
  React.useEffect(() => {
    const parsed = parseFloat(targetInput);
    const targetKg = !isNaN(parsed) && parsed > 0
      ? (units === "metric" ? parsed : Math.round(parsed / 2.20462))
      : null;
    onUpdate(selectedGoal, targetKg);
  }, [selectedGoal, targetInput, units, onUpdate]);

  const handleGoalSelect = (value: string) => {
    const goal = value as PrimaryGoal;
    setSelectedGoal(goal);
    // Fire goal_selected event — experience rules respond with goal-specific message
    event({ type: "goal_selected", goal, targetWeightKg: targetWeightKg ?? undefined });

    // Auto-set target for maintain/recomp
    if (goal === "maintain" || goal === "recomp") {
      const t = units === "metric"
        ? currentWeightKg
        : Math.round(currentWeightKg * 2.20462);
      setTargetInput(String(t));
    } else {
      // Suggest a sensible target
      const suggested = goal === "lose_fat"
        ? Math.round(currentWeightKg * 0.9)
        : Math.round(currentWeightKg * 1.08);
      const display = units === "metric" ? suggested : Math.round(suggested * 2.20462);
      setTargetInput(String(display));
    }

    setShowTargetWeight(true);
  };

  const isValid = !!selectedGoal;
  const showTargetInput = showTargetWeight &&
    (selectedGoal === "lose_fat" || selectedGoal === "gain_muscle");

  const progress = getProgressPosition(5);

  return (
    <div className="flex flex-col min-h-[100svh]">
      {/* Progress header */}
      <div className="px-4 pt-4 pb-2 max-w-lg mx-auto w-full">
        <ProgressHeader
          currentStep={progress?.current ?? 4}
          totalSteps={ONBOARDING_TRACKABLE_STEPS}
          label="Mission"
          onBack={onBack}
          canGoBack
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full space-y-5">

        {/* Goal cards */}
        <ChoiceGroup layout="stack">
          {GOALS.map((goal) => (
            <ChoiceCard
              key={goal.value}
              value={goal.value}
              selected={selectedGoal === goal.value}
              onSelect={handleGoalSelect}
              icon={goal.icon}
              title={goal.title}
              description={goal.description}
              badge={goal.badge}
              accentColor={goal.accentColor}
            />
          ))}
        </ChoiceGroup>

        {/* Target weight input — appears immediately after goal selection, before Continue */}
        <AnimatePresence>
          {showTargetInput && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2"
            >
              <label
                htmlFor="target-weight"
                className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-disabled)]"
              >
                Target weight ({units === "metric" ? "kg" : "lbs"}){" "}
                <span className="font-normal normal-case tracking-normal text-[var(--color-text-disabled)]">
                  (optional)
                </span>
              </label>
              <div className="relative">
                <input
                  id="target-weight"
                  type="text"
                  inputMode="decimal"
                  value={targetInput}
                  onChange={(e) => {
                    // Allow only numbers and one decimal point
                    const val = e.target.value.replace(/[^\d.]/g, '');
                    const parts = val.split('.');
                    if (parts.length > 2) return; // prevent multiple decimals
                    setTargetInput(val);
                  }}
                  placeholder={units === "metric" ? "e.g. 70" : "e.g. 154"}
                  className={cn(
                    "w-full h-12 pl-4 pr-16 rounded-xl text-base font-medium",
                    "bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border)]",
                    "text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)]",
                    "transition-colors focus:outline-none focus:ring-2",
                    "focus:ring-[var(--color-accent-blue)] focus:ring-offset-2",
                    "focus:ring-offset-[var(--color-bg-base)]"
                  )}
                  aria-describedby="target-weight-hint"
                />
                <span
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--color-text-disabled)] pointer-events-none"
                  aria-hidden="true"
                >
                  {units === "metric" ? "kg" : "lbs"}
                </span>
              </div>
              <p
                id="target-weight-hint"
                className="text-[10px] text-[var(--color-text-disabled)]"
              >
                Used for your goal countdown widget. You can change this anytime.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Sticky CTA */}
      <div className="px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-3 max-w-lg mx-auto w-full bg-gradient-to-t from-[var(--color-bg-base)] via-[var(--color-bg-base)] to-transparent">
        <button
          type="button"
          onClick={() => isValid && onNext()}
          disabled={!isValid}
          className={cn(
            "w-full h-14 rounded-2xl font-bold text-base text-white transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            "focus-visible:ring-[var(--color-accent-blue)] focus-visible:ring-offset-[var(--color-bg-base)]",
            "active:scale-[0.98]",
            isValid
              ? "bg-[var(--color-accent-blue)] hover:brightness-110 shadow-lg shadow-[var(--color-accent-blue)]/20"
              : "bg-[var(--color-bg-surface-elevated)] text-[var(--color-text-disabled)] cursor-not-allowed"
          )}
          aria-disabled={!isValid}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
