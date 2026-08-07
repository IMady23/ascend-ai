"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { ProgressHeader } from "@/components/adl/composites/onboarding/ProgressHeader";
import { ChoiceCard, ChoiceGroup } from "@/components/adl/composites/onboarding/ChoiceCard";
import {
  WheelSelectorGroup,
  type WheelItem,
} from "@/components/adl/composites/onboarding/WheelSelector";
import { getProgressPosition, ONBOARDING_TRACKABLE_STEPS } from "@/stores/onboarding.store";
import { useCoach } from "@/lib/coach";
import type { OnboardingData } from "@/stores/onboarding.store";

interface Step2AboutYouProps {
  fullName: string;  // for personalized copy (Conversation Rule)
  dob: string;
  gender: OnboardingData["gender"];
  onUpdate: (dob: string, gender: OnboardingData["gender"]) => void;
  onNext: () => void;
  onBack: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// WHEEL ITEMS
// ─────────────────────────────────────────────────────────────────────────────

const MONTHS: WheelItem[] = [
  { value: "01", label: "Jan" }, { value: "02", label: "Feb" },
  { value: "03", label: "Mar" }, { value: "04", label: "Apr" },
  { value: "05", label: "May" }, { value: "06", label: "Jun" },
  { value: "07", label: "Jul" }, { value: "08", label: "Aug" },
  { value: "09", label: "Sep" }, { value: "10", label: "Oct" },
  { value: "11", label: "Nov" }, { value: "12", label: "Dec" },
];

const DAYS: WheelItem[] = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1).padStart(2, "0"),
  label: String(i + 1),
}));

const YEARS: WheelItem[] = Array.from({ length: 88 }, (_, i) => {
  const y = new Date().getFullYear() - 13 - i;
  return { value: String(y), label: String(y) };
});

// Gender options — optional, with clear "prefer not to say" option
const GENDER_OPTIONS = [
  { value: "male",              title: "Male",                icon: "♂" },
  { value: "female",            title: "Female",              icon: "♀" },
  { value: "other",             title: "Non-binary / Other",  icon: "⚧" },
  { value: "prefer_not_to_say", title: "Prefer not to say",   icon: "—" },
] as const;

/**
 * Screen 2 — About You
 *
 * Collects date of birth and gender (optional).
 * Psychologically separate from height/weight — this is about identity,
 * not physical measurements.
 *
 * Conversation Rule:
 * - References user's name from Step 1
 * - Explains why DOB matters (age affects metabolism calculation)
 * - Gender explained as optional for BMR precision
 *
 * Principle 13 (Zero Dead Screens):
 * - OrbedCoachMessage with "speaking" state shows AI is present and engaged
 */
export function Step2AboutYou({
  fullName,
  dob,
  gender,
  onUpdate,
  onNext,
  onBack,
}: Step2AboutYouProps) {
  const firstName = fullName.trim().split(" ")[0] || "there";
  const { say, event } = useCoach();

  React.useEffect(() => {
    event({ type: "context_changed", context: "onboarding", step: 2, label: "about_you" });
    say(`Nice to meet you, ${firstName}. I need your date of birth to calculate your metabolism — age is a key input for your calorie target.`, "speaking");
   
  }, []);

  const [dobYear, dobMonth, dobDay] = dob.split("-");
  const [month, setMonth] = React.useState<string>(dobMonth ?? "01");
  const [day, setDay] = React.useState<string>(dobDay ?? "01");
  const [year, setYear] = React.useState<string>(dobYear ?? "2000");
  const [selectedGender, setSelectedGender] =
    React.useState<OnboardingData["gender"]>(gender);

  // Sync to parent on every change
  React.useEffect(() => {
    const newDob = `${year}-${month}-${day}`;
    onUpdate(newDob, selectedGender);
  }, [month, day, year, selectedGender, onUpdate]);

  const isValid = month && day && year && year.length === 4;

  const progress = getProgressPosition(2);

  return (
    <div className="flex flex-col min-h-[100svh]">
      {/* Progress header */}
      <div className="px-4 pt-4 pb-2 max-w-lg mx-auto w-full">
        <ProgressHeader
          currentStep={progress?.current ?? 2}
          totalSteps={ONBOARDING_TRACKABLE_STEPS}
          label="About You"
          onBack={onBack}
          canGoBack
        />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full space-y-6">

        {/* Date of Birth */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-disabled)]">
            Date of Birth
          </p>
          <WheelSelectorGroup
            columns={[
              {
                items: MONTHS,
                selected: month,
                onSelect: (v) => setMonth(String(v)),
                label: "Month",
                "aria-label": "Select birth month",
              },
              {
                items: DAYS,
                selected: day,
                onSelect: (v) => setDay(String(v)),
                label: "Day",
                "aria-label": "Select birth day",
              },
              {
                items: YEARS,
                selected: year,
                onSelect: (v) => setYear(String(v)),
                label: "Year",
                "aria-label": "Select birth year",
              },
            ]}
            visibleCount={5}
            itemHeight={44}
          />
        </div>

        {/* Gender — optional, with clear explanation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-disabled)]">
              Gender
            </p>
            <span className="text-xs text-[var(--color-text-disabled)]">
              Optional — improves accuracy
            </span>
          </div>
          <ChoiceGroup layout="grid">
            {GENDER_OPTIONS.map((opt) => (
              <ChoiceCard
                key={opt.value}
                value={opt.value}
                selected={selectedGender === opt.value}
                onSelect={(v) =>
                  setSelectedGender(v as OnboardingData["gender"])
                }
                icon={
                  <span className="text-lg" aria-hidden="true">
                    {opt.icon}
                  </span>
                }
                title={opt.title}
                accentColor="var(--color-accent-blue)"
              />
            ))}
          </ChoiceGroup>
          <p className="text-[10px] text-[var(--color-text-disabled)] text-center leading-relaxed">
            Used only to refine your calorie calculation. Never shared.
          </p>
        </div>

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
