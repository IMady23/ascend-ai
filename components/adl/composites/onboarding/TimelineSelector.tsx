import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

/**
 * TimelineSelector — A visual 12 or 24-hour time picker
 *
 * Used for:
 * - Wake time
 * - Sleep time
 * - Workout preferred time
 * - Meal timing preferences
 *
 * Pattern: Visual clock-style selector with hour markers
 *
 * Example usage:
 * ```tsx
 * <TimelineSelector
 *   value="06:30"
 *   onChange={(time) => setWakeTime(time)}
 *   format="12h"
 *   label="Wake Time"
 * />
 * ```
 */

export interface TimelineSelectorProps {
  value: string; // HH:MM format (24h)
  onChange: (time: string) => void;
  format?: "12h" | "24h";
  label?: string;
  /** Restrict selection to specific hour ranges (e.g., sleep time 20:00-12:00) */
  minHour?: number;
  maxHour?: number;
  accentColor?: string;
  className?: string;
}

export function TimelineSelector({
  value,
  onChange,
  format = "24h",
  label,
  minHour = 0,
  maxHour = 23,
  accentColor = "var(--color-accent-blue)",
  className,
}: TimelineSelectorProps) {
  const [hour, minute] = value.split(":").map(Number);
  const [selectedHour, setSelectedHour] = React.useState(hour);
  const [selectedMinute, setSelectedMinute] = React.useState(minute);

  // Generate hour options based on format
  const hours = React.useMemo(() => {
    if (format === "12h") {
      return Array.from({ length: 12 }, (_, i) => i + 1);
    }
    const range = [];
    for (let i = minHour; i <= maxHour; i++) {
      range.push(i);
    }
    return range;
  }, [format, minHour, maxHour]);

  const minutes = [0, 15, 30, 45];

  const handleTimeChange = (newHour: number, newMinute: number) => {
    setSelectedHour(newHour);
    setSelectedMinute(newMinute);
    const formattedTime = `${String(newHour).padStart(2, "0")}:${String(newMinute).padStart(2, "0")}`;
    onChange(formattedTime);
  };

  const formatDisplay = (h: number, m: number) => {
    if (format === "12h") {
      const period = h >= 12 ? "PM" : "AM";
      const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
      return `${displayHour}:${String(m).padStart(2, "0")} ${period}`;
    }
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {label && (
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-disabled)]">
          {label}
        </span>
      )}

      {/* Display */}
      <div
        className="text-center p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface-elevated)]"
      >
        <motion.div
          key={`${selectedHour}-${selectedMinute}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-3xl font-black font-mono"
          style={{ color: accentColor }}
        >
          {formatDisplay(selectedHour, selectedMinute)}
        </motion.div>
      </div>

      {/* Hour selector */}
      <div>
        <span className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2 block">
          Hour
        </span>
        <div className="grid grid-cols-6 gap-2">
          {hours.map((h) => (
            <motion.button
              key={h}
              type="button"
              onClick={() => handleTimeChange(h, selectedMinute)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "h-10 rounded-lg text-sm font-semibold transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "focus-visible:ring-[var(--color-accent-blue)]",
                selectedHour === h
                  ? "text-white shadow-sm"
                  : "bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-disabled)]"
              )}
              style={
                selectedHour === h
                  ? { background: accentColor }
                  : {}
              }
            >
              {format === "12h" ? h : String(h).padStart(2, "0")}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Minute selector */}
      <div>
        <span className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2 block">
          Minute
        </span>
        <div className="grid grid-cols-4 gap-2">
          {minutes.map((m) => (
            <motion.button
              key={m}
              type="button"
              onClick={() => handleTimeChange(selectedHour, m)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "h-10 rounded-lg text-sm font-semibold transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "focus-visible:ring-[var(--color-accent-blue)]",
                selectedMinute === m
                  ? "text-white shadow-sm"
                  : "bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-disabled)]"
              )}
              style={
                selectedMinute === m
                  ? { background: accentColor }
                  : {}
              }
            >
              :{String(m).padStart(2, "0")}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
