"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/utils/cn";
import type { CoachVisualState } from "@/lib/coach/CoachCore";

/**
 * CoachOrb — The visual representation of the Ascend Coach.
 *
 * This is the face of Ascend. It is NOT a mascot.
 * It expresses state through subtle animation, not cartoonish behavior.
 *
 * Design rules (from ASCEND_COACH.md):
 * - Each state is visually distinct — idle ≠ thinking ≠ celebrating
 * - Animations feel like behavior, not theater
 * - Never the same in two different emotional states
 * - Micro-life (waiting state) pulses every 15–20s — handled by CoachCore
 *
 * Variant system:
 * - "orb" (current) — glowing sphere
 * - Future: "wave", "hologram", "ring"
 * - Same brain, different appearance
 *
 * Size: 44px recommended for persistent presence in layouts.
 * The orb contains: outer glow + optional ripple + inner core.
 */

export type OrbVariant = "orb"; // Future: "wave" | "hologram" | "ring"

export interface CoachOrbProps {
  state?: CoachVisualState;
  size?: number;
  color?: string;
  variant?: OrbVariant;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// STATE ANIMATION CONFIGS
// Each state has distinct timing and values — never reuse between states.
// ─────────────────────────────────────────────────────────────────────────────

interface OrbConfig {
  coreScale: number[];
  coreOpacity: number[];
  coreDuration: number;
  glowScale: number[];
  glowOpacity: number[];
  glowDuration: number;
  showRipple: boolean;
  rippleDuration?: number;
  rippleScale?: number[];
}

const STATE_CONFIGS: Record<CoachVisualState, OrbConfig> = {
  idle: {
    // Gentle breath — present but quiet
    coreScale: [1, 1.04, 1],
    coreOpacity: [0.85, 1, 0.85],
    coreDuration: 3.5,
    glowScale: [1, 1.08, 1],
    glowOpacity: [0.12, 0.22, 0.12],
    glowDuration: 3.5,
    showRipple: false,
  },
  listening: {
    // Contracted — attentive, receiving
    coreScale: [1, 0.97, 1],
    coreOpacity: [0.8, 0.92, 0.8],
    coreDuration: 2.2,
    glowScale: [1, 0.94, 1],
    glowOpacity: [0.15, 0.1, 0.15],
    glowDuration: 2.2,
    showRipple: false,
  },
  thinking: {
    // Faster pulse — processing, not yet ready
    coreScale: [1, 1.03, 0.97, 1.03, 1],
    coreOpacity: [0.7, 0.95, 0.72, 0.95, 0.7],
    coreDuration: 0.85,
    glowScale: [1, 1.06, 0.97, 1.05, 1],
    glowOpacity: [0.18, 0.32, 0.18, 0.3, 0.18],
    glowDuration: 0.85,
    showRipple: false,
  },
  speaking: {
    // Glow + ripple — the coach is talking
    coreScale: [1, 1.06, 0.98, 1.04, 1],
    coreOpacity: [0.9, 1, 0.93, 1, 0.9],
    coreDuration: 1.8,
    glowScale: [1, 1.14, 1.04, 1.1, 1],
    glowOpacity: [0.25, 0.45, 0.28, 0.4, 0.25],
    glowDuration: 1.8,
    showRipple: true,
    rippleDuration: 1.8,
    rippleScale: [0.6, 1.2],
  },
  happy: {
    // Brief glow increase — positive outcome
    coreScale: [1, 1.08, 1.02, 1.06, 1],
    coreOpacity: [0.95, 1, 0.97, 1, 0.95],
    coreDuration: 1.2,
    glowScale: [1, 1.2, 1.06, 1.14, 1],
    glowOpacity: [0.3, 0.55, 0.35, 0.48, 0.3],
    glowDuration: 1.2,
    showRipple: true,
    rippleDuration: 1.2,
    rippleScale: [0.7, 1.15],
  },
  celebrating: {
    // Bloom — major milestone, one-time feel
    coreScale: [1, 1.12, 1.04, 1.1, 1],
    coreOpacity: [1, 1, 1, 1, 1],
    coreDuration: 0.65,
    glowScale: [1, 1.45, 1.12, 1.32, 1],
    glowOpacity: [0.4, 0.85, 0.5, 0.75, 0.4],
    glowDuration: 0.65,
    showRipple: true,
    rippleDuration: 0.65,
    rippleScale: [0.5, 1.35],
  },
  concerned: {
    // Slightly contracted, soft orange — something needs attention
    coreScale: [1, 1.02, 0.98, 1.02, 1],
    coreOpacity: [0.85, 0.95, 0.87, 0.95, 0.85],
    coreDuration: 1.5,
    glowScale: [1, 1.05, 0.98, 1.03, 1],
    glowOpacity: [0.2, 0.35, 0.22, 0.3, 0.2],
    glowDuration: 1.5,
    showRipple: false,
  },
  waiting: {
    // Micro-life pulse — fires briefly then returns to idle
    // Single pulse, not looping — CoachCore handles the loop timing
    coreScale: [1, 1.04, 1],
    coreOpacity: [0.85, 1, 0.85],
    coreDuration: 0.4,
    glowScale: [1, 1.1, 1],
    glowOpacity: [0.15, 0.28, 0.15],
    glowDuration: 0.4,
    showRipple: false,
  },
  sleeping: {
    // Very dim, very slow — backgrounded
    coreScale: [1, 1.02, 1],
    coreOpacity: [0.35, 0.45, 0.35],
    coreDuration: 5,
    glowScale: [1, 1.03, 1],
    glowOpacity: [0.04, 0.08, 0.04],
    glowDuration: 5,
    showRipple: false,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function CoachOrb({
  state = "idle",
  size = 44,
  color = "var(--color-accent-blue)",
  variant = "orb",
  className,
}: CoachOrbProps) {
  const prefersReducedMotion = useReducedMotion();
  const config = STATE_CONFIGS[state];

  // Concerned state uses a warm orange tint
  const effectiveColor = state === "concerned"
    ? "var(--color-warning)"
    : color;

  // Static render for reduced motion
  if (prefersReducedMotion) {
    return (
      <div
        className={cn("relative flex items-center justify-center shrink-0", className)}
        style={{ width: size, height: size }}
        role="img"
        aria-label={`Coach is ${state}`}
      >
        <div
          className="rounded-full"
          style={{
            width: size * 0.42,
            height: size * 0.42,
            background: effectiveColor,
            opacity: state === "sleeping" ? 0.35 : 0.9,
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
      aria-label={`Coach is ${state}`}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: glowSize,
          height: glowSize,
          background: effectiveColor,
          filter: `blur(${size * 0.18}px)`,
        }}
        animate={{
          scale: config.glowScale,
          opacity: config.glowOpacity,
        }}
        transition={{
          duration: config.glowDuration,
          repeat: state === "waiting" ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Ripple ring — speaking, happy, celebrating only */}
      {config.showRipple && (
        <motion.div
          key={`${state}-ripple`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: rippleSize,
            height: rippleSize,
            border: `1.5px solid ${effectiveColor}`,
          }}
          animate={{
            scale: config.rippleScale ?? [0.6, 1.2],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: config.rippleDuration ?? 1.8,
            repeat: state === "waiting" ? 0 : Infinity,
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
          background: effectiveColor,
          boxShadow: `0 0 ${size * 0.22}px ${effectiveColor}`,
        }}
        animate={{
          scale: config.coreScale,
          opacity: config.coreOpacity,
        }}
        transition={{
          duration: config.coreDuration,
          repeat: state === "waiting" ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
