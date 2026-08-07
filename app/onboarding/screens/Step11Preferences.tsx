"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { ProgressHeader } from "@/components/adl/composites/onboarding/ProgressHeader";
import { getProgressPosition, ONBOARDING_TRACKABLE_STEPS } from "@/stores/onboarding.store";
import { useCoach } from "@/lib/coach";
import type { OnboardingData } from "@/stores/onboarding.store";

interface Step11PreferencesProps {
  theme: OnboardingData["theme"];
  units: OnboardingData["units"];
  timeFormat: OnboardingData["timeFormat"];
  onUpdate: (
    theme: OnboardingData["theme"],
    units: OnboardingData["units"],
    timeFormat: OnboardingData["timeFormat"]
  ) => void;
  onNext: () => void;
  onBack: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// SEGMENTED CONTROL
// ─────────────────────────────────────────────────────────────────────────────

interface SegmentedControlProps<T extends string> {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
  accentColor?: string;
  ariaLabel: string;
}

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  accentColor = "var(--color-accent-blue)",
  ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      className="flex gap-1 p-1 rounded-xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border)]"
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            whileTap={{ scale: 0.97 }}
            role="radio"
            aria-checked={isSelected}
            className={cn(
              "flex-1 h-10 rounded-lg text-sm font-semibold transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "focus-visible:ring-[var(--color-accent-blue)] focus-visible:ring-offset-[var(--color-bg-surface-elevated)]",
              isSelected
                ? "text-white shadow-sm"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            )}
            style={isSelected ? { background: accentColor } : {}}
          >
            {opt.label}
          </motion.button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Screen 11 — App Preferences
 *
 * Last question step. Progress bar is full.
 * CTA says "Finish Setup" instead of "Continue".
 *
 * Conversation Rule:
 * - Coach says "Almost done" — marks the finish line
 * - Lightweight choices — no cognitive load
 * - Defaults auto-detected from locale in store (Principle 3: Infer safely)
 */
export function Step11Preferences({
  theme,
  units,
  timeFormat,
  onUpdate,
  onNext,
  onBack,
}: Step11PreferencesProps) {
  const [localTheme, setLocalTheme] = React.useState(theme);
  const [localUnits, setLocalUnits] = React.useState(units);
  const [localTimeFormat, setLocalTimeFormat] = React.useState(timeFormat);
  const { say, event } = useCoach();

  React.useEffect(() => {
    event({ type: "context_changed", context: "onboarding", step: 11, label: "preferences" });
    say("Almost done. Let's make Ascend feel like yours.", "speaking");
  }, []);

  React.useEffect(() => {
    onUpdate(localTheme, localUnits, localTimeFormat);
  }, [localTheme, localUnits, localTimeFormat, onUpdate]);

  const progress = getProgressPosition(11);

  return (
    <div className="flex flex-col min-h-0">
      <div className="px-4 pt-3 pb-2 max-w-lg mx-auto w-full">
        <ProgressHeader
          currentStep={progress?.current ?? 10}
          totalSteps={ONBOARDING_TRACKABLE_STEPS}
          label="Preferences"
          onBack={onBack}
          canGoBack
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full space-y-6">

        {/* Theme */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-disabled)]">
            Appearance
          </p>
          <SegmentedControl
            value={localTheme}
            options={[
              { value: "light" as const, label: "Light" },
              { value: "dark" as const, label: "Dark" },
              { value: "system" as const, label: "System" },
            ]}
            onChange={setLocalTheme}
            ariaLabel="Select theme"
          />
        </div>

        {/* Units */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-disabled)]">
            Units
          </p>
          <SegmentedControl
            value={localUnits}
            options={[
              { value: "metric" as const, label: "Metric (kg, cm)" },
              { value: "imperial" as const, label: "Imperial (lbs, in)" },
            ]}
            onChange={setLocalUnits}
            ariaLabel="Select measurement units"
          />
        </div>

        {/* Time format */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-disabled)]">
            Time Format
          </p>
          <SegmentedControl
            value={localTimeFormat}
            options={[
              { value: "24h" as const, label: "24-hour" },
              { value: "12h" as const, label: "12-hour (AM/PM)" },
            ]}
            onChange={setLocalTimeFormat}
            ariaLabel="Select time format"
          />
        </div>

        {/* Auto-detection note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[10px] text-[var(--color-text-disabled)] text-center"
        >
          Defaults detected from your device. Change anytime in Settings.
        </motion.p>
      </div>

      <div className="px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-3 max-w-lg mx-auto w-full bg-gradient-to-t from-[var(--color-bg-base)] via-[var(--color-bg-base)] to-transparent">
        <button
          type="button"
          onClick={onNext}
          className={cn(
            "w-full h-14 rounded-2xl font-bold text-base text-white transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            "focus-visible:ring-[var(--color-accent-blue)] focus-visible:ring-offset-[var(--color-bg-base)]",
            "active:scale-[0.98]",
            "bg-[var(--color-accent-blue)] hover:brightness-110 shadow-lg shadow-[var(--color-accent-blue)]/20"
          )}
        >
          Finish Setup
        </button>
      </div>
    </div>
  );
}
