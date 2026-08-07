import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { ChevronLeft } from "lucide-react";

/**
 * ProgressHeader — Top navigation and progress indicator for onboarding
 *
 * Used for: Every step in the onboarding flow (Steps 1-9)
 * Pattern: Back button, step label, progress bar, step count
 *
 * Example usage:
 * ```tsx
 * <ProgressHeader
 *   currentStep={3}
 *   totalSteps={9}
 *   label="Mission Definition"
 *   onBack={() => setStep(s => s - 1)}
 *   canGoBack={step > 1}
 * />
 * ```
 */

export interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  label?: string;
  onBack?: () => void;
  canGoBack?: boolean;
  /** Accent color for the progress bar fill */
  accentColor?: string;
  className?: string;
}

export function ProgressHeader({
  currentStep,
  totalSteps,
  label,
  onBack,
  canGoBack = true,
  accentColor = "var(--color-accent-blue)",
  className,
}: ProgressHeaderProps) {
  const progress = Math.max(0, Math.min(1, currentStep / totalSteps));

  return (
    <div className={cn("w-full flex flex-col gap-3", className)}>
      {/* Top row: back button + step count */}
      <div className="flex items-center justify-between">
        <div className="w-10">
          <AnimatePresence>
            {canGoBack && onBack && (
              <motion.button
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                type="button"
                onClick={onBack}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
                  "hover:bg-[var(--color-bg-surface-elevated)]",
                  "transition-colors focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-[var(--color-accent-blue)] focus-visible:ring-offset-2",
                  "focus-visible:ring-offset-[var(--color-bg-base)]"
                )}
                aria-label="Go back"
              >
                <ChevronLeft size={20} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Step label */}
        <AnimatePresence mode="wait">
          <motion.span
            key={label}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-disabled)]"
          >
            {label ?? `Step ${currentStep} of ${totalSteps}`}
          </motion.span>
        </AnimatePresence>

        {/* Step counter */}
        <span
          className="text-xs font-mono font-medium text-[var(--color-text-disabled)] w-10 text-right"
          aria-label={`Step ${currentStep} of ${totalSteps}`}
        >
          {currentStep}/{totalSteps}
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-1 rounded-full overflow-hidden bg-[var(--color-bg-surface-elevated)]"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={0}
        aria-valuemax={totalSteps}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: accentColor }}
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
