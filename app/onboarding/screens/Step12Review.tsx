"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { CountUp } from "@/components/adl/typography/CountUp";
import { calculateAllTargets } from "@/lib/calculations/targets";
import { useCoach } from "@/lib/coach";
import type { OnboardingData } from "@/stores/onboarding.store";
import type { PrimaryGoal } from "@/types/user";

interface Step12ReviewProps {
  data: OnboardingData;
  onComplete: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// PLAN COPY — Goal-specific context for each metric
// ─────────────────────────────────────────────────────────────────────────────

interface PlanCopy {
  calories: { label: string; context: string };
  protein: { label: string; context: string };
  training: { label: string; context: string };
  recovery: { label: string; context: string };
  goal: { label: string; context: string };
}

const PLAN_COPY: Record<PrimaryGoal, PlanCopy> = {
  lose_fat: {
    calories: {
      label: "Daily Calories",
      context: "A sustainable deficit. You'll lose fat while protecting muscle.",
    },
    protein: {
      label: "Protein Target",
      context: "High protein keeps you full and preserves muscle during fat loss.",
    },
    training: {
      label: "Training Days",
      context: "Enough stimulus to progress. Enough rest to recover.",
    },
    recovery: {
      label: "Recovery Focus",
      context: "Your body transforms when you rest, not when you train.",
    },
    goal: {
      label: "Primary Goal",
      context: "We'll prioritize protein, calorie precision, and progressive training.",
    },
  },
  gain_muscle: {
    calories: {
      label: "Daily Calories",
      context: "A controlled surplus. Enough fuel to build without excess fat gain.",
    },
    protein: {
      label: "Protein Target",
      context: "Muscle needs protein. This target supports steady growth.",
    },
    training: {
      label: "Training Days",
      context: "Volume drives muscle growth. We'll structure progressive overload.",
    },
    recovery: {
      label: "Recovery Focus",
      context: "Muscle is built during recovery. Rest is non-negotiable.",
    },
    goal: {
      label: "Primary Goal",
      context: "We'll focus on progressive overload, calorie surplus, and recovery.",
    },
  },
  maintain: {
    calories: {
      label: "Daily Calories",
      context: "Precision at maintenance. Your weight stays stable while performance improves.",
    },
    protein: {
      label: "Protein Target",
      context: "Supports muscle retention and overall health.",
    },
    training: {
      label: "Training Days",
      context: "Consistency without burnout. Performance over volume.",
    },
    recovery: {
      label: "Recovery Focus",
      context: "Maintenance is about sustainable habits, not perfection.",
    },
    goal: {
      label: "Primary Goal",
      context: "We'll focus on performance, health markers, and lifestyle balance.",
    },
  },
  recomp: {
    calories: {
      label: "Daily Calories",
      context: "At or slightly below maintenance. Precision is everything here.",
    },
    protein: {
      label: "Protein Target",
      context: "The highest protein target. Recomp demands it.",
    },
    training: {
      label: "Training Days",
      context: "High training volume + precise nutrition = simultaneous muscle gain and fat loss.",
    },
    recovery: {
      label: "Recovery Focus",
      context: "Recomp is ambitious. Recovery determines success.",
    },
    goal: {
      label: "Primary Goal",
      context: "The hardest goal. We'll need precise macros and consistent training.",
    },
  },
};

const RECOVERY_TEXT: Record<PrimaryGoal, string> = {
  lose_fat: "Sleep & hydration",
  gain_muscle: "Sleep & nutrition timing",
  maintain: "Consistency & adaptability",
  recomp: "Sleep & stress management",
};

const GOAL_LABELS: Record<PrimaryGoal, string> = {
  lose_fat: "Lose Fat",
  gain_muscle: "Gain Muscle",
  maintain: "Maintain & Improve",
  recomp: "Body Recomposition",
};

// ─────────────────────────────────────────────────────────────────────────────
// CHECKLIST ITEMS
// ─────────────────────────────────────────────────────────────────────────────

const CHECKLIST = [
  { label: "Identity learned", key: "identity" },
  { label: "Body understood", key: "body" },
  { label: "Lifestyle mapped", key: "lifestyle" },
  { label: "Mission defined", key: "mission" },
] as const;

/**
 * Screen 12 — Here's What I Learned About You
 *
 * This is NOT a calculation screen.
 * This is proof the coach was listening.
 *
 * Sequence (per ONBOARDING_ENDING_EXPERIENCE.md):
 * 1. Coach: "I've learned a lot about you already."
 * 2. Checklist animates in (staggered, 150ms between items)
 * 3. Coach: "Now I'm building your first plan..."
 * 4. Thinking animation (1500ms pause)
 * 5. Numbers animate in with context (300ms stagger)
 *
 * Total: ~6.5 seconds before CTA appears
 */
export function Step12Review({ data, onComplete }: Step12ReviewProps) {
  const [phase, setPhase] = React.useState<"intro" | "checklist" | "building" | "plan">("intro");
  const [checklistProgress, setChecklistProgress] = React.useState(0);
  const [planProgress, setPlanProgress] = React.useState(0);
  const [showCTA, setShowCTA] = React.useState(false);

  const { say, think, event } = useCoach();

  // Respect reduced motion preference
  const prefersReducedMotion = typeof window !== "undefined" 
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  // Calculate real targets from collected data
  const targets = React.useMemo(() => {
    const identity = {
      dob: data.dob,
      height: data.height,
      weight: data.weight,
      gender: data.gender || undefined
    };
    
    console.log("[Step12Review] Input data (DETAILED):", {
      dob: data.dob,
      dobType: typeof data.dob,
      height: data.height,
      heightType: typeof data.height,
      weight: data.weight,
      weightType: typeof data.weight,
      gender: data.gender,
      goal: data.primaryGoal,
      activity: data.activityLevel,
      workoutDays: data.workoutDaysPerWeek
    });
    
    const result = calculateAllTargets(
      identity,
      data.primaryGoal,
      { activity: data.activityLevel, goals: { waterMl: 3000 } }
    );
    
    console.log("[Step12Review] Calculated targets (DETAILED):", {
      dailyCalories: result.dailyCalories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
      bmr: result.bmr,
      tdee: result.tdee,
      bmi: result.bmi,
      water: result.water,
      fullResult: result
    });
    
    // EMERGENCY: If targets are zero, use sensible defaults
    if (result.dailyCalories === 0 || !result.dailyCalories) {
      console.error("[Step12Review] TARGETS ARE ZERO! Using emergency defaults");
      return {
        dailyCalories: 2000,
        protein: 150,
        carbs: 200,
        fat: 65,
        bmr: 1600,
        tdee: 2200,
        bmi: 22,
        water: 3000
      };
    }
    
    return result;
  }, [data]);

  const copy = PLAN_COPY[data.primaryGoal];

  // Orchestrate the sequence
  React.useEffect(() => {
    event({ type: "context_changed", context: "onboarding", step: 12, label: "review" });

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Reduced motion: skip to final state immediately
    if (prefersReducedMotion) {
      say("Here's your personalized plan.", "speaking");
      setPhase("plan");
      setChecklistProgress(CHECKLIST.length);
      setPlanProgress(5);
      setShowCTA(true);
      return;
    }

    // Phase 1: Intro (0–2000ms)
    say("I've learned a lot about you already.", "speaking");

    // Phase 2: Checklist (2000–2600ms)
    timers.push(setTimeout(() => setPhase("checklist"), 2000));

    CHECKLIST.forEach((_, i) => {
      timers.push(setTimeout(() => setChecklistProgress(i + 1), 2000 + i * 150));
    });

    // Phase 3: Building (2800–4300ms)
    timers.push(setTimeout(() => {
      setPhase("building");
      say("Now I'm building your first plan...", "speaking");
      think(); // Orb enters thinking state
    }, 2800));

    // Phase 4: Plan reveal (4300ms+)
    timers.push(setTimeout(() => {
      setPhase("plan");
      say(""); // Clear message, let numbers speak
    }, 4300));

    // Stagger plan items (300ms between each)
    [0, 1, 2, 3, 4].forEach((i) => {
      timers.push(setTimeout(() => setPlanProgress(i + 1), 4300 + i * 300));
    });

    // Show CTA after last item animates
    timers.push(setTimeout(() => setShowCTA(true), 6100));

    return () => timers.forEach(clearTimeout);
  }, [say, think, event, prefersReducedMotion]);

  const showChecklist = phase !== "intro";
  const showThinking = phase === "building";
  const showPlan = phase === "plan";

  return (
    <div 
      className="flex flex-col min-h-0 items-center justify-center px-6 py-8"
      role="main"
      aria-live="polite"
      aria-label="Your personalized plan"
    >
      {/* Intro message */}
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-lg font-semibold text-center text-[var(--color-text-primary)] mb-8"
          >
            I've learned a lot about you already.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Checklist */}
      <AnimatePresence>
        {showChecklist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-sm space-y-3 mb-8"
          >
            {CHECKLIST.map((item, i) => {
              const isDone = i < checklistProgress;
              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: isDone ? 1 : 0.4, x: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                    {isDone ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: "var(--color-accent-blue)" }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M10 3L4.5 8.5L2 6"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </motion.div>
                    ) : (
                      <div
                        className="w-4 h-4 rounded-full border-2 border-[var(--color-border)]"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: isDone ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}
                  >
                    {item.label}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Building message + thinking animation */}
      <AnimatePresence>
        {showThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center mb-8"
          >
            <p className="text-base font-medium text-[var(--color-text-primary)] mb-4">
              Now I'm building your first plan...
            </p>
            {/* Thinking pulse (subtle ripple) */}
            <div className="flex justify-center">
              <div className="relative w-12 h-12">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "var(--color-accent-blue)", opacity: 0.2 }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plan cards */}
      <AnimatePresence>
        {showPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md space-y-4"
          >
            {/* Calories */}
            {planProgress >= 1 && (
              <PlanCard
                label={copy.calories.label}
                value={targets.dailyCalories}
                unit="kcal"
                context={copy.calories.context}
                delay={0}
              />
            )}

            {/* Protein */}
            {planProgress >= 2 && (
              <PlanCard
                label={copy.protein.label}
                value={targets.protein}
                unit="g per day"
                context={copy.protein.context}
                delay={0.3}
              />
            )}

            {/* Training */}
            {planProgress >= 3 && (
              <PlanCard
                label={copy.training.label}
                value={data.workoutDaysPerWeek}
                unit={data.workoutDaysPerWeek === 1 ? "day per week" : "days per week"}
                context={copy.training.context}
                delay={0.6}
              />
            )}

            {/* Recovery */}
            {planProgress >= 4 && (
              <PlanCard
                label={copy.recovery.label}
                value={RECOVERY_TEXT[data.primaryGoal]}
                context={copy.recovery.context}
                delay={0.9}
                isText
              />
            )}

            {/* Goal */}
            {planProgress >= 5 && (
              <PlanCard
                label={copy.goal.label}
                value={GOAL_LABELS[data.primaryGoal]}
                context={copy.goal.context}
                delay={1.2}
                isText
                highlight
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <AnimatePresence>
        {showCTA && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md mt-8"
          >
            <button
              type="button"
              onClick={onComplete}
              className={cn(
                "w-full h-14 rounded-2xl font-bold text-base text-white transition-all",
                "bg-[var(--color-accent-blue)] hover:brightness-110",
                "shadow-lg shadow-[var(--color-accent-blue)]/20",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "focus-visible:ring-[var(--color-accent-blue)] focus-visible:ring-offset-[var(--color-bg-base)]",
                "active:scale-[0.98]"
              )}
            >
              Continue to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PLAN CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface PlanCardProps {
  label: string;
  value: number | string;
  unit?: string;
  context: string;
  delay: number;
  isText?: boolean;
  highlight?: boolean;
}

function PlanCard({ label, value, unit, context, delay, isText, highlight }: PlanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "p-4 rounded-xl border",
        highlight
          ? "bg-[var(--color-accent-blue)]/5 border-[var(--color-accent-blue)]/30"
          : "bg-[var(--color-bg-surface-elevated)] border-[var(--color-border)]"
      )}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-disabled)] mb-1">
        {label}
      </p>

      <div className="flex items-baseline gap-2 mb-2">
        {isText ? (
          <p className="text-2xl font-black text-[var(--color-text-primary)]">{value}</p>
        ) : (
          <>
            <CountUp
              to={typeof value === "number" ? value : 0}
              duration={0.6}
              className="text-2xl font-black font-mono text-[var(--color-text-primary)]"
            />
            {unit && <span className="text-sm font-medium text-[var(--color-text-secondary)]">{unit}</span>}
          </>
        )}
      </div>

      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{context}</p>
    </motion.div>
  );
}
