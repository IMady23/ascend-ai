"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { calculateBMI, calculateBMR, calculateTDEE, getBMICategory } from "@/lib/calculations/targets";
import { useCoach } from "@/lib/coach";

interface Step4AnalyzingProps {
  fullName: string;
  dob: string;
  height: number;
  weight: number;
  gender: string;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "athlete";
  onComplete: () => void;
}

interface ChecklistItem {
  label: string;
  detail: string;
  durationMs: number;
}

function buildChecklist(dob: string, height: number, weight: number, gender: string): ChecklistItem[] {
  const bmi = calculateBMI(weight, height);
  const age = Math.max(13, new Date().getFullYear() - new Date(dob).getFullYear());
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, "moderate");

  return [
    { label: "Recording your measurements",     detail: `${height} cm · ${weight} kg`,           durationMs: 600  },
    { label: "Estimating body composition",      detail: `BMI ${bmi} — ${getBMICategory(bmi)}`,   durationMs: 1100 },
    { label: "Calculating resting metabolism",   detail: `BMR ${bmr.toLocaleString()} kcal/day`,  durationMs: 1700 },
    { label: "Estimating daily energy needs",    detail: `TDEE ~${tdee.toLocaleString()} kcal/day`, durationMs: 2300 },
    { label: "Personalizing your coach",         detail: "Ready.",                                durationMs: 2900 },
  ];
}

/**
 * Screen 4 — Analyzing (auto-advance interstitial)
 *
 * No user input. No coach UI in this screen.
 * The CoachPresence orb (in layout) shows "thinking" state via coach.think().
 *
 * When checklist completes:
 * 1. Fires analyzing_complete event → CoachCore enters thinking state
 * 2. Calls startDNATransition → the 3-message signature sequence runs
 * 3. DNA transition calls onComplete → advances to Goal screen
 *
 * The last checklist item is "Personalizing your coach" — emotional, not technical.
 */
export function Step4Analyzing({ fullName, dob, height, weight, gender, activityLevel, onComplete }: Step4AnalyzingProps) {
  const firstName = fullName.trim().split(" ")[0] || "there";
  const checklist = React.useMemo(() => buildChecklist(dob, height, weight, gender), [dob, height, weight, gender]);

  const [completedCount, setCompletedCount] = React.useState(0);
  const allDone = completedCount >= checklist.length;

  const { think, event, startDNATransition } = useCoach();

  React.useEffect(() => {
    event({ type: "context_changed", context: "onboarding", step: 4, label: "analyzing" });
    think(); // Orb enters thinking state — faster pulse, no message
   
  }, []);

  React.useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    checklist.forEach((item, i) => {
      timers.push(setTimeout(() => setCompletedCount(i + 1), item.durationMs));
    });

    // When all items done: fire event + start DNA transition
    const lastDuration = checklist[checklist.length - 1].durationMs;
    timers.push(setTimeout(() => {
      const bmi = calculateBMI(weight, height);
      const age = Math.max(13, new Date().getFullYear() - new Date(dob).getFullYear());
      const bmr = calculateBMR(weight, height, age, gender);
      const tdee = calculateTDEE(bmr, "moderate");

      event({ type: "analyzing_complete", bmr, tdee, bmi });
      // DNA transition: "I understand." → "Now I know..." → "Let's build..." → advance
      startDNATransition(onComplete);
    }, lastDuration + 300));

    return () => timers.forEach(clearTimeout);
   
  }, [checklist, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">

      {/* Label — orb is in the layout above, this is just the text context */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-lg font-semibold text-[var(--color-text-primary)] mb-1"
      >
        {allDone ? `Here's what I found, ${firstName}.` : `Building your profile, ${firstName}…`}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="text-sm text-[var(--color-text-secondary)] mb-8 max-w-xs"
      >
        {allDone ? "One moment…" : "Running the numbers on your measurements."}
      </motion.p>

      {/* Truthful checklist */}
      <div className="w-full max-w-sm space-y-3" role="status" aria-live="polite">
        {checklist.map((item, i) => {
          const isDone = i < completedCount;
          const isActive = i === completedCount;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: isDone || isActive ? 1 : 0.35, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className="flex items-center gap-3 text-left"
            >
              <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                {isDone ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "var(--color-accent-blue)" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                ) : isActive ? (
                  <div
                    className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: "var(--color-accent-blue)", borderTopColor: "transparent" }}
                    aria-hidden="true"
                  />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-[var(--color-border)]" aria-hidden="true" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium transition-colors"
                  style={{ color: isDone ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>
                  {item.label}
                </p>
                {isDone && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs font-mono mt-0.5"
                    style={{ color: "var(--color-accent-blue)" }}
                  >
                    {item.detail}
                  </motion.p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
