import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface LivingWidgetProps {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  isCelebrating?: boolean;
  theme?: 'dark' | 'light';
  onClick?: () => void;
}

export function LivingWidget({
  children,
  className = '',
  isActive = false,
  isCelebrating = false,
  theme = 'dark',
  onClick,
}: LivingWidgetProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border transition-colors ${
        theme === 'dark'
          ? 'bg-black border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
          : 'bg-white/80 border-black/10 backdrop-blur-md shadow-sm'
      } ${className}`}
      animate={
        prefersReducedMotion ? {} : {
          scale: isActive ? 1.02 : 1,
          y: isActive ? -2 : 0,
        }
      }
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={prefersReducedMotion || !onClick ? {} : { scale: 1.01 }}
      whileTap={prefersReducedMotion || !onClick ? {} : { scale: 0.98 }}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Idle breathing animation layer (subtle gradient pulse) */}
      {!prefersReducedMotion && (
        <motion.div
          animate={{ opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent"
        />
      )}

      {/* Celebration Overlay */}
      {isCelebrating && !prefersReducedMotion && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-yellow-500/20 to-transparent mix-blend-overlay"
        />
      )}

      {/* Main Content */}
      <div className="relative z-10 h-full w-full p-4">
        {children}
      </div>
    </motion.div>
  );
}
