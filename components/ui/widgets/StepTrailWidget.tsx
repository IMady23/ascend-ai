import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { LivingWidget } from '../LivingWidget';

interface StepTrailWidgetProps {
  currentSteps: number;
  goalSteps: number;
  onClick?: () => void;
}

export function StepTrailWidget({ currentSteps, goalSteps, onClick }: StepTrailWidgetProps) {
  const prefersReducedMotion = useReducedMotion();
  const progress = Math.min(100, Math.max(0, (currentSteps / goalSteps) * 100));

  // We map progress to 0-10 for discrete footprint positions
  const footprintCount = 10;
  const activeFootprints = Math.floor((progress / 100) * footprintCount);

  return (
    <LivingWidget onClick={onClick} theme="dark" className="group">
      <div className="flex flex-col h-full min-h-[160px] justify-between">
        <div className="flex justify-between items-start z-10">
          <h3 className="text-sm font-semibold text-white/80">Steps</h3>
          <span className="text-xs font-medium text-emerald-400">
            {currentSteps.toLocaleString()} / {goalSteps.toLocaleString()}
          </span>
        </div>

        <div className="relative flex-1 flex flex-col justify-center">
          {/* Background Path Line */}
          <div className="absolute w-full h-1 bg-white/10 rounded-full top-1/2 -translate-y-1/2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
            />
          </div>

          {/* Footprints */}
          <div className="relative w-full h-12 flex items-center justify-between px-2">
            {Array.from({ length: footprintCount }).map((_, i) => {
              const isActive = i < activeFootprints;
              const isCurrent = i === activeFootprints - 1;
              const isLeftFoot = i % 2 === 0;

              return (
                <div key={i} className="relative w-4 h-6 flex items-center justify-center">
                  <motion.div
                    animate={
                      isActive
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0.2, scale: 0.8 }
                    }
                    transition={{ duration: 0.5 }}
                    className={`text-[10px] ${isActive ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'text-white/20'}`}
                    style={{
                      transform: `translateY(${isLeftFoot ? '-8px' : '8px'}) rotate(${isLeftFoot ? '-15deg' : '15deg'})`,
                    }}
                  >
                    🐾
                  </motion.div>
                  
                  {/* Current step pulse effect */}
                  {isCurrent && !prefersReducedMotion && (
                    <motion.div
                      animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                      className="absolute inset-0 bg-emerald-400/30 rounded-full"
                      style={{
                        transform: `translateY(${isLeftFoot ? '-8px' : '8px'})`,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </LivingWidget>
  );
}
