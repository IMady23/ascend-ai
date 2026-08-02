"use client";

import { useEffect, useRef } from "react";
import { FeedbackEngine } from "@/lib/haptics/FeedbackEngine";

/**
 * Triggers a haptic celebration pulse whenever a metric crosses its goal threshold.
 * Fires only once per crossing (won't repeat until metric drops below and re-crosses).
 */
export function useGoalHaptics(
  metrics: { value: number; target: number; label: string }[]
) {
  const prevAboveGoal = useRef<Record<string, boolean>>({});

  useEffect(() => {
    metrics.forEach(({ value, target, label }) => {
      if (target <= 0) return;
      const wasAbove = prevAboveGoal.current[label] ?? false;
      const isNowAbove = value >= target;

      if (!wasAbove && isNowAbove) {
        // Just crossed the goal — fire haptic + short delay for celebration
        FeedbackEngine.celebrationPulse();
      }

      prevAboveGoal.current[label] = isNowAbove;
    });
  }, [metrics]);
}
