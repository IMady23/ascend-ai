"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { ProgressHeader } from "@/components/adl/composites/onboarding/ProgressHeader";
import {
  ChoiceCard,
  ChoiceGroup,
} from "@/components/adl/composites/onboarding/ChoiceCard";
import { getProgressPosition, ONBOARDING_TRACKABLE_STEPS } from "@/stores/onboarding.store";
import { useCoach } from "@/lib/coach";
import type { ActivityLevel, FitnessExperience } from "@/types/user";

interface Step7ActivityProps {
  activityLevel: ActivityLevel;
  fitnessExperience: FitnessExperience;
  onUpdate: (activityLevel: ActivityLevel, fitnessExperience: FitnessExperience) => void;
  onNext: () => void;
  onBack: () => void;
}

const ACTIVITY_OPTIONS: Array<{
  value: ActivityLevel;
  title: string;
  description: string;
  badge?: string;
}> = [
  { value: "sedentary", title: "Sedentary",         description: "Office job, minimal movement" },
  { value: "light",     title: "Lightly Active",    description: "Light exercise 1–3 days/week" },
  { value: "moderate",  title: "Moderately Active", description: "3–5 workouts per week", badge: "Common" },
  { value: "active",    title: "Very Active",       description: "Intense training 6–7 days/week" },
  { value: "athlete",   title: "Athlete",           description: "Physical job or training twice daily" },
];

const EXPERIENCE_OPTIONS: Array<{
  value: FitnessExperience;
  title: string;
  description: string;
}> = [
  { value: "beginner",     title: "Beginner",     description: "New to training or returning after a break" },
  { value: "intermediate", title: "Intermediate", description: "Consistent training for 6+ months" },
  { value: "advanced",     title: "Advanced",     description: "Years of experience, know my way around" },
];

/**
 * Screen 7 — Activity
 *
 * Two sequential questions on one screen.
 * Activity level → TDEE multiplier.
 * Fitness experience → workout complexity + AI explanation depth.
 *
 * Experience cards slide in after activity is selected — progressive disclosure.
 *
 * Conversation Rule:
 * - References goal context ("to hit your [goal], I need to know your starting point")
 * - Explains what TDEE is in plain language
 * - Leads naturally into training commitment
 */
export function Step7Activity({
  activityLevel,
  fitnessExperience,
  onUpdate,
  onNext,
  onBack,
}: Step7ActivityProps) {
  const [selectedActivity, setSelectedActivity] = React.useState<ActivityLevel>(activityLevel);
  const [selectedExperience, setSelectedExperience] = React.useState<FitnessExperience>(fitnessExperience);
  const hasAcknowledgedActivity = React.useRef(false);
  const { say, event } = useCoach();

  React.useEffect(() => {
    event({ type: "context_changed", context: "onboarding", step: 7, label: "activity" });
    say("How active is your typical week? This sets your daily calorie target.", "speaking");
  }, []);

  const handleActivitySelect = (value: string) => {
    const level = value as ActivityLevel;
    setSelectedActivity(level);
    onUpdate(level, selectedExperience);
    
    // Fire event for experience rules
    if (!hasAcknowledgedActivity.current) {
      hasAcknowledgedActivity.current = true;
      event({ type: "activity_selected", activityLevel: level, fitnessExperience: selectedExperience });
    }
    
    // Ask about experience after activity is chosen
    setTimeout(() => {
      say("And how experienced are you with structured training?", "speaking");
    }, 400);
  };

  const handleExperienceSelect = (value: string) => {
    const exp = value as FitnessExperience;
    setSelectedExperience(exp);
    onUpdate(selectedActivity, exp);
  };

  const isValid = !!selectedActivity && !!selectedExperience;
  const progress = getProgressPosition(7);

  return (
    <div className="flex flex-col min-h-0">
      <div className="px-4 pt-3 pb-2 max-w-lg mx-auto w-full">
        <ProgressHeader
          currentStep={progress?.current ?? 6}
          totalSteps={ONBOARDING_TRACKABLE_STEPS}
          label="Activity"
          onBack={onBack}
          canGoBack
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full space-y-6">
        {/* Activity level */}
        <ChoiceGroup layout="stack">
          {ACTIVITY_OPTIONS.map((opt) => (
            <ChoiceCard
              key={opt.value}
              value={opt.value}
              selected={selectedActivity === opt.value}
              onSelect={handleActivitySelect}
              title={opt.title}
              description={opt.description}
              badge={opt.badge}
              accentColor="var(--color-accent-blue)"
            />
          ))}
        </ChoiceGroup>

        {/* Experience — slides in after activity selected */}
        <AnimatePresence>
          {selectedActivity && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-disabled)]">
                Training Experience
              </p>
              <ChoiceGroup layout="stack">
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <ChoiceCard
                    key={opt.value}
                    value={opt.value}
                    selected={selectedExperience === opt.value}
                    onSelect={handleExperienceSelect}
                    title={opt.title}
                    description={opt.description}
                    accentColor="var(--color-accent-workout)"
                  />
                ))}
              </ChoiceGroup>
            </motion.div>
          )}
        </AnimatePresence>
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
