"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Dumbbell, Apple, LineChart, Activity, BrainCircuit } from "lucide-react";
import { cn } from "@/utils/cn";
import { Caption } from "@/components/adl/typography";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
      // ⌘K to open handled in TopBar
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent scrolling
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const groups = [
    {
      title: "Quick Actions",
      items: [
        { icon: <Dumbbell size={16} />, label: "Log Workout" },
        { icon: <Apple size={16} />, label: "Log Meal" },
        { icon: <Activity size={16} />, label: "Update Weight" },
        { icon: <BrainCircuit size={16} />, label: "Start AI Coach" },
      ]
    },
    {
      title: "Navigation",
      items: [
        { icon: <Activity size={16} />, label: "Mission Control" },
        { icon: <Dumbbell size={16} />, label: "Training" },
        { icon: <Apple size={16} />, label: "Nutrition" },
        { icon: <LineChart size={16} />, label: "Hall of Progress" },
      ]
    },
    {
      title: "AI",
      items: [
        { icon: <BrainCircuit size={16} />, label: "Ask AI Coach" },
        { icon: <Activity size={16} />, label: "Analyze Progress" },
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="relative w-full max-w-2xl bg-[var(--color-bg-base)] border border-[var(--color-glass-border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-2xl)] overflow-hidden flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-4 border-b border-[var(--color-glass-border)] bg-[var(--color-bg-surface)]">
              <Search size={20} className="text-[var(--color-text-secondary)] mr-3" />
              <input 
                type="text" 
                placeholder="Search Ascend AI..." 
                className="flex-1 bg-transparent border-none outline-none text-[var(--color-text-primary)] text-lg placeholder-[var(--color-text-muted)]"
                autoFocus
              />
              <kbd className="hidden sm:inline-flex items-center h-6 px-2 text-xs font-medium bg-[var(--color-bg-base)] text-[var(--color-text-muted)] rounded border border-[var(--color-glass-border)] font-mono">
                ESC
              </kbd>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {groups.map((group, idx) => (
                <div key={idx} className="mb-4 last:mb-0">
                  <Caption className="px-3 py-2 text-[10px] font-semibold tracking-widest uppercase text-[var(--color-text-muted)]">
                    {group.title}
                  </Caption>
                  <div className="flex flex-col gap-1">
                    {group.items.map((item, i) => (
                      <button 
                        key={i}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-glass-hover)] transition-colors text-left text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] group focus-visible:bg-[var(--color-bg-glass-hover)] focus-visible:outline-none"
                      >
                        <div className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-colors">
                          {item.icon}
                        </div>
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="mt-2 pt-2 border-t border-[var(--color-glass-border)]">
                 <Caption className="px-3 py-2 text-[10px] font-semibold tracking-widest uppercase text-[var(--color-text-muted)]">
                    Recent
                  </Caption>
                  <div className="px-3 py-4 text-center text-sm text-[var(--color-text-muted)] italic">
                    (No recent searches)
                  </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
