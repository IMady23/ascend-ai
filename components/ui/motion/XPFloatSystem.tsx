'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eventBus } from '@/lib/events/EventBus';
import { AscendEvent, XPGainedEvent } from '@/types/events';

interface XPFloat {
  id: string;
  amount: number;
  reason: string;
  x: number;
  y: number;
}

export function XPFloatSystem() {
  const [floats, setFloats] = useState<XPFloat[]>([]);

  useEffect(() => {
    const handleEvent = (event: AscendEvent) => {
      if (event.type === 'XP_GAINED') {
        const xpEvent = event as XPGainedEvent;
        const newFloat: XPFloat = {
          id: crypto.randomUUID(),
          amount: xpEvent.metadata.amount,
          reason: xpEvent.metadata.reason,
          x: window.innerWidth / 2 + (Math.random() * 100 - 50),
          y: window.innerHeight * 0.7 + (Math.random() * 50 - 25),
        };

        setFloats(prev => [...prev, newFloat]);

        // Clean up after animation
        setTimeout(() => {
          setFloats(prev => prev.filter(f => f.id !== newFloat.id));
        }, 3000);
      }
    };

    eventBus.subscribe('XP_GAINED', handleEvent);
    return () => eventBus.unsubscribe('XP_GAINED', handleEvent);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <AnimatePresence>
        {floats.map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: f.y, x: f.x, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1, 0], y: f.y - 150, x: f.x, scale: [0.5, 1.2, 1, 0.9] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="absolute flex flex-col items-center"
          >
            <span className="text-2xl font-black text-accent-gold drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">
              +{f.amount} XP
            </span>
            <span className="text-xs font-bold text-white drop-shadow-md mt-1 px-2 py-0.5 bg-black/40 rounded-full backdrop-blur-sm">
              {f.reason}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
