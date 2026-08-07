"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { useCoach } from "@/lib/coach";

interface Step0WelcomeProps {
  onStart: () => void;
}

const VALUE_PROPS = [
  { icon: "⚡", label: "Personalized AI Coach" },
  { icon: "🧠", label: "Science-Based Plans" },
  { icon: "🔒", label: "Private & Secure" },
  { icon: "📈", label: "Adapts As You Improve" },
] as const;

/**
 * Screen 0 — Welcome
 *
 * No coach UI in this screen — the persistent CoachPresence in the layout
 * handles orb + message. This screen only calls coach.event().
 *
 * The orb renders above, idle. No message on welcome — silence is correct here.
 * The value props and headline speak for themselves.
 */
export function Step0Welcome({ onStart }: Step0WelcomeProps) {
  const { silence } = useCoach();

  useEffect(() => {
    // Welcome screen: coach is present (orb visible above) but silent.
    // The value props and headline set context — no coach message needed.
    silence();
  }, [silence]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-8 text-center relative overflow-hidden">

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04] blur-3xl"
          style={{ background: "var(--color-accent-blue)" }}
        />
      </div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl sm:text-5xl font-black tracking-tight text-[var(--color-text-primary)] mb-3"
      >
        Welcome to Ascend AI
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-sm leading-relaxed mb-8"
      >
        Discipline builds what motivation only begins.
      </motion.p>

      {/* Value prop chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        className="flex flex-wrap justify-center gap-2 mb-10 max-w-sm"
        aria-label="What you get with Ascend AI"
      >
        {VALUE_PROPS.map((prop, i) => (
          <motion.div
            key={prop.label}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.08, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium",
              "bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border)]",
              "text-[var(--color-text-secondary)] select-none"
            )}
          >
            <span aria-hidden="true">{prop.icon}</span>
            <span>{prop.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <button
          type="button"
          onClick={onStart}
          className={cn(
            "w-full h-14 rounded-2xl font-bold text-base text-white",
            "bg-[var(--color-accent-blue)] hover:brightness-110",
            "transition-all active:scale-[0.98]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            "focus-visible:ring-[var(--color-accent-blue)] focus-visible:ring-offset-[var(--color-bg-base)]",
            "shadow-lg shadow-[var(--color-accent-blue)]/20"
          )}
        >
          Let&apos;s Start
        </button>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.3 }}
          className="mt-3 text-xs text-[var(--color-text-disabled)] text-center"
        >
          Takes about 3 minutes
        </motion.p>
      </motion.div>
    </div>
  );
}
