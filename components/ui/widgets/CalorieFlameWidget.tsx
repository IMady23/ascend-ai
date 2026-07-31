import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { LivingWidget } from '../LivingWidget';

interface CalorieFlameWidgetProps {
  currentCalories: number;
  goalCalories: number;
  onClick?: () => void;
}

export function CalorieFlameWidget({ currentCalories, goalCalories, onClick }: CalorieFlameWidgetProps) {
  const prefersReducedMotion = useReducedMotion();
  const burnPercentage = Math.min(100, Math.max(10, (currentCalories / goalCalories) * 100)); // Minimum 10% size so flame doesn't disappear
  const flameScale = 0.5 + (burnPercentage / 100) * 0.7; // Maps 10% - 100% to 0.57x - 1.2x scale

  return (
    <LivingWidget onClick={onClick} theme="dark" className="group">
      <div className="flex flex-col h-full min-h-[160px] justify-between">
        <div className="flex justify-between items-start z-10">
          <h3 className="text-sm font-semibold text-white/80">Burned</h3>
          <span className="text-xs font-medium text-orange-400">
            {currentCalories} / {goalCalories} kcal
          </span>
        </div>

        <div className="relative flex-1 flex flex-col items-center justify-end pb-4 pt-8">
          <div className="relative w-16 h-20 flex items-end justify-center">
            
            {/* The base glow of the flame */}
            <motion.div 
              animate={prefersReducedMotion ? {} : { 
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.7, 0.5] 
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-2 w-16 h-16 bg-orange-500/20 rounded-full blur-xl pointer-events-none"
            />

            <motion.div
              style={{ originY: 1 }}
              animate={prefersReducedMotion ? { scale: flameScale } : {
                scale: [flameScale, flameScale * 1.05, flameScale * 0.98, flameScale],
                skewX: [0, -2, 2, 0]
              }}
              transition={prefersReducedMotion ? {} : {
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative w-12 h-16 pointer-events-none"
            >
              {/* Outer Flame (Orange) */}
              <svg viewBox="0 0 100 120" className="absolute inset-0 w-full h-full text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]">
                <motion.path 
                  animate={prefersReducedMotion ? {} : {
                    d: [
                      "M50,110 C80,110 90,80 90,55 C90,20 50,0 50,0 C50,0 10,20 10,55 C10,80 20,110 50,110 Z",
                      "M50,110 C85,110 95,85 90,60 C80,25 60,0 50,0 C40,0 15,25 10,60 C5,85 15,110 50,110 Z",
                      "M50,110 C75,110 85,75 90,50 C95,15 40,0 50,0 C60,0 5,15 10,50 C15,75 25,110 50,110 Z",
                      "M50,110 C80,110 90,80 90,55 C90,20 50,0 50,0 C50,0 10,20 10,55 C10,80 20,110 50,110 Z"
                    ]
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  fill="currentColor" 
                />
              </svg>

              {/* Inner Flame (Yellow) */}
              <svg viewBox="0 0 100 120" className="absolute inset-0 w-full h-full scale-[0.65] origin-bottom text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,1)]">
                <motion.path 
                  animate={prefersReducedMotion ? {} : {
                    d: [
                      "M50,110 C80,110 90,80 90,55 C90,20 50,0 50,0 C50,0 10,20 10,55 C10,80 20,110 50,110 Z",
                      "M50,110 C75,110 85,75 90,50 C95,15 40,0 50,0 C60,0 5,15 10,50 C15,75 25,110 50,110 Z",
                      "M50,110 C85,110 95,85 90,60 C80,25 60,0 50,0 C40,0 15,25 10,60 C5,85 15,110 50,110 Z",
                      "M50,110 C80,110 90,80 90,55 C90,20 50,0 50,0 C50,0 10,20 10,55 C10,80 20,110 50,110 Z"
                    ]
                  }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                  fill="currentColor" 
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </LivingWidget>
  );
}
