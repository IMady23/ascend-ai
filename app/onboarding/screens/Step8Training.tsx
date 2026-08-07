"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { ProgressHeader } from "@/components/adl/composites/onboarding/ProgressHeader";
import { getProgressPosition, ONBOARDING_TRACKABLE_STEPS } from "@/stores/onboarding.store";
import { useCoach } from "@/lib/coach";

interface Step8TrainingProps {
  workoutDaysPerWeek: number;
  workoutDurationMin: number;
  onUpdate: (days: number, duration: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DURATION_MARKERS = [15, 30, 45, 60, 75, 90, 120, 180];

/**
 * Screen 8 — Training Commitment
 *
 * Week calendar for days + slider for duration.
 * Selects N consecutive days starting from Monday by default.
 * User can tap any combination to customize.
 *
 * Conversation Rule:
 * - "Consistency beats perfection" — sets realistic expectations
 * - Explains downstream use (mission schedule)
 * - Sensible defaults (4 days, 60 min) pre-selected
 */
export function Step8Training({
  workoutDaysPerWeek,
  workoutDurationMin,
  onUpdate,
  onNext,
  onBack,
}: Step8TrainingProps) {
  // Track which days are selected (0=Mon, 6=Sun)
  const [selectedDays, setSelectedDays] = React.useState<Set<number>>(() => {
    // Default: first N days selected based on workoutDaysPerWeek
    const s = new Set<number>();
    for (let i = 0; i < workoutDaysPerWeek; i++) s.add(i);
    return s;
  });
  const [duration, setDuration] = React.useState(workoutDurationMin);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const hasAcknowledged = React.useRef(false);
  const { say, event } = useCoach();

  React.useEffect(() => {
    event({ type: "context_changed", context: "onboarding", step: 8, label: "training" });
    say("How many days can you realistically train? Consistency beats perfection.", "speaking");
  }, []);

  const toggleDay = (dayIndex: number) => {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayIndex)) {
        // Don't allow deselecting the last day
        if (next.size <= 1) return prev;
        next.delete(dayIndex);
      } else {
        next.add(dayIndex);
      }
      return next;
    });
  };

  // Sync to parent whenever selection changes
  React.useEffect(() => {
    onUpdate(selectedDays.size, duration);
  }, [selectedDays, duration, onUpdate]);

  // Coach encouragement after days are selected
  React.useEffect(() => {
    if (selectedDays.size >= 2 && !hasAcknowledged.current) {
      hasAcknowledged.current = true;
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
      setTimeout(() => {
        say("That's a great starting point. We can always adjust it later.", "speaking");
      }, 400);
    }
  }, [selectedDays.size, say]);

  const isValid = selectedDays.size >= 1 && duration >= 15;
  const progress = getProgressPosition(8);

  return (
    <div className="flex flex-col min-h-0">
      <div className="px-4 pt-3 pb-2 max-w-lg mx-auto w-full">
        <ProgressHeader
          currentStep={progress?.current ?? 7}
          totalSteps={ONBOARDING_TRACKABLE_STEPS}
          label="Training"
          onBack={onBack}
          canGoBack
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full space-y-8">

        {/* Days per week */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-disabled)]">
                Training Days
              </p>
              <p className="text-[10px] text-[var(--color-text-disabled)] mt-0.5">
                Builds your mission schedule
              </p>
            </div>
            <span className="text-sm font-semibold text-[var(--color-accent-blue)]">
              {selectedDays.size} {selectedDays.size === 1 ? "day" : "days"}/week
            </span>
          </div>

          {/* Week calendar */}
          <div
            className="flex gap-2 justify-between"
            role="group"
            aria-label="Select training days"
          >
            {DAY_LABELS.map((label, i) => {
              const isSelected = selectedDays.has(i);
              return (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(i)}
                  whileTap={{ scale: 0.92 }}
                  aria-label={`${DAY_NAMES[i]} — ${isSelected ? "selected" : "not selected"}`}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex-1 aspect-square rounded-xl flex items-center justify-center text-sm font-bold",
                    "min-w-[36px] max-w-[52px]",
                    "transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)]",
                    isSelected
                      ? "bg-[var(--color-accent-blue)] text-white shadow-sm shadow-[var(--color-accent-blue)]/30"
                      : "bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                  )}
                >
                  {label}
                </motion.button>
              );
            })}
          </div>

          {/* Animated confirmation */}
          <AnimatePresence>
            {showConfirmation && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.3 }}
                className="text-xs text-center text-[var(--color-accent-blue)] font-medium"
              >
                {selectedDays.size} training {selectedDays.size === 1 ? "day" : "days"} selected
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Session duration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-disabled)]">
              Session Length
            </p>
            <span className="text-sm font-semibold text-[var(--color-accent-blue)]">
              {duration} min
            </span>
          </div>

          {/* Duration markers */}
          <div className="flex gap-1.5 flex-wrap">
            {DURATION_MARKERS.map((min) => (
              <motion.button
                key={min}
                type="button"
                onClick={() => setDuration(min)}
                whileTap={{ scale: 0.95 }}
                aria-pressed={duration === min}
                className={cn(
                  "h-9 px-3 rounded-lg text-sm font-semibold transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)]",
                  duration === min
                    ? "bg-[var(--color-accent-blue)] text-white shadow-sm"
                    : "bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                )}
              >
                {min < 60 ? `${min}m` : `${min / 60}h`}
              </motion.button>
            ))}
          </div>

          {/* Summary */}
          <motion.p
            key={`${selectedDays.size}-${duration}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-[var(--color-text-disabled)] text-center"
          >
            {selectedDays.size} × {duration} min/week ={" "}
            <span className="text-[var(--color-text-secondary)] font-medium">
              {selectedDays.size * duration} min total
            </span>
          </motion.p>
        </div>
      </div>

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
