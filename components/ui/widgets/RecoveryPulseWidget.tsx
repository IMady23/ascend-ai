import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { LivingWidget } from '../LivingWidget';

interface RecoveryPulseWidgetProps {
  recoveryScore: number; // 0 - 100
  sleepHours: number;
  onClick?: () => void;
}

export function RecoveryPulseWidget({ recoveryScore, sleepHours, onClick }: RecoveryPulseWidgetProps) {
  const prefersReducedMotion = useReducedMotion();
  
  // High score = slower, calmer pulse. Low score = faster, alert pulse.
  const pulseDuration = recoveryScore > 80 ? 3 : recoveryScore > 50 ? 1.5 : 0.8;
  const pulseColor = recoveryScore > 80 ? 'text-indigo-400' : recoveryScore > 50 ? 'text-indigo-300' : 'text-rose-400';

  return (
    <LivingWidget onClick={onClick} theme="dark" className="group">
      <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl pointer-events-none">
        {/* Drifting Night Sky Stars */}
        {!prefersReducedMotion && (
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 left-0 w-[200%] h-full flex opacity-30"
          >
            <div className="w-1/2 h-full relative">
              <div className="absolute top-[10%] left-[20%] w-0.5 h-0.5 bg-white rounded-full" />
              <div className="absolute top-[30%] left-[60%] w-1 h-1 bg-white/80 rounded-full blur-[1px]" />
              <div className="absolute top-[70%] left-[40%] w-0.5 h-0.5 bg-white/60 rounded-full" />
              <div className="absolute top-[50%] left-[80%] w-1.5 h-1.5 bg-indigo-200/40 rounded-full blur-[2px]" />
            </div>
            <div className="w-1/2 h-full relative">
              <div className="absolute top-[10%] left-[20%] w-0.5 h-0.5 bg-white rounded-full" />
              <div className="absolute top-[30%] left-[60%] w-1 h-1 bg-white/80 rounded-full blur-[1px]" />
              <div className="absolute top-[70%] left-[40%] w-0.5 h-0.5 bg-white/60 rounded-full" />
              <div className="absolute top-[50%] left-[80%] w-1.5 h-1.5 bg-indigo-200/40 rounded-full blur-[2px]" />
            </div>
          </motion.div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col h-full min-h-[160px] justify-between">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-semibold text-white/80">Recovery</h3>
          <span className={`text-xs font-medium ${pulseColor}`}>
            {recoveryScore}%
          </span>
        </div>

        <div className="relative flex-1 flex flex-col items-center justify-center">
          
          <div className="relative w-full h-16 flex items-center justify-center">
            {/* Heartbeat EKG Line */}
            <svg viewBox="0 0 200 50" className="w-full h-full opacity-60">
              <motion.path
                d="M0,25 L60,25 L70,10 L85,45 L100,5 L115,35 L125,25 L200,25"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={pulseColor}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={prefersReducedMotion ? { pathLength: 1, opacity: 1 } : {
                  pathLength: [0, 1, 1],
                  opacity: [0, 1, 0]
                }}
                transition={prefersReducedMotion ? {} : {
                  duration: pulseDuration,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </svg>
            
            {/* Ambient Pulse Glow */}
            {!prefersReducedMotion && (
              <motion.div
                animate={{ opacity: [0.1, 0.4, 0.1], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: pulseDuration, repeat: Infinity, ease: 'easeInOut' }}
                className={`absolute w-16 h-16 rounded-full blur-2xl pointer-events-none ${recoveryScore > 50 ? 'bg-indigo-500/20' : 'bg-rose-500/20'}`}
              />
            )}
          </div>
          
          <p className="text-[11px] text-white/50 mt-2">
            {sleepHours} hrs sleep
          </p>
        </div>
      </div>
    </LivingWidget>
  );
}
