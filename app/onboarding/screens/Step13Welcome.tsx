"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { useCoach } from "@/lib/coach";

interface Step13WelcomeProps {
  fullName: string;
  whyStarted?: string;
}

/**
 * Screen 13 — Welcome to Ascend
 *
 * This is NOT "Setup Complete."
 * This is the moment users realize they're entering a relationship, not finishing a wizard.
 *
 * Per ASCEND_FIRST_IMPRESSION.md:
 * - No fireworks
 * - No "Congratulations!"
 * - Just: "Your coach is ready. Your journey starts today."
 *
 * If whyStarted exists, reference it subtly to prove the coach was listening.
 *
 * Auto-redirects after 5 seconds if user doesn't tap CTA.
 */
export function Step13Welcome({ fullName, whyStarted }: Step13WelcomeProps) {
  const router = useRouter();
  const { say, celebrate, event } = useCoach();
  const [showContent, setShowContent] = React.useState(false);
  const autoRedirectTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const firstName = fullName.trim().split(" ")[0] || "there";

  // Respect reduced motion preference
  const prefersReducedMotion = typeof window !== "undefined" 
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  // Summarize whyStarted to 3–5 words if present
  const motivationSummary = React.useMemo(() => {
    if (!whyStarted || whyStarted.trim().length < 10) return null;

    // Simple heuristic: take first 40 chars, find last space, trim
    const trimmed = whyStarted.slice(0, 40);
    const lastSpace = trimmed.lastIndexOf(" ");
    return lastSpace > 10 ? `${trimmed.slice(0, lastSpace)}...` : `${trimmed}...`;
  }, [whyStarted]);

  React.useEffect(() => {
    event({ type: "context_changed", context: "onboarding", step: 13, label: "welcome" });
    celebrate(); // Orb enters celebrating state
    say(""); // Clear any previous message

    // Reduced motion: show content immediately
    if (prefersReducedMotion) {
      setShowContent(true);
    } else {
      // Delay content appearance slightly for polish
      const t1 = setTimeout(() => setShowContent(true), 200);
      clearTimeout(t1);
    }

    // Auto-redirect after 5 seconds (fallback only)
    autoRedirectTimerRef.current = setTimeout(() => {
      router.replace("/");
    }, 5000);

    return () => {
      if (autoRedirectTimerRef.current) {
        clearTimeout(autoRedirectTimerRef.current);
      }
    };
  }, [celebrate, say, event, router, prefersReducedMotion]);

  const handleBegin = () => {
    // Clear the auto-redirect timer when user manually taps CTA
    if (autoRedirectTimerRef.current) {
      clearTimeout(autoRedirectTimerRef.current);
    }
    router.replace("/");
  };

  return (
    <div 
      className="flex flex-col items-center justify-center flex-1 px-6 py-8 text-center relative overflow-hidden"
      role="main"
      aria-live="polite"
      aria-label="Welcome to Ascend"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-3xl"
          style={{ background: "var(--color-accent-blue)" }}
        />
      </div>

      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md space-y-6"
          >
            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--color-text-primary)]"
            >
              Your Ascend Profile is ready.
            </motion.h1>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.0, duration: 0.3 }}
              className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent"
              style={{ transformOrigin: "center" }}
            />

            {/* Optional motivation reference */}
            {motivationSummary && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="text-base text-[var(--color-text-secondary)] leading-relaxed"
              >
                You told me you wanted to{" "}
                <span className="text-[var(--color-text-primary)] font-medium">
                  {motivationSummary.toLowerCase()}
                </span>
              </motion.p>
            )}

            {/* DNA message */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: motivationSummary ? 1.8 : 1.3, duration: 0.8 }}
              className="text-base text-[var(--color-text-secondary)] leading-relaxed"
            >
              From today, every workout, every meal, and every recovery check-in will help me
              understand you better.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: motivationSummary ? 2.5 : 2.0, duration: 0.6 }}
              className="text-base font-medium text-[var(--color-text-primary)]"
            >
              This is only the beginning.
            </motion.p>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: motivationSummary ? 3.1 : 2.6, duration: 0.3 }}
              className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent"
              style={{ transformOrigin: "center" }}
            />

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: motivationSummary ? 3.4 : 2.9, duration: 0.4 }}
            >
              <button
                type="button"
                onClick={handleBegin}
                className={cn(
                  "w-full h-14 rounded-2xl font-bold text-base text-white transition-all",
                  "bg-[var(--color-accent-blue)] hover:brightness-110",
                  "shadow-lg shadow-[var(--color-accent-blue)]/20",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  "focus-visible:ring-[var(--color-accent-blue)] focus-visible:ring-offset-[var(--color-bg-base)]",
                  "active:scale-[0.98]"
                )}
              >
                Begin Your Journey
              </button>

              {/* Auto-redirect hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: motivationSummary ? 4.0 : 3.5, duration: 0.3 }}
                className="mt-3 text-xs text-[var(--color-text-disabled)] text-center"
              >
                Starting in a moment...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
