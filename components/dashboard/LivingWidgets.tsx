'use client';

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Flame, Activity, Droplet } from 'lucide-react';

export function LivingHydrationWidget({ progress, width = 60, height = 80 }: { progress: number, width?: number, height?: number }) {
  const reducedMotion = useReducedMotion();
  const isGoal = progress >= 1;
  const fillHeight = Math.max(10, Math.min(100, progress * 100));
  const color = isGoal ? 'var(--color-accent-gold)' : 'var(--color-accent-hydration)';

  if (reducedMotion) {
    return (
      <div className="relative overflow-hidden rounded-b-[20px] rounded-t-sm border-2 border-t-0 border-border/60" style={{ width, height, background: 'var(--color-bg-surface-elevated)' }}>
        <div className="absolute bottom-0 left-0 right-0" style={{ height: `${fillHeight}%`, background: color, opacity: 0.6 }} />
        <Droplet size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40" />
      </div>
    );
  }

  // Stable random values — computed once, never re-created on render
  const bubblePositions = React.useMemo(
    () => Array.from({ length: 5 }, (_, i) => ({ x: 10 + (i * 19) % (width - 20) })),
    [width]
  );

  return (
    <div className="relative overflow-hidden rounded-b-[20px] rounded-t-sm border-2 border-t-0 border-border/60 shadow-inner group" style={{ width, height, background: 'var(--color-bg-surface-elevated)' }}>
      {/* Water Fill Layer */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 w-[200%]"
        initial={{ y: height }}
        animate={{ y: height - (height * fillHeight / 100) }}
        transition={{ type: 'spring', damping: 15, stiffness: 40 }}
      >
        <svg viewBox="0 0 200 100" className="w-full h-auto drop-shadow-[0_-2px_10px_rgba(56,189,248,0.5)]">
          {/* Back wave */}
          <motion.path
            d="M 0 50 Q 50 20 100 50 T 200 50 L 200 150 L 0 150 Z"
            fill={color}
            opacity="0.4"
            animate={{ x: [-100, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          />
          {/* Front wave */}
          <motion.path
            d="M 0 50 Q 50 80 100 50 T 200 50 L 200 150 L 0 150 Z"
            fill={color}
            opacity="0.7"
            animate={{ x: [-100, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          />
        </svg>
      </motion.div>

      {/* Bubble particles — stable positions, no Math.random() in render */}
      {progress > 0 && bubblePositions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full mix-blend-overlay"
          initial={{ y: height, x: pos.x, opacity: 0 }}
          animate={{ y: height - (height * fillHeight / 100) + 10, opacity: [0, 0.5, 0] }}
          transition={{ repeat: Infinity, duration: 2 + (i * 0.4), delay: i * 0.4 }}
        />
      ))}

      {/* Celebration Sparkles */}
      {isGoal && Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_var(--color-accent-gold)]"
          initial={{ top: '10%', left: `${20 + i * 25}%`, scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.4 }}
        />
      ))}

      {/* Glass Glare */}
      <div className="absolute top-0 right-2 w-3 h-full bg-gradient-to-b from-white/40 to-transparent rounded-full mix-blend-overlay transform -skew-x-12" />
    </div>
  );
}

// --- CALORIES FLAME ---
export function LivingFlameWidget({ progress, size = 60 }: { progress: number, size?: number }) {
  const reducedMotion = useReducedMotion();
  const isGoal = progress >= 1;
  const color = isGoal ? 'var(--color-accent-gold)' : 'var(--color-warning)';
  const scale = Math.max(0.2, Math.min(1.2, progress * 1.2));

  if (reducedMotion) {
    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <Flame size={size * 0.5 * scale} style={{ color }} />
      </div>
    );
  }

  // Stable particle offsets — no Math.random() on render
  const particleOffsets = React.useMemo(
    () => [{ x: -8, dur: 1.0 }, { x: 2, dur: 1.3 }, { x: 9, dur: 0.9 }],
    []
  );
  
  return (
    <div className="relative flex items-center justify-center group" style={{ width: size, height: size }}>
      {/* Ambient Glow */}
      <motion.div
        className="absolute rounded-full mix-blend-screen blur-md"
        style={{ width: size * 0.8, height: size * 0.8, background: color }}
        animate={{ 
          scale: progress > 0 ? [scale, scale * 1.2, scale] : 0.2,
          opacity: progress > 0 ? [0.4, 0.8, 0.4] : 0,
        }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      />
      {/* Flame Icon */}
      <motion.svg 
        viewBox="0 0 24 24" 
        fill={color} 
        className="relative z-10 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]" 
        style={{ width: size * 0.6 * scale, height: size * 0.6 * scale }}
      >
        <motion.path 
          d="M12 2c0 0-4.5 4.5-4.5 9.5a4.5 4.5 0 0 0 9 0C16.5 6.5 12 2 12 2z"
          animate={progress > 0 ? {
            d: [
              "M12 2c0 0-4.5 4.5-4.5 9.5a4.5 4.5 0 0 0 9 0C16.5 6.5 12 2 12 2z",
              "M12 1c0 0-5.5 5.5-3.5 10.5a4.5 4.5 0 0 0 8 -1C17.5 5.5 12 1 12 1z",
              "M12 2c0 0-4.5 4.5-4.5 9.5a4.5 4.5 0 0 0 9 0C16.5 6.5 12 2 12 2z"
            ]
          } : {}}
          transition={{ repeat: Infinity, duration: Math.max(0.5, 1.2 - progress * 0.5), ease: 'easeInOut' }}
        />
      </motion.svg>
      {/* Particles — stable offsets */}
      {progress > 0 && particleOffsets.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full mix-blend-screen"
          style={{ background: color }}
          initial={{ y: 0, opacity: 0, scale: 0 }}
          animate={{ y: -size * 0.8, opacity: [0, 1, 0], scale: [0, 1, 0], x: p.x }}
          transition={{ repeat: Infinity, duration: p.dur, delay: i * 0.3 }}
        />
      ))}
    </div>
  );
}

// --- STEPS TRAIL ---
export function LivingTrailWidget({ progress, width = 100 }: { progress: number, width?: number }) {
  const reducedMotion = useReducedMotion();
  const isGoal = progress >= 1;
  const fillPercentage = Math.min(100, Math.max(0, progress * 100));
  const color = isGoal ? 'var(--color-accent-gold)' : 'var(--color-text-secondary)';

  if (reducedMotion) {
    return (
      <div className="relative flex items-center" style={{ width, height: 40 }}>
        <div className="absolute top-1/2 left-0 right-0 h-1 border-t-2 border-dashed border-border-subtle" />
        <div className="absolute top-1/2 left-0 h-1 border-t-2" style={{ width: `${fillPercentage}%`, borderColor: color }} />
        <Activity size={16} className="absolute" style={{ left: `calc(${fillPercentage}% - 8px)`, top: '50%', transform: 'translateY(-50%)', color }} />
      </div>
    );
  }

  // Stable dust particle offsets
  const dustOffsets = React.useMemo(
    () => [
      { offset: 20, yRange: 6, dur: 1.5 },
      { offset: 28, yRange: -5, dur: 1.9 },
      { offset: 22, yRange: 7, dur: 1.6 },
      { offset: 35, yRange: -4, dur: 1.8 },
    ],
    []
  );
  
  return (
    <div className="relative flex items-center group" style={{ width, height: 40 }}>
      {/* Background Trail */}
      <div className="absolute top-1/2 left-0 right-0 h-1 border-t-2 border-dashed border-border-subtle" />
      
      {/* Active Trail */}
      <motion.div 
        className="absolute top-1/2 left-0 h-1 border-t-2 border-dashed"
        style={{ borderColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${fillPercentage}%` }}
        transition={{ type: 'spring', damping: 20 }}
      />
      
      {/* Glow on active trail */}
      <motion.div 
        className="absolute top-1/2 left-0 h-1 border-t-2 border-solid mix-blend-screen blur-[2px]"
        style={{ borderColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${fillPercentage}%` }}
        transition={{ type: 'spring', damping: 20 }}
      />
      
      {/* Dust Particles — stable offsets */}
      {progress > 0 && dustOffsets.map((d, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 w-1 h-1 rounded-full opacity-60"
          style={{ background: color }}
          initial={{ left: `calc(${fillPercentage}% - ${d.offset}px)`, opacity: 0, scale: 0, y: 0 }}
          animate={{ 
            left: `calc(${fillPercentage}% - ${d.offset}px)`, 
            opacity: [0, 0.8, 0], 
            scale: [0, 1.5, 0], 
            y: d.yRange
          }}
          transition={{ repeat: Infinity, duration: d.dur, delay: i * 0.3 }}
        />
      ))}

      {/* Walker Icon */}
      <motion.div
        className="absolute top-1/2 -mt-3 z-10"
        initial={{ left: 0 }}
        animate={{ left: `calc(${fillPercentage}% - 12px)` }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-bg-surface border-2 shadow-md ${isGoal ? 'animate-bounce' : ''}`} style={{ borderColor: color, color }}>
          <span className="text-[10px]">👟</span>
        </div>
        {/* Milestone Glow */}
        {isGoal && (
          <motion.div 
            className="absolute inset-0 rounded-full bg-white blur-md mix-blend-overlay"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}
      </motion.div>
    </div>
  );
}

// --- XP ENERGY CORE ---
export function LivingEnergyCore({ progress, size = 60 }: { progress: number, size?: number }) {
  const isGoal = progress >= 1;
  const color = isGoal ? 'var(--color-accent-gold)' : 'var(--color-accent-workout)';
  
  return (
    <div className="relative flex items-center justify-center group" style={{ width: size, height: size }}>
      {/* Core Pulse Glow */}
      <motion.div
        className="absolute rounded-full mix-blend-screen blur-md"
        style={{ width: size * 0.5, height: size * 0.5, background: color }}
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      />

      {/* Orbiting Ring 1 */}
      <motion.div
        className="absolute rounded-full border-2 border-transparent border-t-current border-b-current opacity-30"
        style={{ width: size * 0.8, height: size * 0.8, color }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
      />

      {/* Orbiting Ring 2 */}
      <motion.div
        className="absolute rounded-full border-[1.5px] border-transparent border-l-current border-r-current opacity-50"
        style={{ width: size, height: size, color }}
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
      />
      
      {/* Burst Animation on Goal */}
      {isGoal && (
        <motion.div
          className="absolute rounded-full bg-white blur-xl mix-blend-overlay"
          style={{ width: size, height: size }}
          animate={{ scale: [1, 2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}

      {/* Pulsating Center Core */}
      <motion.div 
        className="relative z-10 rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]" 
        style={{ width: 16, height: 16, background: 'white' }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}
      />
      
      {/* Rotating Particles */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{ background: color, top: '50%', left: '50%', marginTop: -3, marginLeft: -3 }}
          animate={{
            x: [Math.cos(i * Math.PI / 2) * size * 0.4, Math.cos((i + 1) * Math.PI / 2) * size * 0.4],
            y: [Math.sin(i * Math.PI / 2) * size * 0.4, Math.sin((i + 1) * Math.PI / 2) * size * 0.4],
            opacity: [0.2, 1, 0.2]
          }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

// --- NIGHT SKY (SLEEP) ---
export function LivingNightSky({ progress, width = 120, height = 60 }: { progress: number, width?: number, height?: number }) {
  const isGoal = progress >= 1;
  const moonColor = isGoal ? '#FFD700' : '#E2E8F0';
  
  const bgColors = isGoal 
    ? ['#1E1B4B', '#4C1D95'] 
    : ['#0F172A', '#1E293B'];

  // Stable star positions
  const stars = React.useMemo(() => [
    { left: 15, top: 20, dur: 2.1 }, { left: 32, top: 55, dur: 3.2 },
    { left: 48, top: 18, dur: 2.7 }, { left: 65, top: 70, dur: 2.3 },
    { left: 78, top: 30, dur: 3.5 }, { left: 88, top: 60, dur: 2.0 },
    { left: 22, top: 75, dur: 2.9 }, { left: 92, top: 15, dur: 3.1 },
  ], []);

  return (
    <div className="relative overflow-hidden rounded-xl shadow-inner group" style={{ width, height, background: `linear-gradient(to bottom, ${bgColors[0]}, ${bgColors[1]})` }}>
      {/* Drifting Clouds */}
      <motion.div
        className="absolute w-12 h-4 bg-white/10 rounded-full blur-md"
        initial={{ x: -20, y: height * 0.4 }}
        animate={{ x: width + 20 }}
        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
      />
      <motion.div
        className="absolute w-16 h-6 bg-white/5 rounded-full blur-md"
        initial={{ x: -40, y: height * 0.6 }}
        animate={{ x: width + 40 }}
        transition={{ repeat: Infinity, duration: 12, ease: 'linear', delay: 2 }}
      />

      {/* The Moon */}
      <motion.div
        className="absolute w-8 h-8 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)]"
        style={{ background: moonColor }}
        initial={{ x: -20, y: height }}
        animate={{ x: width * progress - 16, y: height * 0.2 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        {/* Moon Glow Aura */}
        <motion.div
          className="absolute inset-0 rounded-full bg-white blur-md mix-blend-overlay"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
      </motion.div>

      {/* Drifting Stars — stable positions */}
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{ left: `${s.left}%`, top: `${s.top}%` }}
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: s.dur }}
        />
      ))}
    </div>
  );
}

// --- RECOVERY HEARTBEAT ---
export function LivingHeartbeat({ progress, size = 60 }: { progress: number, size?: number }) {
  const color = progress > 0.8 ? 'var(--color-success)' : progress > 0.5 ? 'var(--color-warning)' : 'var(--color-danger)';
  
  return (
    <div className="relative flex items-center justify-center group" style={{ width: size, height: size }}>
      {/* Outer recovery aura */}
      <motion.div
        className="absolute rounded-full mix-blend-screen blur-lg"
        style={{ width: size * 0.8, height: size * 0.8, background: color }}
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      />
      {/* Inner pulsing orb */}
      <motion.div
        className="absolute rounded-full mix-blend-overlay shadow-[inset_0_0_15px_rgba(255,255,255,0.8)]"
        style={{ width: size * 0.5, height: size * 0.5, background: `radial-gradient(circle, ${color} 0%, transparent 80%)` }}
        animate={{ 
          scale: [0.8, 1.1, 0.8],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
      />
      
      {/* Heartbeat Line */}
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 drop-shadow-md" style={{ width: size * 0.5, height: size * 0.5 }}>
        <motion.path 
          d="M22 12h-4l-3 9L9 3l-3 9H2" 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        />
      </svg>
    </div>
  );
}
