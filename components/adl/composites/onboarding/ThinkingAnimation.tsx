import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

/**
 * ThinkingAnimation — Visual indicator for AI processing / calculation
 *
 * Used for:
 * - Step 10: TDEE/BMR/macro calculation
 * - AI coach responses
 * - Any async operation during onboarding
 *
 * Pattern: Animated dots with staggered fade, optional steps/stages
 *
 * Example usage:
 * ```tsx
 * <ThinkingAnimation
 *   steps={[
 *     { label: "Calculating BMR...", completed: true },
 *     { label: "Adjusting for activity level...", completed: true },
 *     { label: "Generating macro distribution...", completed: false },
 *   ]}
 * />
 * ```
 */

export interface ThinkingStep {
  label: string;
  completed: boolean;
}

export interface ThinkingAnimationProps {
  /** Optional: show multi-stage progress */
  steps?: ThinkingStep[];
  /** Message shown when no steps provided */
  message?: string;
  /** Accent color for completed steps */
  accentColor?: string;
  className?: string;
}

export function ThinkingAnimation({
  steps,
  message = "Analyzing your profile...",
  accentColor = "var(--color-accent-blue)",
  className,
}: ThinkingAnimationProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 py-8",
        className
      )}
    >
      {/* Animated thinking indicator */}
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ background: accentColor }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Steps or message */}
      {steps && steps.length > 0 ? (
        <div className="w-full max-w-sm space-y-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="flex items-center gap-3"
            >
              {/* Checkmark or spinner */}
              {step.completed ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: accentColor }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 3L4.5 8.5L2 6"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              ) : (
                <div className="shrink-0 w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: `color-mix(in srgb, ${accentColor} 30%, transparent)`, borderTopColor: accentColor }} />
              )}

              {/* Label */}
              <span
                className={cn(
                  "text-sm font-medium transition-colors",
                  step.completed
                    ? "text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)]"
                )}
              >
                {step.label}
              </span>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-medium text-[var(--color-text-secondary)]"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
