"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { ProgressHeader } from "@/components/adl/composites/onboarding/ProgressHeader";
import {
  WheelSelectorGroup,
  type WheelItem,
} from "@/components/adl/composites/onboarding/WheelSelector";
import { calculateBMI, getBMICategory } from "@/lib/calculations/targets";
import { getProgressPosition, ONBOARDING_TRACKABLE_STEPS } from "@/stores/onboarding.store";
import { useCoach } from "@/lib/coach";

interface Step3YourBodyProps {
  fullName: string;  // for personalized copy
  height: number;    // cm
  weight: number;    // kg
  units: "metric" | "imperial";
  onUpdate: (height: number, weight: number) => void;
  onNext: () => void;
  onBack: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// WHEEL ITEMS
// ─────────────────────────────────────────────────────────────────────────────

const CM_ITEMS: WheelItem[] = Array.from({ length: 121 }, (_, i) => ({
  value: i + 100,
  label: `${i + 100} cm`,
}));

const FT_ITEMS: WheelItem[] = Array.from({ length: 4 }, (_, i) => ({
  value: i + 4,
  label: `${i + 4} ft`,
}));

const IN_ITEMS: WheelItem[] = Array.from({ length: 12 }, (_, i) => ({
  value: i,
  label: `${i} in`,
}));

const KG_ITEMS: WheelItem[] = Array.from({ length: 171 }, (_, i) => ({
  value: i + 30,
  label: `${i + 30} kg`,
}));

const LBS_ITEMS: WheelItem[] = Array.from({ length: 375 }, (_, i) => ({
  value: i + 66,
  label: `${i + 66} lbs`,
}));

// ─────────────────────────────────────────────────────────────────────────────
// UNIT CONVERSION
// ─────────────────────────────────────────────────────────────────────────────

function cmToFtIn(cm: number): { ft: number; inches: number } {
  const totalInches = cm / 2.54;
  return { ft: Math.floor(totalInches / 12), inches: Math.round(totalInches % 12) };
}

function ftInToCm(ft: number, inches: number): number {
  return Math.round((ft * 12 + inches) * 2.54);
}

function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462);
}

function lbsToKg(lbs: number): number {
  return Math.round(lbs / 2.20462);
}

/**
 * Screen 3 — Your Body
 *
 * Collects height and weight. Shows live BMI after both are valid.
 * Psychologically separate from Screen 2 (About You) — this is physical data,
 * not identity data. Lighter cognitive load per screen.
 *
 * Conversation Rule:
 * - References user's name
 * - Explains height/weight are for metabolism and goal tracking, not judgment
 * - BMI shown immediately as "a useful baseline, not a goal"
 *
 * Principle 13 (Zero Dead Screens):
 * - OrbedCoachMessage with "speaking" state
 * - Live BMI creates instant feedback (AI is doing something with the data)
 */
export function Step3YourBody({ fullName, height, weight, units, onUpdate, onNext, onBack }: Step3YourBodyProps) {
  const firstName = fullName.trim().split(" ")[0] || "there";
  const { say, event } = useCoach();

  React.useEffect(() => {
    event({ type: "context_changed", context: "onboarding", step: 3, label: "body" });
    say(`Almost there, ${firstName}. These measurements let me calculate your metabolism. Once you continue, I'll run the full analysis.`, "speaking");
   
  }, []);

  // Imperial derived state
  const { ft, inches } = cmToFtIn(height);
  const lbs = kgToLbs(weight);

  // Local wheel state
  const [heightCm, setHeightCm] = React.useState<number>(height);
  const [weightKg, setWeightKg] = React.useState<number>(weight);
  const [heightFt, setHeightFt] = React.useState<number>(ft);
  const [heightIn, setHeightIn] = React.useState<number>(inches);
  const [weightLbs, setWeightLbs] = React.useState<number>(lbs);

  // Sync to parent
  React.useEffect(() => {
    const finalHeightCm = units === "metric" ? heightCm : ftInToCm(heightFt, heightIn);
    const finalWeightKg = units === "metric" ? weightKg : lbsToKg(weightLbs);
    onUpdate(finalHeightCm, finalWeightKg);
  }, [heightCm, weightKg, heightFt, heightIn, weightLbs, units, onUpdate]);

  const finalHeightCm = units === "metric" ? heightCm : ftInToCm(heightFt, heightIn);
  const finalWeightKg = units === "metric" ? weightKg : lbsToKg(weightLbs);

  const isValid =
    finalHeightCm >= 100 && finalHeightCm <= 250 &&
    finalWeightKg >= 30 && finalWeightKg <= 300;

  // Live BMI
  const bmi = isValid ? calculateBMI(finalWeightKg, finalHeightCm) : null;
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  const progress = getProgressPosition(3);

  return (
    <div className="flex flex-col min-h-[100svh]">
      {/* Progress header */}
      <div className="px-4 pt-4 pb-2 max-w-lg mx-auto w-full">
        <ProgressHeader
          currentStep={progress?.current ?? 3}
          totalSteps={ONBOARDING_TRACKABLE_STEPS}
          label="Your Body"
          onBack={onBack}
          canGoBack
        />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full space-y-6">

        {/* Height */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-disabled)]">
            Height
          </p>
          {units === "metric" ? (
            <WheelSelectorGroup
              columns={[
                {
                  items: CM_ITEMS,
                  selected: heightCm,
                  onSelect: (v) => setHeightCm(Number(v)),
                  label: "cm",
                  "aria-label": "Select height in centimetres",
                },
              ]}
              visibleCount={5}
              itemHeight={44}
            />
          ) : (
            <WheelSelectorGroup
              columns={[
                {
                  items: FT_ITEMS,
                  selected: heightFt,
                  onSelect: (v) => setHeightFt(Number(v)),
                  label: "ft",
                  "aria-label": "Select feet",
                },
                {
                  items: IN_ITEMS,
                  selected: heightIn,
                  onSelect: (v) => setHeightIn(Number(v)),
                  label: "in",
                  "aria-label": "Select inches",
                },
              ]}
              visibleCount={5}
              itemHeight={44}
            />
          )}
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-disabled)]">
            Current Weight
          </p>
          {units === "metric" ? (
            <WheelSelectorGroup
              columns={[
                {
                  items: KG_ITEMS,
                  selected: weightKg,
                  onSelect: (v) => setWeightKg(Number(v)),
                  label: "kg",
                  "aria-label": "Select weight in kilograms",
                },
              ]}
              visibleCount={5}
              itemHeight={44}
            />
          ) : (
            <WheelSelectorGroup
              columns={[
                {
                  items: LBS_ITEMS,
                  selected: weightLbs,
                  onSelect: (v) => setWeightLbs(Number(v)),
                  label: "lbs",
                  "aria-label": "Select weight in pounds",
                },
              ]}
              visibleCount={5}
              itemHeight={44}
            />
          )}
        </div>

        {/* Live BMI — instant feedback showing AI is using the data */}
        {bmi && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border)]"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-disabled)]">
                Your BMI
              </p>
              <p className="text-2xl font-black font-mono text-[var(--color-text-primary)] mt-0.5">
                {bmi}
              </p>
              <p className="text-xs text-[var(--color-text-disabled)] mt-1">
                {finalWeightKg.toFixed(1)} kg • {finalHeightCm} cm
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--color-text-disabled)]">Category</p>
              <p className="text-sm font-semibold text-[var(--color-text-primary)] mt-0.5">
                {bmiCategory}
              </p>
              <p className="text-[10px] text-[var(--color-text-disabled)] mt-0.5">
                A baseline, not a goal.
              </p>
            </div>
          </motion.div>
        )}

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
