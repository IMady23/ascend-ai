"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { ProgressHeader } from "@/components/adl/composites/onboarding/ProgressHeader";
import { TimelineSelector } from "@/components/adl/composites/onboarding/TimelineSelector";
import { getProgressPosition, ONBOARDING_TRACKABLE_STEPS } from "@/stores/onboarding.store";
import { useCoach } from "@/lib/coach";

interface Step10ScheduleProps {
  wakeTime: string;    // HH:MM
  sleepTime: string;   // HH:MM
  sleepHours: number;
  timeFormat: "12h" | "24h";
  onUpdate: (wakeTime: string, sleepTime: string, sleepHours: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const SLEEP_HOURS = [4, 5, 6, 7, 8, 9, 10];

/**
 * Screen 10 — Daily Rhythm
 *
 * Wake time + sleep time pickers + sleep goal selector.
 * Uses the existing TimelineSelector primitive.
 *
 * Conversation Rule:
 * - Explains reminders use case (not surveillance)
 * - Mentions recovery module — sleep tracking downstream benefit
 */
export function Step10Schedule({
  wakeTime,
  sleepTime,
  sleepHours,
  timeFormat,
  onUpdate,
  onNext,
  onBack,
}: Step10ScheduleProps) {
  const [localWake, setLocalWake] = React.useState(wakeTime);
  const [localSleep, setLocalSleep] = React.useState(sleepTime);
  const [localSleepHours, setLocalSleepHours] = React.useState(sleepHours);
  const { say, event } = useCoach();

  React.useEffect(() => {
    event({ type: "context_changed", context: "onboarding", step: 10, label: "schedule" });
    say("Your recovery starts here. When does your day start and end?", "speaking");
  }, []);

  React.useEffect(() => {
    onUpdate(localWake, localSleep, localSleepHours);
  }, [localWake, localSleep, localSleepHours, onUpdate]);

  const isValid =
    /^\d{2}:\d{2}$/.test(localWake) &&
    /^\d{2}:\d{2}$/.test(localSleep) &&
    localSleepHours >= 4 &&
    localSleepHours <= 12;

  const progress = getProgressPosition(10);

  return (
    <div className="flex flex-col min-h-0">
      <div className="px-4 pt-3 pb-2 max-w-lg mx-auto w-full">
        <ProgressHeader
          currentStep={progress?.current ?? 9}
          totalSteps={ONBOARDING_TRACKABLE_STEPS}
          label="Schedule"
          onBack={onBack}
          canGoBack
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full space-y-6">
        {/* Wake + Sleep side by side */}
        <div className="space-y-3">
          <p className="text-[10px] text-[var(--color-text-disabled)] text-center">
            Recovery recommendations become more accurate
          </p>
          <div className="grid grid-cols-2 gap-4">
            <TimelineSelector
              value={localWake}
              onChange={setLocalWake}
              format={timeFormat}
              label="Wake Up"
              accentColor="var(--color-accent-gold)"
            />
            <TimelineSelector
              value={localSleep}
              onChange={setLocalSleep}
              format={timeFormat}
              label="Bed Time"
              accentColor="var(--color-accent-blue)"
            />
          </div>
        </div>

        {/* Sleep goal */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-disabled)]">
              Sleep Goal
            </p>
            <span className="text-sm font-semibold text-[var(--color-accent-blue)]">
              {localSleepHours}h / night
            </span>
          </div>
          <div className="flex gap-2 flex-wrap" role="group" aria-label="Select sleep goal in hours">
            {SLEEP_HOURS.map((h) => (
              <motion.button
                key={h}
                type="button"
                onClick={() => setLocalSleepHours(h)}
                whileTap={{ scale: 0.95 }}
                aria-pressed={localSleepHours === h}
                className={cn(
                  "h-10 px-4 rounded-xl text-sm font-semibold transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)]",
                  localSleepHours === h
                    ? "bg-[var(--color-accent-blue)] text-white shadow-sm"
                    : "bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                )}
              >
                {h}h
              </motion.button>
            ))}
          </div>
          <p className="text-[10px] text-[var(--color-text-disabled)]">
            Tracked in the Recovery module. Adjustable anytime.
          </p>
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
