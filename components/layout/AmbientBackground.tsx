'use client';

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

export function AmbientBackground() {
  const [mounted, setMounted] = useState(false);
  const [colors, setColors] = useState({
    orb1: 'var(--color-accent-gold)',
    orb2: 'var(--color-accent-blue)',
    orb3: 'var(--color-accent-purple)'
  });

  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();

  useEffect(() => {
    setMounted(true);
    
    // Set time-responsive colors
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      // Morning (Sunrise vibe)
      setColors({
        orb1: 'var(--color-accent-gold)',
        orb2: 'var(--color-accent-blue)',
        orb3: 'var(--color-accent-dashboard)'
      });
    } else if (hour >= 12 && hour < 18) {
      // Afternoon (Vibrant vibe)
      setColors({
        orb1: 'var(--color-accent-blue)',
        orb2: 'var(--color-accent-green)',
        orb3: 'var(--color-accent-purple)'
      });
    } else {
      // Evening/Night (Deep, calm vibe)
      setColors({
        orb1: 'var(--color-accent-indigo)',
        orb2: 'var(--color-accent-purple)',
        orb3: 'var(--color-accent-blue)'
      });
    }
    
    // Slow, subtle, breathing mesh gradients
    controls1.start({
      x: [0, 100, -50, 0],
      y: [0, -50, 50, 0],
      scale: [1, 1.2, 0.9, 1],
      opacity: [0.1, 0.15, 0.1],
      transition: { duration: 25, repeat: Infinity, ease: "linear" }
    });

    controls2.start({
      x: [0, -100, 50, 0],
      y: [0, 100, -50, 0],
      scale: [1, 1.5, 1, 1],
      opacity: [0.08, 0.12, 0.08],
      transition: { duration: 30, repeat: Infinity, ease: "linear" }
    });

    controls3.start({
      x: [0, 50, 100, 0],
      y: [0, -100, -50, 0],
      scale: [1, 0.8, 1.2, 1],
      opacity: [0.05, 0.1, 0.05],
      transition: { duration: 35, repeat: Infinity, ease: "linear" }
    });
  }, [controls1, controls2, controls3]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-bg-base" />
      
      {/* Mesh Orbs */}
      <motion.div
        animate={controls1}
        className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full mix-blend-screen blur-[120px] transition-colors duration-1000"
        style={{ background: `radial-gradient(circle, ${colors.orb1} 0%, transparent 70%)` }}
      />
      <motion.div
        animate={controls2}
        className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full mix-blend-screen blur-[140px] transition-colors duration-1000"
        style={{ background: `radial-gradient(circle, ${colors.orb2} 0%, transparent 70%)` }}
      />
      <motion.div
        animate={controls3}
        className="absolute -bottom-[20%] left-[20%] w-[40%] h-[40%] rounded-full mix-blend-screen blur-[100px] transition-colors duration-1000"
        style={{ background: `radial-gradient(circle, ${colors.orb3} 0%, transparent 70%)` }}
      />

      {/* Subtle Noise Texture Overlay for Premium Feel */}
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay'
        }}
      />
    </div>
  );
}
