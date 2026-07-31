"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/utils/cn";
import { InteractiveCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";

export interface MealItem {
  name: string;
  amount: string;
  calories: number;
}

export interface MealCardProps {
  type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  time: string;
  totalCalories: number;
  macros: { protein: number; carbs: number; fat: number };
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
  const totalMacros = macros.protein + macros.carbs + macros.fat;

  return (
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
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1">
                  <div>
                    <BodyText size="sm" className="text-secondary">{item.name}</BodyText>
                    <Caption className="text-[var(--color-text-muted)]">{item.amount}</Caption>
                  </div>
                  <span className="font-mono text-sm text-secondary">{item.calories}</span>
                </div>
              ))}
              {(onEdit || onDelete) && (
                <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-border-subtle">
                  {onEdit && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEdit(); }}
                      className="px-3 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] text-secondary hover:text-primary hover:bg-surface transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(); }}
                      className="px-3 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </InteractiveCard>
  );
}
