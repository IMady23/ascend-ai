"use client";

import * as React from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";

interface ActivityRingProps {
  /** 0 to 1 */
  progress: number;
  color: string;
  size: number;
  strokeWidth: number;
  /** Inner content */
  children?: React.ReactNode;
}

function SingleRing({ progress, color, size, strokeWidth }: ActivityRingProps) {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const springProgress = useSpring(0, { stiffness: 60, damping: 18 });

  React.useEffect(() => {
    springProgress.set(clampedProgress);
  }, [clampedProgress, springProgress]);

  const dashOffset = useTransform(
    springProgress,
    (val) => circumference * (1 - val)
  );

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-bg-surface)"
        strokeWidth={strokeWidth}
      />
      {/* Fill */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
      />
    </svg>
  );
}

export interface ActivityRingData {
  label: string;
  value: number;
  target: number;
  color: string;
  unit: string;
}

interface ActivityRingsProps {
  rings: ActivityRingData[];
  className?: string;
}

/**
 * Apple Watch-style stacked animated activity rings.
 * Supports 1–3 rings stacked concentrically.
 */
export function ActivityRings({ rings, className = "" }: ActivityRingsProps) {
  const OUTER_SIZE = 140;
  const GAP = 14;
  const STROKE = 14;

  const sizes = rings.map((_, i) => OUTER_SIZE - i * (STROKE + GAP));

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Stacked rings */}
      <div className="relative" style={{ width: OUTER_SIZE, height: OUTER_SIZE }}>
        {rings.map((ring, i) => {
          const size = sizes[i];
          const offset = (OUTER_SIZE - size) / 2;
          return (
            <div
              key={ring.label}
              className="absolute"
              style={{ top: offset, left: offset }}
            >
              <SingleRing
                progress={ring.target > 0 ? ring.value / ring.target : 0}
                color={ring.color}
                size={size}
                strokeWidth={STROKE}
              />
            </div>
          );
        })}
      </div>

      {/* Legend below */}
      <div className="absolute -bottom-1 translate-y-full pt-3 flex flex-col gap-1.5 w-full min-w-[160px]">
        {rings.map((ring) => {
          const pct = ring.target > 0 ? Math.min(100, Math.round((ring.value / ring.target) * 100)) : 0;
          return (
            <div key={ring.label} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: ring.color }}
                />
                <span style={{ color: "var(--color-text-secondary)" }}>{ring.label}</span>
              </div>
              <span style={{ color: "var(--color-text-primary)" }} className="font-semibold">
                {ring.value}{ring.unit} <span style={{ color: "var(--color-text-muted)" }}>/ {ring.target}{ring.unit}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
