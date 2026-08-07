"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

/**
 * CoachBubble — The coach's floating message display.
 *
 * Behavior (from ASCEND_COACH.md):
 * - Messages do NOT disappear — they compress into a single line
 * - When a new message arrives, the previous compresses and fades slightly
 * - The new message expands in, replacing it
 * - User always knows the coach's last thought
 *
 * This is the "message transitions, not disappears" pattern.
 *
 * States:
 * - "full"       — current message, fully expanded, full opacity
 * - "compressed" — previous message, one line, reduced opacity
 * - "hidden"     — no message, component not shown
 */

export interface CoachBubbleProps {
  /** The current message to display. null = compressed/hidden state */
  currentMessage: string | null;
  /** The previous message (shown compressed while current loads) */
  previousMessage: string | null;
  className?: string;
}

export function CoachBubble({
  currentMessage,
  previousMessage,
  className,
}: CoachBubbleProps) {
  // Don't render at all if no messages have ever been shown
  if (!currentMessage && !previousMessage) return null;

  return (
    <div className={cn("relative w-full max-w-sm mx-auto", className)}>
      {/* Previous message — compressed, fades as current arrives */}
      <AnimatePresence>
        {!currentMessage && previousMessage && (
          <motion.div
            key="previous"
            initial={{ opacity: 0.45, height: "auto" }}
            animate={{ opacity: 0.45, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-xs text-[var(--color-text-disabled)] text-center truncate px-4">
              {previousMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current message — full, expanded */}
      <AnimatePresence mode="wait">
        {currentMessage && (
          <motion.div
            key={currentMessage}
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="px-4 py-2.5 rounded-2xl text-center"
            style={{
              background: "var(--color-bg-surface-elevated)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p className="text-sm font-medium text-[var(--color-text-primary)] leading-snug">
              {currentMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compressed previous — shown when there IS a current message */}
      {/* This creates the "compress not disappear" effect */}
      <AnimatePresence>
        {currentMessage && previousMessage && previousMessage !== currentMessage && (
          <motion.div
            key={`prev-${previousMessage}`}
            initial={{ opacity: 0.5, maxHeight: 24 }}
            animate={{ opacity: 0, maxHeight: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-[10px] text-[var(--color-text-disabled)] text-center truncate px-4 pb-1">
              {previousMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
