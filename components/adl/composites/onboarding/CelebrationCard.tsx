import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { Sparkles } from "lucide-react";

/**
 * CelebrationCard — Big moment celebration for onboarding completion
 *
 * Used for:
 * - Step 11: Welcome to Mission Control
 * - Any major milestone completion
 * - First workout completion
 * - Goal achievements
 *
 * Pattern: Hero moment — large icon, heading, supporting text, CTA
 *
 * Example usage:
 * ```tsx
 * <CelebrationCard
 *   title="Setup Complete"
 *   subtitle="Your personal AI coach is now active."
 *   icon={<Sparkles size={48} />}
 *   accentColor="var(--color-accent-gold)"
 * />
 * ```
 */

export interface CelebrationCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  /** Optional milestones shown below the main content */
  children?: React.ReactNode;
  className?: string;
}

export function CelebrationCard({
  title,
  subtitle,
  icon,
  accentColor = "var(--color-accent-gold)",
  children,
  className,
}: CelebrationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-col items-center text-center py-8 px-6",
        className
      )}
    >
      {/* Icon with glow */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          delay: 0.2,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        className="relative mb-6"
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0 blur-2xl opacity-40 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
            transform: "scale(2)",
          }}
        />
        
        {/* Icon container */}
        <div
          className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{
            background: `color-mix(in srgb, ${accentColor} 12%, var(--color-bg-surface))`,
            border: `1px solid color-mix(in srgb, ${accentColor} 20%, transparent)`,
            boxShadow: `0 8px 32px -8px ${accentColor}40`,
          }}
        >
          {icon ?? <Sparkles size={40} style={{ color: accentColor }} />}
        </div>
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-3xl font-black tracking-tight text-[var(--color-text-primary)] mb-2"
      >
        {title}
      </motion.h2>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-md"
        >
          {subtitle}
        </motion.p>
      )}

      {/* Children (milestones, buttons, etc.) */}
      {children && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}
