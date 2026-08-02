import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface HydrationBeakerWidgetProps {
  currentOunces: number;
  goalOunces: number;
  onClick?: () => void;
}

export function HydrationBeakerWidget({ currentOunces, goalOunces, onClick }: HydrationBeakerWidgetProps) {
  const prefersReducedMotion = useReducedMotion();
  const fillPercentage = Math.min(100, Math.max(0, (currentOunces / goalOunces) * 100));

  // The liquid waves covering the full width
  const wave1 = (
    <motion.div
      animate={prefersReducedMotion ? {} : { x: ['0%', '-50%'] }}
      transition={{ ease: 'linear', duration: 4, repeat: Infinity }}
      className="absolute top-0 left-0 w-[200%] h-full opacity-60 flex"
    >
      <svg className="w-full h-full" viewBox="0 0 800 100" preserveAspectRatio="none">
        <path d="M0,50 Q100,0 200,50 T400,50 T600,50 T800,50 V100 H0 Z" fill="currentColor" className="text-blue-400" />
      </svg>
    </motion.div>
  );

  const wave2 = (
    <motion.div
      animate={prefersReducedMotion ? {} : { x: ['-50%', '0%'] }}
      transition={{ ease: 'linear', duration: 6, repeat: Infinity }}
      className="absolute top-0 left-0 w-[200%] h-full opacity-80 flex"
    >
      <svg className="w-full h-full" viewBox="0 0 800 100" preserveAspectRatio="none">
        <path d="M0,50 Q100,100 200,50 T400,50 T600,50 T800,50 V100 H0 Z" fill="currentColor" className="text-blue-500" />
      </svg>
    </motion.div>
  );

  return (
    <div 
      className="relative w-full h-48 sm:h-64 bg-bg-surface-elevated border border-border rounded-3xl overflow-hidden cursor-pointer group shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-transform hover:scale-[1.01] active:scale-[0.98]"
      onClick={onClick}
    >
      {/* Container Background (Empty State) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/20" />

      {/* Glass reflections overlay - applied to entire container */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-20 shadow-[inset_2px_0_20px_rgba(255,255,255,0.05)] rounded-3xl mix-blend-screen" />
      <div className="absolute left-4 top-4 bottom-8 w-4 bg-gradient-to-b from-white/10 to-transparent rounded-full z-20 mix-blend-overlay blur-sm" />

      {/* Liquid Mask spanning full container */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: `${fillPercentage}%` }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="absolute bottom-0 left-0 right-0 w-full overflow-hidden bg-blue-600/30 rounded-b-3xl"
      >
        {/* The liquid waves stay at the top edge */}
        <div className="absolute top-0 left-0 w-full h-[40px] -mt-[20px]">
          {!prefersReducedMotion && wave1}
          {!prefersReducedMotion && wave2}
        </div>
        
        {/* Solid liquid below the wave */}
        <div className="absolute top-[20px] bottom-0 left-0 right-0 bg-gradient-to-b from-blue-500 to-blue-800" />
        
        {/* Bubbles */}
        {!prefersReducedMotion && (
          <>
            <motion.div 
              animate={{ y: ['100%', '-100%'], opacity: [0, 1, 0] }} 
              transition={{ duration: 3, repeat: Infinity, ease: 'easeIn', delay: 0.5 }}
              className="absolute left-[20%] bottom-0 w-2 h-2 rounded-full bg-white/40 blur-[1px]"
            />
            <motion.div 
              animate={{ y: ['100%', '-100%'], opacity: [0, 1, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: 'easeIn', delay: 1.2 }}
              className="absolute left-[50%] bottom-0 w-3 h-3 rounded-full bg-white/30 blur-[1px]"
            />
            <motion.div 
              animate={{ y: ['100%', '-100%'], opacity: [0, 1, 0] }} 
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeIn', delay: 0.8 }}
              className="absolute left-[80%] bottom-0 w-1.5 h-1.5 rounded-full bg-white/50 blur-[1px]"
            />
          </>
        )}
      </motion.div>

      {/* Typography Overlay */}
      <div className="absolute inset-0 z-30 p-6 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-text-primary drop-shadow-md">Hydration</h3>
          <div className="text-right">
            <span className="text-2xl font-black text-text-primary drop-shadow-md">
              {currentOunces}
            </span>
            <span className="text-sm font-semibold text-text-secondary drop-shadow-md ml-1">
              / {goalOunces} ml
            </span>
          </div>
        </div>
        
        <div className="self-end pointer-events-auto">
          <button className="px-6 py-2 rounded-xl bg-bg-surface-elevated/80 hover:bg-bg-surface-elevated text-text-primary font-semibold backdrop-blur-md transition-colors border border-border shadow-lg flex items-center gap-2">
            <span className="text-lg">+</span> 250 ml
          </button>
        </div>
      </div>
    </div>
  );
}
