"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Info, PlayCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { InteractiveCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Badge } from "@/components/adl/primitives/Badge";

export interface ExerciseSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
  rpe?: number;
  status?: string;
  previousBest?: string;
}

export interface ExerciseCardProps {
  name: string;
  targetSets: number;
  targetReps: string;
  sets: ExerciseSet[];
  targetMuscles?: string[];
  equipment?: string;
  tips?: string[];
  isActive?: boolean;
  onUpdateSet: (setId: string, updates: Partial<ExerciseSet>) => void;
  onClick?: () => void;
  className?: string;
}

export function ExerciseCard({
  name,
  targetSets,
  targetReps,
  sets,
  targetMuscles = [],
  equipment = "",
  tips = [],
  isActive = false,
  onUpdateSet,
  onClick,
  className
}: ExerciseCardProps) {
  const isCompleted = sets.every(s => s.completed);
  const [showInfo, setShowInfo] = React.useState(false);

  return (
    <motion.div
      layout
      className={cn(
        "relative rounded-[var(--radius-xl)] transition-all duration-300",
        isActive 
          ? "ring-2 ring-[var(--color-accent-blue)] scale-[1.02] shadow-[var(--shadow-2xl)] z-10 bg-[var(--color-bg-glass-active)] backdrop-blur-xl" 
          : isCompleted 
            ? "opacity-60 grayscale-[50%] bg-[var(--color-bg-glass-standard)]" 
            : "opacity-100 bg-[var(--color-bg-glass-standard)]",
        className
      )}
      onClick={onClick}
    >
      <div className={cn(
        "p-4 border border-[var(--color-glass-border)] rounded-[var(--radius-xl)]",
        isActive && "border-transparent"
      )}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col gap-1">
            <Heading level="h4" className="text-lg leading-tight flex items-center gap-2">
              {name}
              {isCompleted && <Check size={16} className="text-[var(--color-success)]" />}
            </Heading>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs py-0.5">{targetSets} Sets</Badge>
              <Badge variant="outline" className="text-xs py-0.5">{targetReps} Reps</Badge>
            </div>
          </div>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <button className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"><PlayCircle size={16} /></button>
             <button 
               className={cn("hover:text-[var(--color-text-primary)] transition-colors", showInfo ? "text-[var(--color-accent-blue)]" : "text-[var(--color-text-muted)]")}
               onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo); }}
             >
               <Info size={16} />
             </button>
          </div>
        </div>

        {/* Info Panel */}
        <AnimatePresence>
          {showInfo && isActive && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mb-4 p-4 bg-[var(--color-bg-base)] rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] space-y-3">
                {targetMuscles.length > 0 && (
                  <div>
                    <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Target Muscles</Caption>
                    <div className="flex flex-wrap gap-1">
                      {targetMuscles.map(m => <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>)}
                    </div>
                  </div>
                )}
                {equipment && (
                  <div>
                    <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Equipment</Caption>
                    <BodyText size="sm">{equipment}</BodyText>
                  </div>
                )}
                {tips.length > 0 && (
                  <div>
                    <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Tips & Form</Caption>
                    <ul className="list-disc pl-4 text-sm text-[var(--color-text-secondary)] space-y-0.5">
                      {tips.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dense Set Matrix */}
        {isActive && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex flex-col gap-2 mt-4"
          >
            <div className="grid grid-cols-12 gap-2 px-2">
               <Caption className="col-span-1 text-center text-[var(--color-text-muted)] font-semibold uppercase tracking-wider text-[10px]">Set</Caption>
               <Caption className="col-span-3 text-center text-[var(--color-text-muted)] font-semibold uppercase tracking-wider text-[10px]">Previous</Caption>
               <Caption className="col-span-3 text-center text-[var(--color-text-muted)] font-semibold uppercase tracking-wider text-[10px]">kg</Caption>
               <Caption className="col-span-2 text-center text-[var(--color-text-muted)] font-semibold uppercase tracking-wider text-[10px]">Reps</Caption>
               <Caption className="col-span-2 text-center text-[var(--color-text-muted)] font-semibold uppercase tracking-wider text-[10px]">RPE</Caption>
               <Caption className="col-span-1 text-center text-[var(--color-text-muted)] font-semibold uppercase tracking-wider text-[10px]">✔</Caption>
            </div>

            {sets.map((set, idx) => (
              <motion.div 
                key={set.id}
                layout
                className={cn(
                  "grid grid-cols-12 gap-2 items-center p-2 rounded-[var(--radius-lg)] transition-colors border",
                  set.completed 
                    ? "bg-[var(--color-success)]/10 border-[var(--color-success)]/30" 
                    : "bg-[var(--color-bg-surface)] border-[var(--color-glass-border)] hover:border-[var(--color-text-secondary)]"
                )}
              >
                <div className="col-span-1 text-center font-mono text-sm font-semibold text-[var(--color-text-secondary)]">
                  {idx + 1}
                </div>
                
                <div className="col-span-3 text-center text-[11px] text-[var(--color-text-muted)] truncate px-1">
                  {set.previousBest || "-"}
                </div>
                
                <div className="col-span-3">
                  <input 
                    type="number" 
                    value={set.weight} 
                    onChange={(e) => onUpdateSet(set.id, { weight: Number(e.target.value) })}
                    disabled={set.completed}
                    className="w-full bg-[var(--color-bg-base)] border border-[var(--color-glass-border)] rounded-[var(--radius-md)] text-center text-sm py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)] disabled:opacity-50 text-[var(--color-text-primary)]"
                  />
                </div>

                <div className="col-span-2">
                  <input 
                    type="number" 
                    value={set.reps} 
                    onChange={(e) => onUpdateSet(set.id, { reps: Number(e.target.value) })}
                    disabled={set.completed}
                    className="w-full bg-[var(--color-bg-base)] border border-[var(--color-glass-border)] rounded-[var(--radius-md)] text-center text-sm py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)] disabled:opacity-50 text-[var(--color-text-primary)]"
                  />
                </div>

                <div className="col-span-2">
                  <input 
                    type="number" 
                    value={set.rpe || ""} 
                    placeholder="-"
                    onChange={(e) => onUpdateSet(set.id, { rpe: Number(e.target.value) })}
                    disabled={set.completed}
                    className="w-full bg-[var(--color-bg-base)] border border-[var(--color-glass-border)] rounded-[var(--radius-md)] text-center text-sm py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)] disabled:opacity-50 text-[var(--color-text-primary)]"
                  />
                </div>

                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateSet(set.id, { completed: !set.completed });
                    }}
                    className={cn(
                      "w-6 h-6 rounded-[var(--radius-md)] flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)]",
                      set.completed 
                        ? "bg-[var(--color-success)] text-white" 
                        : "bg-[var(--color-bg-base)] border border-[var(--color-glass-border)] text-transparent hover:border-[var(--color-success)]"
                    )}
                  >
                    <Check size={14} className={cn(set.completed ? "opacity-100" : "opacity-0")} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
