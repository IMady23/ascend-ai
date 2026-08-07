"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { ProgressHeader } from "@/components/adl/composites/onboarding/ProgressHeader";
import { getProgressPosition, ONBOARDING_TRACKABLE_STEPS } from "@/stores/onboarding.store";
import { useCoach } from "@/lib/coach";

interface Step6MotivationProps {
  whyStarted: string;
  fullName: string;
  goalLabel: string;
  onUpdate: (whyStarted: string) => void;
  onNext: () => void;
  onBack: () => void;
}

/**
 * Screen 6 — Motivation
 *
 * Optional. User can skip with no friction.
 * Coach enters "listening" state — this is an intimate question.
 *
 * Conversation Rule:
 * - References their goal (selected in step 5)
 * - Explains why it matters (used during low-motivation moments)
 * - Privacy reassurance — "this stays between us"
 *
 * Principle 16 (Truthful Intelligence):
 * - Explicitly tells user how this data will be used
 * - Never used publicly, only surfaces during encouragement
 *
 * ASCEND_COACH.md: privacy level = "Never Surfaced Directly"
 * This field informs AI behavior but is never quoted verbatim to the user.
 */
export function Step6Motivation({
  whyStarted,
  fullName,
  goalLabel,
  onUpdate,
  onNext,
  onBack,
}: Step6MotivationProps) {
  const [text, setText] = React.useState(whyStarted);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const { say, event, think } = useCoach();

  React.useEffect(() => {
    event({ type: "context_changed", context: "onboarding", step: 6, label: "motivation" });
    // Coach listens — this is the most personal question
    say(`One more thing. Why does ${goalLabel || "this goal"} matter to you?`, "listening");
  }, []);

  React.useEffect(() => {
    onUpdate(text);
    // Store in coach memory when entered — first-class data for future retrieval
    if (text.trim().length > 10) {
      event({ type: "motivation_entered", whyStarted: text.trim() });
    }
  }, [text, onUpdate, event]);

  const progress = getProgressPosition(6);

  return (
    <div className="flex flex-col min-h-0">
      <div className="px-4 pt-3 pb-2 max-w-lg mx-auto w-full">
        <ProgressHeader
          currentStep={progress?.current ?? 5}
          totalSteps={ONBOARDING_TRACKABLE_STEPS}
          label="Motivation"
          onBack={onBack}
          canGoBack
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full space-y-4">
        {/* Privacy note — builds trust before asking for something personal */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="text-xs text-[var(--color-text-disabled)] text-center px-4 leading-relaxed"
        >
          This stays between us. I&apos;ll only use it when you need encouragement.
        </motion.p>

        {/* Textarea */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => think()}
            placeholder="What made you decide to start today?"
            maxLength={500}
            rows={5}
            className={cn(
              "w-full px-4 py-3 rounded-xl text-base resize-none",
              "bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border)]",
              "text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)]",
              "transition-colors focus:outline-none focus:ring-2",
              "focus:ring-[var(--color-accent-blue)] focus:ring-offset-2",
              "focus:ring-offset-[var(--color-bg-base)]",
              "leading-relaxed"
            )}
            aria-label="Why does this goal matter to you"
          />
          <div className="flex justify-between mt-1.5 px-1">
            <span className="text-[10px] text-[var(--color-text-disabled)]">
              {text.length > 0 ? `${text.length}/500` : ""}
            </span>
            <span className="text-[10px] text-[var(--color-text-disabled)]">Optional</span>
          </div>
        </motion.div>
      </div>

      {/* Sticky CTAs */}
      <div className="px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-3 max-w-lg mx-auto w-full bg-gradient-to-t from-[var(--color-bg-base)] via-[var(--color-bg-base)] to-transparent space-y-2">
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
          Continue
        </button>
        {/* Skip — always visible, no guilt */}
        <button
          type="button"
          onClick={() => {
            onUpdate("");
            onNext();
          }}
          className="w-full h-10 text-sm text-[var(--color-text-disabled)] hover:text-[var(--color-text-secondary)] transition-colors focus-visible:outline-none focus-visible:underline"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
