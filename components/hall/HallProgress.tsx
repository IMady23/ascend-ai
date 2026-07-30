"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface HallProgressProps {
  currentStage: number;
  totalStages: number;
  labels: string[];
}

export function HallProgress({ currentStage, totalStages, labels }: HallProgressProps) {
  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-50 pointer-events-none mix-blend-screen">
      <div className="flex items-center gap-4">
        {Array.from({ length: totalStages }).map((_, i) => (
          <React.Fragment key={i}>
            <div className="relative">
              <motion.div
                className={cn(
                  "w-2 h-2 rounded-full transition-colors duration-700",
                  i <= currentStage ? "bg-[var(--color-accent-blue)]" : "bg-[var(--color-glass-border)]"
                )}
                animate={{
                  boxShadow: i <= currentStage ? "0 0 10px rgba(59,130,246,0.5)" : "none",
                }}
              />
            </div>
            {i < totalStages - 1 && (
              <div className="w-8 h-[1px] bg-[var(--color-glass-border)] overflow-hidden relative">
                <motion.div 
                  className="absolute top-0 left-0 bottom-0 bg-[var(--color-accent-blue)]"
                  initial={{ width: "0%" }}
                  animate={{ width: i < currentStage ? "100%" : "0%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      <div className="h-4 overflow-hidden relative w-48 text-center">
        <motion.div
          key={currentStage}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex justify-center text-xs font-medium tracking-widest uppercase text-[var(--color-accent-blue)] drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]"
        >
          {labels[currentStage]}
        </motion.div>
      </div>
    </div>
  );
}
