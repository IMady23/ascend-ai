"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { CoachOrb } from "./CoachOrb";
import { CoachBubble } from "./CoachBubble";
import { useCoachCore } from "@/lib/coach/CoachCore";

/**
 * CoachPresence — The persistent visual container for the Ascend Coach.
 *
 * Layout (from approved design):
 * ┌─────────────────────────────────────┐
 * │  [Progress Header]                  │
 * │          ● (CoachOrb, 44px)         │
 * │   "Nice to meet you, Alex."         │
 * │   [Understanding you... ██████]     │
 * ├─────────────────────────────────────┤
 * │  [Screen content — scrollable]      │
 * └─────────────────────────────────────┘
 *
 * Visibility rules:
 * - isVisible=true: fully rendered (onboarding, AI Coach page)
 * - isVisible=false: not rendered (brain is still active)
 * - The brain (CoachCore) always runs — only the UI is toggled
 *
 * Context-aware rendering:
 * Each context can choose to show CoachPresence differently.
 * Onboarding: full (orb + bubble + understanding panel)
 * Dashboard: not shown (coach appears in briefing card instead)
 * AI Chat: not shown (conversation IS the coach)
 * Nutrition: not shown (coach chip appears inline instead)
 *
 * Understanding Panel:
 * A compact progress indicator showing what the coach has learned.
 * Replaces the technical "Identity learned ✓" with emotional copy.
 * Only shown during onboarding.
 */

export interface CoachPresenceProps {
  /** Whether to show the understanding panel (onboarding only) */
  showUnderstandingPanel?: boolean;
  /** Padding top applied to the presence container */
  paddingTop?: number;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// UNDERSTANDING PANEL
// "Understanding you... ██████ Growing more personal..."
// Tracks onboarding progress emotionally, not technically.
// ─────────────────────────────────────────────────────────────────────────────

interface UnderstandingPanelProps {
  progress: number; // 0–1
}

function UnderstandingPanel({ progress }: UnderstandingPanelProps) {
  const label = progress < 0.25
    ? "Getting to know you..."
    : progress < 0.5
    ? "Understanding you..."
    : progress < 0.75
    ? "Growing more personal..."
    : progress < 1
    ? "Almost complete..."
    : "Ready.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-1.5 mt-2"
    >
      {/* Label */}
      <p className="text-[10px] font-medium tracking-wide text-[var(--color-text-disabled)]">
        {label}
      </p>

      {/* Progress bar */}
      <div
        className="w-24 h-1 rounded-full overflow-hidden"
        style={{ background: "var(--color-bg-surface-elevated)" }}
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Coach understanding"
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: "var(--color-accent-blue)" }}
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COACH PRESENCE
// ─────────────────────────────────────────────────────────────────────────────

export function CoachPresence({
  showUnderstandingPanel = false,
  paddingTop = 8,
  className,
}: CoachPresenceProps) {
  const { visualState, currentMessage, previousMessage, isVisible, context } =
    useCoachCore();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "flex flex-col items-center gap-2 w-full",
            className
          )}
          style={{ paddingTop }}
        >
          {/* Orb — always rendered when visible, always at 44px */}
          <CoachOrb
            state={visualState}
            size={44}
          />

          {/* Message bubble — compresses not disappears */}
          <CoachBubble
            currentMessage={currentMessage}
            previousMessage={previousMessage}
            className="w-full max-w-sm"
          />

          {/* Understanding panel — onboarding only */}
          {showUnderstandingPanel && (
            <UnderstandingPanelConnected />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONNECTED UNDERSTANDING PANEL
// Reads onboarding step from CoachCore context to compute progress
// ─────────────────────────────────────────────────────────────────────────────

function UnderstandingPanelConnected() {
  const { context } = useCoachCore();
  const memory = React.useMemo(() => {
    // Derive progress from what coach has learned in memory
    // Lazy import to avoid circular deps at module level
    if (typeof window === "undefined") return 0;
    try {
      const { useCoachMemory } = require("@/lib/coach/CoachMemory");
      const m = useCoachMemory.getState().profile;
      let learned = 0;
      if (m.firstName) learned += 0.15;
      if (m.goal) learned += 0.25;
      if (m.bodyCalculated) learned += 0.25;
      if (m.activityLevel) learned += 0.2;
      if (m.onboardingComplete) learned = 1;
      return Math.min(1, learned);
    } catch {
      return 0;
    }
   
  }, [context]);

  return <UnderstandingPanel progress={memory} />;
}
