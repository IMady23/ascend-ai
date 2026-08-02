"use client";

import * as React from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimationControls } from "framer-motion";
import { ChevronDown, Sparkles, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { InteractiveCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { FeedbackEngine } from "@/lib/haptics/FeedbackEngine";

export interface MealItem {
  name: string;
  amount: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}

export interface MealCardProps {
  type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  time: string;
  totalCalories: number;
  macros: { protein: number; carbs: number; fat: number; fiber?: number };
  items: MealItem[];
  isAiVerified?: boolean;
  className?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function MealCard({
  type,
  time,
  totalCalories,
  macros,
  items,
  isAiVerified = false,
  className,
  onEdit,
  onDelete
}: MealCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const totalMacros = macros.protein + macros.carbs + macros.fat;

  // Swipe gesture
  const x = useMotionValue(0);
  const controls = useAnimationControls();
  const DELETE_THRESHOLD = -72;
  const deleteOpacity = useTransform(x, [0, DELETE_THRESHOLD], [0, 1]);
  const deleteScale = useTransform(x, [0, DELETE_THRESHOLD], [0.8, 1]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x < DELETE_THRESHOLD) {
      FeedbackEngine.heavyImpact();
      setShowDeleteConfirm(true);
      controls.start({ x: DELETE_THRESHOLD });
    } else {
      controls.start({ x: 0 });
    }
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    FeedbackEngine.celebrationPulse();
    onDelete?.();
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    controls.start({ x: 0 });
    setShowDeleteConfirm(false);
  };

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-xl)]">
      {/* Swipe delete background */}
      <motion.div
        className="absolute inset-y-0 right-0 flex items-center justify-end pr-4 bg-[var(--color-danger)] rounded-[var(--radius-xl)]"
        style={{ opacity: deleteOpacity }}
      >
        <motion.div style={{ scale: deleteScale }} className="flex items-center gap-2 text-white font-semibold text-sm">
          <Trash2 size={18} />
          <span>Delete</span>
        </motion.div>
      </motion.div>

      {/* Card content - draggable */}
      <motion.div
        drag="x"
        dragConstraints={{ left: DELETE_THRESHOLD, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
      >
        <InteractiveCard
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn("p-4 w-full flex flex-col gap-4", className)}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-secondary font-medium">
                {type.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Heading level="h4" className="text-base">{type}</Heading>
                  {isAiVerified && (
                    <Sparkles size={12} className="text-[var(--color-accent-indigo)]" />
                  )}
                </div>
                <Caption className="text-[var(--color-text-muted)]">{time}</Caption>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-mono font-bold text-primary">{totalCalories}</div>
                <Caption className="text-[var(--color-text-muted)] text-[10px] uppercase">kcal</Caption>
              </div>
              <ChevronDown 
                size={16} 
                className={cn(
                  "text-[var(--color-text-muted)] transition-transform duration-200",
                  isExpanded && "rotate-180"
                )} 
              />
            </div>
          </div>

          {/* Mini Macro Split Bar */}
          {totalMacros > 0 && (
            <div className="w-full h-1.5 rounded-full overflow-hidden flex bg-surface">
              <div style={{ width: `${(macros.protein / totalMacros) * 100}%`, backgroundColor: "var(--color-accent-blue)" }} />
              <div style={{ width: `${(macros.carbs / totalMacros) * 100}%`, backgroundColor: "var(--color-accent-green)" }} />
              <div style={{ width: `${(macros.fat / totalMacros) * 100}%`, backgroundColor: "var(--color-accent-gold)" }} />
            </div>
          )}

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-2 flex flex-col gap-2 border-t border-border-subtle mt-2">
                  {/* Per-Item Breakdown */}
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1.5">
                      <div>
                        <BodyText size="sm" className="text-secondary">{item.name}</BodyText>
                        <Caption className="text-[var(--color-text-muted)]">{item.amount}</Caption>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-sm text-secondary">{item.calories} kcal</span>
                        {(item.protein || item.carbs || item.fat) && (
                          <Caption className="text-[var(--color-text-muted)] block">
                            P:{item.protein?.toFixed(0)}g C:{item.carbs?.toFixed(0)}g F:{item.fat?.toFixed(0)}g
                          </Caption>
                        )}
                      </div>
                    </div>
                  ))}
                  {/* Summary Row */}
                  {macros.fiber !== undefined && macros.fiber > 0 && (
                    <div className="flex items-center gap-3 mt-1 pt-2 border-t border-border-subtle">
                      <Caption className="text-[var(--color-text-muted)]">Fiber: {macros.fiber.toFixed(1)}g</Caption>
                    </div>
                  )}
                  {(onEdit || onDelete) && (
                    <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-border-subtle">
                      {onEdit && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onEdit(); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] text-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue)]/10 transition-colors"
                        >
                          <Pencil size={12} /> Edit
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDelete(); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-colors"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </InteractiveCard>
      </motion.div>

      {/* Inline delete confirm overlay */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute inset-0 flex items-center justify-between gap-3 px-4 rounded-[var(--radius-xl)] bg-[var(--color-bg-elevated)] border border-[var(--color-danger)]/50 z-10"
          >
            <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
              Delete this meal?
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelDelete}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border-subtle"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[var(--color-danger)] text-white"
              >
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
