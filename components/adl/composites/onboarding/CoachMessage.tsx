import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { Sparkles } from "lucide-react";

/**
 * CoachMessage — AI coach's conversational message bubble
 *
 * Used for: AI questions, explanations, encouragement, follow-ups
 * Pattern: Left-aligned, with coach avatar/icon, conversational tone
 *
 * Example usage:
 * ```tsx
 * <CoachMessage>
 *   First, let me introduce myself properly.
 *   I'm Coach—your AI fitness and nutrition advisor.
 * </CoachMessage>
 * ```
 */

export interface CoachMessageProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Show the coach avatar/icon?
   * Default: true (always show on first message, optional on follow-ups)
   */
  showAvatar?: boolean;
  /**
   * Emphasize this message (border highlight, subtle glow)
   * Use for: key questions, important context
   */
  emphasized?: boolean;
  /**
   * Delay before animating in (stagger conversations)
   */
  delay?: number;
}

export function CoachMessage({
  children,
  className,
  showAvatar = true,
  emphasized = false,
  delay = 0,
}: CoachMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn("flex items-start gap-3 w-full max-w-2xl", className)}
    >
      {/* Coach Avatar */}
      {showAvatar && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.1, type: "spring", stiffness: 300 }}
          className={cn(
            "shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
            emphasized
              ? "bg-[var(--color-accent-blue)] shadow-lg shadow-[var(--color-accent-blue)]/20"
              : "bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border)]"
          )}
        >
          <Sparkles
            size={18}
            className={cn(
              emphasized ? "text-white" : "text-[var(--color-accent-blue)]"
            )}
          />
        </motion.div>
      )}

      {/* Message Bubble */}
      <div
        className={cn(
          "flex-1 rounded-2xl rounded-tl-sm px-4 py-3 text-base leading-relaxed",
          emphasized
            ? "bg-[var(--color-accent-blue)]/5 border border-[var(--color-accent-blue)]/20 shadow-sm text-[var(--color-text-primary)]"
            : "bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}
