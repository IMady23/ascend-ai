"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { ProgressHeader } from "@/components/adl/composites/onboarding/ProgressHeader";
import { getProgressPosition, ONBOARDING_TRACKABLE_STEPS } from "@/stores/onboarding.store";
import { useCoach } from "@/lib/coach";

interface Step1NameProps {
  fullName: string;
  nickname: string;
  onUpdate: (fullName: string, nickname: string) => void;
  onNext: () => void;
  onBack: () => void;
}

/**
 * Screen 1 — Name
 *
 * Coach UI removed — CoachPresence in layout handles orb + bubble.
 * This screen calls coach.event() and coach.say() only.
 *
 * Coach behavior:
 * - On mount: coach says the intro + question (2 messages)
 * - On valid name: fires name_entered event → rules respond reactively
 * - Orb: starts "speaking", moves to "listening" when input is focused
 */
export function Step1Name({ fullName, nickname, onUpdate, onNext, onBack }: Step1NameProps) {
  const [localName, setLocalName] = React.useState(fullName);
  const [localNickname, setLocalNickname] = React.useState(nickname);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const hasGreeted = React.useRef(false);
  const hasAcknowledged = React.useRef(false);

  const { say, event, think } = useCoach();

  // On mount — coach introduces itself, then asks the question
  React.useEffect(() => {
    if (hasGreeted.current) return;
    hasGreeted.current = true;

    event({ type: "context_changed", context: "onboarding", step: 1, label: "name" });

    // Staggered intro: first message immediately, question after 800ms
    say("I'm Coach — your personal AI health advisor.", "speaking");
    const t = setTimeout(() => {
      say("What should I call you?", "listening");
      setTimeout(() => inputRef.current?.focus(), 200);
    }, 800);
    return () => clearTimeout(t);
   
  }, []);

  // Sync to parent
  React.useEffect(() => {
    onUpdate(localName, localNickname);
  }, [localName, localNickname, onUpdate]);

  const isValid = localName.trim().length >= 2;
  const firstName = localName.trim().split(" ")[0];
  const displayName = localNickname.trim() || firstName;

  // Reactive acknowledgment when name becomes valid
  React.useEffect(() => {
    if (isValid && !hasAcknowledged.current) {
      hasAcknowledged.current = true;
      // Fire the event — experience rules will respond with the greeting
      event({ type: "name_entered", firstName, nickname: localNickname.trim() || undefined });
    } else if (!isValid && hasAcknowledged.current) {
      // Name was cleared — reset so we greet again if re-entered
      hasAcknowledged.current = false;
    }
   
  }, [isValid, firstName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onNext();
  };

  const progress = getProgressPosition(1);

  return (
    <div className="flex flex-col min-h-0">
      <div className="px-4 pt-3 pb-2 max-w-lg mx-auto w-full">
        <ProgressHeader
          currentStep={progress?.current ?? 1}
          totalSteps={ONBOARDING_TRACKABLE_STEPS}
          label="Name"
          onBack={onBack}
          canGoBack={false}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="onboarding-name"
              className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-disabled)] mb-1.5"
            >
              Your name
            </label>
            <input
              ref={inputRef}
              id="onboarding-name"
              type="text"
              autoComplete="given-name"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onFocus={() => think()}
              placeholder="e.g. Alex"
              maxLength={100}
              className={cn(
                "w-full h-12 px-4 rounded-xl text-base",
                "bg-[var(--color-bg-surface-elevated)] border",
                "text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)]",
                "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
                "focus:ring-offset-[var(--color-bg-base)]",
                localName.trim().length > 0 && !isValid
                  ? "border-[var(--color-warning)] focus:ring-[var(--color-warning)]"
                  : "border-[var(--color-border)] focus:ring-[var(--color-accent-blue)]"
              )}
              aria-required="true"
              aria-describedby={localName.trim().length > 0 && !isValid ? "name-error" : undefined}
            />
            {localName.trim().length > 0 && !isValid && (
              <p id="name-error" className="mt-1 text-xs text-[var(--color-warning)]" role="alert">
                Please enter at least 2 characters.
              </p>
            )}
          </div>

          <AnimatePresence>
            {isValid && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <label
                  htmlFor="onboarding-nickname"
                  className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-disabled)] mb-1.5"
                >
                  Nickname{" "}
                  <span className="font-normal normal-case tracking-normal">(optional)</span>
                </label>
                <input
                  id="onboarding-nickname"
                  type="text"
                  autoComplete="nickname"
                  value={localNickname}
                  onChange={(e) => setLocalNickname(e.target.value)}
                  placeholder={`e.g. ${firstName}`}
                  maxLength={50}
                  style={{ colorScheme: 'dark' }}
                  className={cn(
                    "w-full h-12 px-4 rounded-xl text-base",
                    "bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border)]",
                    "text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)]",
                    "transition-colors focus:outline-none focus:ring-2",
                    "focus:ring-[var(--color-accent-blue)] focus:ring-offset-2",
                    "focus:ring-offset-[var(--color-bg-base)]"
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" className="sr-only" aria-hidden="true">Continue</button>
        </form>
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
