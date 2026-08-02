import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioEngine } from '@/lib/audio/AudioEngine';
import { useToastStore } from '@/stores/toast.store';
import { useNotificationStore } from '@/stores/notification.store';
import { Timestamp } from 'firebase/firestore';

export interface CelebrationParams {
  title: string;
  message: string;
  type?: 'achievement' | 'goal' | 'streak' | 'levelUp';
  xpBurst?: number;
  mode?: 'default' | 'elegant';
}

export function triggerCelebration(params: CelebrationParams) {
  // 1. Audio Chime
  AudioEngine.playVictoryBurst();

  // 2. Toast & Browser Notification Fallback
  if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
    if (Notification.permission === 'granted') {
      new Notification(params.title, { body: params.message, icon: '/favicon.ico' });
    }
  } else {
    const { addToast } = useToastStore.getState();
    addToast({
      type: 'success',
      title: params.title,
      message: params.message,
      duration: 5000,
    });
  }

  // 3. Notification Center Entry
  const { setNotifications, notifications } = useNotificationStore.getState();
  const id = Math.random().toString(36).substring(2, 9);
  setNotifications([
    {
      id,
      title: params.title,
      body: params.message,
      type: params.type || 'achievement',
      read: false,
      link: null,
      createdAt: Timestamp.now(),
    },
    ...notifications
  ]);

  // 4. XP Burst & Confetti Event
  window.dispatchEvent(new CustomEvent('celebration:trigger', { detail: params }));
}

export function CelebrationSystem() {
  const [activeCelebration, setActiveCelebration] = useState<CelebrationParams | null>(null);

  useEffect(() => {
    const handleTrigger = (e: CustomEvent<CelebrationParams>) => {
      setActiveCelebration(e.detail);
      setTimeout(() => setActiveCelebration(null), 3000); // clear after 3s
    };

    window.addEventListener('celebration:trigger', handleTrigger as EventListener);
    return () => window.removeEventListener('celebration:trigger', handleTrigger as EventListener);
  }, []);

  return (
    <AnimatePresence>
      {activeCelebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
          className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md"
        >
          {activeCelebration.mode === 'elegant' ? (
            <div className="relative flex flex-col items-center justify-center">
              {/* Elegant Shimmer Background */}
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.5, 2], opacity: [0, 0.5, 0] }}
                transition={{ duration: 2.5, ease: "easeOut" }}
                className="absolute w-[300px] h-[300px] bg-accent-gold/20 rounded-full blur-3xl"
              />
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center gap-4 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-accent-gold to-yellow-200 shadow-[0_0_40px_rgba(250,204,21,0.6)] flex items-center justify-center">
                  <span className="text-3xl">⭐</span>
                </div>
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 tracking-tight">
                  {activeCelebration.title}
                </h2>
                <p className="text-lg text-white/80 max-w-sm">
                  {activeCelebration.message}
                </p>
                {activeCelebration.xpBurst && (
                  <motion.div
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="mt-2 rounded-full bg-accent-gold/10 border border-accent-gold/30 px-6 py-2 text-accent-gold font-bold text-lg"
                  >
                    +{activeCelebration.xpBurst} XP
                  </motion.div>
                )}
              </motion.div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="text-6xl"
              >
                🎉
              </motion.div>
              <h2 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600">
                {activeCelebration.title}
              </h2>
              {activeCelebration.xpBurst && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="rounded-full bg-yellow-500/20 border border-yellow-500/50 px-4 py-1 text-yellow-400 font-bold"
                >
                  +{activeCelebration.xpBurst} XP
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
