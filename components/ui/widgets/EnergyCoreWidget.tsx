import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { LivingWidget } from '../LivingWidget';

interface EnergyCoreWidgetProps {
  currentXP: number;
  levelXP: number;
  level: number;
  onClick?: () => void;
}

export function EnergyCoreWidget({ currentXP, levelXP, level, onClick }: EnergyCoreWidgetProps) {
  const prefersReducedMotion = useReducedMotion();
  const progress = Math.min(100, Math.max(0, (currentXP / levelXP) * 100));

  return (
    <LivingWidget onClick={onClick} theme="dark" className="group">
      <div className="flex flex-col h-full min-h-[160px] justify-between">
        <div className="flex justify-between items-start z-10">
          <h3 className="text-sm font-semibold text-white/80">Level {level}</h3>
          <span className="text-xs font-medium text-purple-400">
            {currentXP.toLocaleString()} / {levelXP.toLocaleString()} XP
          </span>
        </div>

        <div className="relative flex-1 flex items-center justify-center">
          
          {/* Core container */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            
            {/* Ambient Pulse */}
            {!prefersReducedMotion && (
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-purple-600/30 rounded-full blur-xl pointer-events-none"
              />
            )}

            {/* Orbital Rings (Based on progress) */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              {/* Background Track */}
              <circle
                cx="48"
                cy="48"
                r="36"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="6"
              />
              {/* Progress Track */}
              <motion.circle
                cx="48"
                cy="48"
                r="36"
                fill="none"
                stroke="url(#purpleGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ strokeDasharray: "226", strokeDashoffset: "226" }}
                animate={{ strokeDashoffset: 226 - (226 * progress) / 100 }}
                transition={{ type: 'spring', damping: 25, stiffness: 100 }}
              />
              <defs>
                <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" /> {/* purple-500 */}
                  <stop offset="100%" stopColor="#e879f9" /> {/* fuchsia-400 */}
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Core */}
            <motion.div
              animate={prefersReducedMotion ? {} : { scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 shadow-[0_0_15px_rgba(168,85,247,0.8)] flex items-center justify-center"
            >
              <span className="text-lg font-bold text-white drop-shadow-md">
                {Math.round(progress)}%
              </span>
            </motion.div>

            {/* Orbiting Particles */}
            {!prefersReducedMotion && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 z-20 pointer-events-none"
              >
                <div className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)]" />
              </motion.div>
            )}
            {!prefersReducedMotion && (
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-2 z-20 pointer-events-none"
              >
                <div className="absolute bottom-0 right-1/2 w-1 h-1 rounded-full bg-fuchsia-200 shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </LivingWidget>
  );
}
