import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { CheckCircle2 } from "lucide-react";

/**
 * MilestoneCard — Displays a completed milestone or feature unlock
 *
 * Used for:
 * - Onboarding completion screen (profile created, AI initialized, etc.)
 * - AI follow-up confirmations (showing what was just unlocked)
 * - Weekly achievements
 *
 * Pattern: Icon, title, optional description. Animates in sequence.
 *
 * Example usage:
 * ```tsx
 * {milestones.map((m, i) => (
 *   <MilestoneCard
 *     key={m.id}
 *     title={m.title}
 *     description={m.description}
 *     icon={m.icon}
 *     delay={i * 0.15}
 *   />
 * ))}
 * ```
 */

export interface MilestoneCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  /** Whether this milestone has been achieved */
  achieved?: boolean;
  /** Animate entrance with this delay (for staggered lists) */
  delay?: number;
  accentColor?: string;
  className?: string;
}

export function MilestoneCard({
  title,
  description,
  icon,
  achieved = true,
  delay = 0,
  accentColor = "var(--color-success)",
  className,
}: MilestoneCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        delay,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl",
        "bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border)]",
        className
      )}
    >
      {/* Icon or check */}
      <div
        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
        style={{
          background: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
        }}
      >
        {icon ?? (
          <CheckCircle2
            size={18}
            style={{ color: accentColor }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
          {title}
        </p>
        {description && (
          <p className="text-xs text-[var(--color-text-disabled)] mt-0.5">
            {description}
          </p>
        )}
      </div>

      {/* Achieved check */}
      {achieved && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, type: "spring", stiffness: 300 }}
        >
          <CheckCircle2 size={16} style={{ color: accentColor }} />
        </motion.div>
      )}
    </motion.div>
  );
}
