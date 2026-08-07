import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { CoachMessage } from "./CoachMessage";

/**
 * CoachQuestion — A coach message paired with a structured interaction area
 *
 * Used for: Every onboarding step that needs both an AI prompt and a response input
 * Pattern: Coach message on top, interaction slot below
 *
 * Example usage:
 * ```tsx
 * <CoachQuestion
 *   message="What should I call you?"
 *   caption="Your name will personalize your entire experience."
 * >
 *   <TextInput ... />
 * </CoachQuestion>
 * ```
 */

export interface CoachQuestionProps {
  /** The AI coach's conversational message */
  message: React.ReactNode;

  /** Optional secondary context below the message */
  caption?: string;

  /** The user interaction element (input, cards, slider, etc.) */
  children: React.ReactNode;

  /** Emphasize this as a key question */
  emphasized?: boolean;

  /** Delay for entrance animation */
  delay?: number;

  className?: string;
}

export function CoachQuestion({
  message,
  caption,
  children,
  emphasized = false,
  delay = 0,
  className,
}: CoachQuestionProps) {
  return (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      {/* Coach Message */}
      <CoachMessage emphasized={emphasized} delay={delay}>
        <span className="text-base font-medium">{message}</span>
        {caption && (
          <p className="mt-1 text-sm text-[var(--color-text-disabled)]">{caption}</p>
        )}
      </CoachMessage>

      {/* User Interaction Slot */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
