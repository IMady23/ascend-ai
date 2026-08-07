"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { ProgressHeader } from "@/components/adl/composites/onboarding/ProgressHeader";
import { ChoiceCard, ChoiceGroup } from "@/components/adl/composites/onboarding/ChoiceCard";
import { getProgressPosition, ONBOARDING_TRACKABLE_STEPS } from "@/stores/onboarding.store";
import { useCoach } from "@/lib/coach";
import type { DietType } from "@/types/user";

interface Step9NutritionProps {
  dietType: DietType;
  allergies: string[];
  onUpdate: (dietType: DietType, allergies: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const DIET_OPTIONS: Array<{ value: DietType; title: string; description: string }> = [
  { value: "non_vegetarian", title: "No Restrictions",  description: "I eat everything" },
  { value: "vegetarian",     title: "Vegetarian",        description: "No meat or fish" },
  { value: "vegan",          title: "Vegan",             description: "No animal products" },
  { value: "eggetarian",     title: "Eggetarian",        description: "Eggs and dairy, no meat" },
];

const COMMON_ALLERGENS = ["Dairy", "Gluten", "Nuts", "Soy", "Shellfish", "Eggs"];

/**
 * Screen 9 — Nutrition Foundation
 *
 * Diet type (single select) + allergens (multi-select chips).
 * Allergen chips appear after diet type is selected.
 * Custom allergen text input for anything not in the list.
 */
export function Step9Nutrition({
  dietType,
  allergies,
  onUpdate,
  onNext,
  onBack,
}: Step9NutritionProps) {
  const [selectedDiet, setSelectedDiet] = React.useState<DietType>(dietType);
  const [selectedAllergens, setSelectedAllergens] = React.useState<Set<string>>(
    new Set(allergies)
  );
  const [customAllergen, setCustomAllergen] = React.useState("");
  const [showCustomInput, setShowCustomInput] = React.useState(false);
  const { say, event } = useCoach();

  React.useEffect(() => {
    event({ type: "context_changed", context: "onboarding", step: 9, label: "nutrition" });
    say("There aren't any good or bad diets. I just want to recommend meals you'll actually enjoy.", "speaking");
  }, []);

  const handleDietSelect = (value: string) => {
    setSelectedDiet(value as DietType);
    onUpdate(value as DietType, Array.from(selectedAllergens));
  };

  const toggleAllergen = (allergen: string) => {
    setSelectedAllergens((prev) => {
      const next = new Set(prev);
      if (next.has(allergen)) next.delete(allergen);
      else next.add(allergen);
      onUpdate(selectedDiet, Array.from(next));
      return next;
    });
  };

  const addCustomAllergen = () => {
    const trimmed = customAllergen.trim();
    if (!trimmed) return;
    setSelectedAllergens((prev) => {
      const next = new Set(prev);
      next.add(trimmed);
      onUpdate(selectedDiet, Array.from(next));
      return next;
    });
    setCustomAllergen("");
    setShowCustomInput(false);
  };

  const isValid = !!selectedDiet;
  const progress = getProgressPosition(9);

  return (
    <div className="flex flex-col min-h-0">
      <div className="px-4 pt-3 pb-2 max-w-lg mx-auto w-full">
        <ProgressHeader
          currentStep={progress?.current ?? 8}
          totalSteps={ONBOARDING_TRACKABLE_STEPS}
          label="Nutrition"
          onBack={onBack}
          canGoBack
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full space-y-6">
        {/* Diet type */}
        <ChoiceGroup layout="stack">
          {DIET_OPTIONS.map((opt) => (
            <ChoiceCard
              key={opt.value}
              value={opt.value}
              selected={selectedDiet === opt.value}
              onSelect={handleDietSelect}
              title={opt.title}
              description={opt.description}
              accentColor="var(--color-accent-nutrition)"
            />
          ))}
        </ChoiceGroup>

        {/* Allergen chips — reveal after diet selected */}
        <AnimatePresence>
          {selectedDiet && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-disabled)]">
                  Allergies
                </p>
                <span className="text-xs text-[var(--color-text-disabled)]">Optional</span>
              </div>

              <div className="flex flex-wrap gap-2" role="group" aria-label="Select allergies">
                {COMMON_ALLERGENS.map((allergen) => {
                  const isSelected = selectedAllergens.has(allergen);
                  return (
                    <motion.button
                      key={allergen}
                      type="button"
                      onClick={() => toggleAllergen(allergen)}
                      whileTap={{ scale: 0.95 }}
                      aria-pressed={isSelected}
                      className={cn(
                        "h-9 px-3 rounded-full text-sm font-medium transition-all",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-nutrition)]",
                        isSelected
                          ? "bg-[var(--color-accent-nutrition)] text-white shadow-sm"
                          : "bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                      )}
                    >
                      {allergen}
                    </motion.button>
                  );
                })}

                {/* Custom allergens */}
                {Array.from(selectedAllergens)
                  .filter((a) => !COMMON_ALLERGENS.includes(a))
                  .map((allergen) => (
                    <motion.button
                      key={allergen}
                      type="button"
                      onClick={() => toggleAllergen(allergen)}
                      className="h-9 px-3 rounded-full text-sm font-medium bg-[var(--color-accent-nutrition)] text-white"
                    >
                      {allergen} ×
                    </motion.button>
                  ))}

                {/* Add more chip */}
                <button
                  type="button"
                  onClick={() => setShowCustomInput((v) => !v)}
                  className={cn(
                    "h-9 px-3 rounded-full text-sm font-medium transition-all",
                    "bg-[var(--color-bg-surface-elevated)] border border-dashed border-[var(--color-border)]",
                    "text-[var(--color-text-disabled)] hover:text-[var(--color-text-secondary)]"
                  )}
                >
                  + Add more
                </button>
              </div>

              {/* Custom input */}
              <AnimatePresence>
                {showCustomInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-2 overflow-hidden"
                  >
                    <input
                      type="text"
                      value={customAllergen}
                      onChange={(e) => setCustomAllergen(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addCustomAllergen()}
                      placeholder="e.g. Sesame"
                      autoFocus
                      className={cn(
                        "flex-1 h-9 px-3 rounded-lg text-sm",
                        "bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border)]",
                        "text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)]",
                        "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-nutrition)]"
                      )}
                    />
                    <button
                      type="button"
                      onClick={addCustomAllergen}
                      className="h-9 px-3 rounded-lg text-sm font-medium bg-[var(--color-accent-nutrition)] text-white"
                    >
                      Add
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
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
