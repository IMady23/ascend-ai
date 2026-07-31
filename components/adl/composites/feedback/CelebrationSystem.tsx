"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/stores/settings.store';
import { AudioEngine } from '@/lib/audio/AudioEngine';

// A lightweight confetti particle
const Confetti = ({ color, style }: { color: string, style: React.CSSProperties }) => (
  <motion.div
    className="absolute w-2 h-4 rounded-sm"
    style={{ backgroundColor: color, ...style }}
    initial={{ y: -50, opacity: 1, rotate: 0 }}
    animate={{ 
      y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000, 
      opacity: [1, 1, 0],
      rotate: [0, 360, 720]
    }}
    transition={{ duration: 2 + Math.random() * 2, ease: "easeIn" }}
  />
);

export function CelebrationSystem() {
  const [active, setActive] = useState(false);
  
  // Expose a global method to trigger celebrations
  useEffect(() => {
    const handleTrigger = () => {
      setActive(true);
      AudioEngine.playVictoryBurst();
      setTimeout(() => setActive(false), 4000);
    };

    window.addEventListener('trigger-celebration', handleTrigger);
    return () => window.removeEventListener('trigger-celebration', handleTrigger);
  }, []);

  if (!active) return null;

  const colors = ['#FFD700', '#F59E0B', '#10B981', '#3B82F6', '#EC4899'];
  const particles = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    color: colors[Math.floor(Math.random() * colors.length)],
    left: `${Math.random() * 100}vw`,
    delay: Math.random() * 0.5
  }));

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden flex items-center justify-center">
      {/* Gold Pulse Aura */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent-gold)]/20 to-transparent mix-blend-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      
      {/* Center Burst */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-white blur-3xl mix-blend-overlay"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 2], opacity: [0, 0.8, 0] }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      
      {/* Confetti Rain */}
      {particles.map((p) => (
        <Confetti 
          key={p.id} 
          color={p.color} 
          style={{ 
            left: p.left,
            animationDelay: `${p.delay}s`
          }} 
        />
      ))}
    </div>
  );
}
