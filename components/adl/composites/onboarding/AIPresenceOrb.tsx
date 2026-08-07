"use client";

import * as React from "react";
import { motion, useAnimation, useReducedMotion } from "framer-motion";
import { cn } from "@/utils/cn";

/**
 * AIPresenceOrb — The visual representation of the AI's presence.
 *
 * This is not a mascot. It is not a character.
 * It is the feeling that something intelligent is paying attention.
 *
 * Design principles (from ASCEND_AI_PRODUCT_PRINCIPLES.md, Principle 15):
 * - The orb should never look the same in two different emotional states.
 * - Idle ≠ Thinking ≠ Speaking ≠ Celebrating ≠ Loading
 * - Presence doesn't require animation excess — it requires consistency.
 *
 * States:
 * - "idle"       → Gentle, slow breathing. The AI is present but waiting.
 * - "speaking"   → Glow increases. Ripple expands. The AI is talking.
 * - "thinking"   → Pulse speeds up. Inner core shifts. The AI is processing.
 * - "celebrating"→ Glow blooms outward. Bright, warm. The AI is happy.
 * - "listening"  → Soft, attentive. Slightly contracted. The AI is receiving.
 *
 * Usage:
 * ```tsx
 * // On every onboarding screen — top center
 * <AIPresenceOrb state="speaking" name="Madhav" size={48} />
 *
 * // During calculation
 * <AIPresenceOrb state="thinking" size={64} />
 *
 * // On celebration screen
 * <AIPresenceOrb state="celebrating" size={80} />
 * ```
 */

export type OrbState = "idle" | "speaking" | "thinking" | "celebrating" | "listening";

export interface AIPresenceOrbProps {
  /** Current emotional/functional state of the AI */
  state?: OrbState;
  /** Size in pixels (both width and height) */
  size?: number;
  /** Accent color override — defaults to --color-accent-blue */
  color?: string;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// STATE CONFIGURATIONS
// Each state has distinct visual properties — never the same in two states.
// ─────────────────────────────────────────────────────────────────────────────

interface OrbStateConfig {
  // Inner core animation
  coreScale: number[];
  coreOpacity: number[];
  coreDuration: number;

  // Outer glow animation
  glowScale: number[];
  glowOpacity: number[];
  glowDuration: number;

  // Ripple (only in some states)
  showRipple: boolean;
  rippleDuration?: number;

  // Glow intensity multiplier
  glowIntensity: number;

  // Core color tint
  colorMix: string;
}

const STATE_CONFIGS: Record<OrbState, OrbStateConfig> = {
  idle: {
    coreScale: [1, 1.04, 1],
    coreOpacity: [0.85, 1, 0.85],
    coreDuration: 3.5,
    glowScale: [1, 1.08, 1],
    glowOpacity: [0.15, 0.25, 0.15],
    glowDuration: 3.5,
    showRipple: false,
    glowIntensity: 0.3,
    colorMix: "100%",
  },
  speaking: {
    coreScale: [1, 1.06, 0.98, 1.04, 1],
    coreOpacity: [0.9, 1, 0.95, 1, 0.9],
    coreDuration: 1.8,
    glowScale: [1, 1.15, 1.05, 1.12, 1],
    glowOpacity: [0.25, 0.45, 0.3, 0.4, 0.25],
    glowDuration: 1.8,
    showRipple: true,
    rippleDuration: 1.8,
    glowIntensity: 0.55,
    colorMix: "100%",
  },
  thinking: {
    coreScale: [1, 1.03, 0.97, 1.03, 1],
    coreOpacity: [0.7, 0.95, 0.75, 0.95, 0.7],
    coreDuration: 0.9,
    glowScale: [1, 1.06, 0.98, 1.04, 1],
    glowOpacity: [0.2, 0.35, 0.22, 0.32, 0.2],
    glowDuration: 0.9,
    showRipple: false,
    glowIntensity: 0.4,
    colorMix: "80%",
  },
  celebrating: {
    coreScale: [1, 1.12, 1.04, 1.1, 1],
    coreOpacity: [1, 1, 1, 1, 1],
    coreDuration: 0.7,
    glowScale: [1, 1.4, 1.1, 1.3, 1],
    glowOpacity: [0.4, 0.8, 0.5, 0.75, 0.4],
    glowDuration: 0.7,
    showRipple: true,
    rippleDuration: 0.7,
    glowIntensity: 0.9,
    colorMix: "100%",
  },
  listening: {
    coreScale: [1, 0.97, 1],
    coreOpacity: [0.8, 0.9, 0.8],
    coreDuration: 2.5,
    glowScale: [1, 0.95, 1],
    glowOpacity: [0.2, 0.15, 0.2],
    glowDuration: 2.5,
    showRipple: false,
    glowIntensity: 0.2,
    colorMix: "70%",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function AIPresenceOrb({
  state = "idle",
  size = 48,
  color = "var(--color-accent-blue)",
  className,
}: AIPresenceOrbProps) {
  const prefersReducedMotion = useReducedMotion();
  const config = STATE_CONFIGS[state];

  // When reduced motion is preferred — static, no animation
  if (prefersReducedMotion) {
    return (
      <div
        className={cn("relative flex items-center justify-center shrink-0", className)}
        style={{ width: size, height: size }}
        role="img"
        aria-label={`AI coach ${state}`}
      >
        <div
          className="rounded-full"
          style={{
            width: size * 0.5,
            height: size * 0.5,
            background: color,
            opacity: 0.9,
          }}
        />
      </div>
    );
  }

  const coreSize = size * 0.42;
  const glowSize = size * 0.85;
  const rippleSize = size;

  return (
    <div
      className={cn("relative flex items-center justify-center shrink-0", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`AI coach ${state}`}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: glowSize,
          height: glowSize,
          background: color,
          filter: `blur(${size * 0.18}px)`,
        }}
        animate={{
          scale: config.glowScale,
          opacity: config.glowOpacity,
        }}
        transition={{
          duration: config.glowDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Ripple ring — only in speaking and celebrating states */}
      {config.showRipple && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: rippleSize,
            height: rippleSize,
            border: `1.5px solid ${color}`,
          }}
          animate={{
            scale: [0.6, 1.2],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: config.rippleDuration,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}

      {/* Inner core */}
      <motion.div
        className="relative rounded-full"
        style={{
          width: coreSize,
          height: coreSize,
          background: color,
          boxShadow: `0 0 ${size * 0.25}px ${color}`,
        }}
        animate={{
          scale: config.coreScale,
          opacity: config.coreOpacity,
        }}
        transition={{
          duration: config.coreDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ORBED COACH MESSAGE — Orb + message together in one line
// Replaces the Sparkles icon in CoachMessage with the living orb
// ─────────────────────────────────────────────────────────────────────────────

export interface OrbedCoachMessageProps {
  children: React.ReactNode;
  orbState?: OrbState;
  emphasized?: boolean;
  delay?: number;
  className?: string;
}

export function OrbedCoachMessage({
  children,
  orbState = "speaking",
  emphasized = false,
  delay = 0,
  className,
}: OrbedCoachMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn("flex items-start gap-3 w-full max-w-2xl", className)}
    >
      {/* Living orb replaces the static Sparkles icon */}
      <div className="shrink-0 mt-1">
        <AIPresenceOrb state={orbState} size={32} />
      </div>

      {/* Message bubble */}
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
