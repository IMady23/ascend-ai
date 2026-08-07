import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { CheckCircle2 } from "lucide-react";

/**
 * ChoiceCard — A selectable card for single or multi-select questions
 *
 * Used for:
 * - Primary goal selection (single)
 * - Fitness experience (single)
 * - Activity level (single)
 * - Diet type (single)
 * - Allergen selection (multi)
 *
 * Example usage:
 * ```tsx
 * // Single select
 * <ChoiceCard
 *   value="lose_fat"
 *   selected={goal === 'lose_fat'}
 *   onSelect={() => setGoal('lose_fat')}
 *   icon={<Flame size={20} />}
 *   title="Lose Fat"
 *   description="Reduce body fat while preserving muscle"
 * />
 *
 * // Multi select
 * <ChoiceCard
 *   value="dairy"
 *   selected={allergies.includes('dairy')}
 *   onSelect={() => toggleAllergy('dairy')}
 *   multiSelect
 *   title="Dairy"
 * />
 * ```
 */

export interface ChoiceCardProps {
  /** The value this card represents */
  value: string;

  /** Whether this card is currently selected */
  selected: boolean;

  /** Called when the card is clicked */
  onSelect: (value: string) => void;

  /** Icon rendered at the top of the card */
  icon?: React.ReactNode;

  /** Primary label */
  title: string;

  /** Optional supporting description */
  description?: string;

  /** Optional badge/tag (e.g. "Recommended") */
  badge?: string;

  /**
   * Allow multiple selections.
   * Changes the selection indicator from a radio to a checkbox style.
   */
  multiSelect?: boolean;

  /** Disable interaction */
  disabled?: boolean;

  /** Accent color for selected state (CSS custom property or hex) */
  accentColor?: string;

  className?: string;
}

export function ChoiceCard({
  value,
  selected,
  onSelect,
  icon,
  title,
  description,
  badge,
  multiSelect = false,
  disabled = false,
  accentColor = "var(--color-accent-blue)",
  className,
}: ChoiceCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => !disabled && onSelect(value)}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.01 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={cn(
        "relative w-full text-left rounded-xl border transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[var(--color-bg-base)]",
        "p-4 flex items-start gap-3",
        selected
          ? "border-[var(--selected-accent)] bg-[var(--selected-accent)]/5 shadow-sm"
          : "border-[var(--color-border)] bg-[var(--color-bg-surface-elevated)] hover:border-[var(--color-text-disabled)] hover:bg-[var(--color-bg-surface)]",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={{ "--selected-accent": accentColor } as React.CSSProperties}
      aria-pressed={selected}
    >
      {/* Icon */}
      {icon && (
        <div
          className={cn(
            "shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
            selected
              ? "bg-[var(--selected-accent)]/15 text-[var(--selected-accent)]"
              : "bg-[var(--color-bg-base)] text-[var(--color-text-secondary)]"
          )}
        >
          {icon}
        </div>
      )}

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "text-sm font-semibold transition-colors",
              selected
                ? "text-[var(--color-text-primary)]"
                : "text-[var(--color-text-secondary)]"
            )}
          >
            {title}
          </span>
          {badge && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
              style={{
                background: `color-mix(in srgb, ${accentColor} 15%, transparent)`,
                color: accentColor,
              }}
            >
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-0.5 text-xs text-[var(--color-text-disabled)] leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Selection Indicator */}
      <div className="shrink-0 mt-0.5">
        {selected ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <CheckCircle2
              size={18}
              style={{ color: accentColor }}
            />
          </motion.div>
        ) : (
          <div
            className={cn(
              "w-[18px] h-[18px] border-2 border-[var(--color-border)] transition-colors",
              multiSelect ? "rounded-[4px]" : "rounded-full"
            )}
          />
        )}
      </div>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ChoiceGroup — wraps multiple ChoiceCards in a consistent layout
// ─────────────────────────────────────────────────────────────────────────────

export interface ChoiceGroupProps {
  children: React.ReactNode;
  /** "stack" = vertical list, "grid" = 2-column grid */
  layout?: "stack" | "grid";
  className?: string;
}

export function ChoiceGroup({
  children,
  layout = "stack",
  className,
}: ChoiceGroupProps) {
  return (
    <motion.div
      variants={{
        visible: { transition: { staggerChildren: 0.05 } },
      }}
      initial="hidden"
      animate="visible"
      className={cn(
        layout === "grid"
          ? "grid grid-cols-2 gap-2"
          : "flex flex-col gap-2",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
