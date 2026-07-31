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
}

export function triggerCelebration(params: CelebrationParams) {
  // 1. Audio Chime
  AudioEngine.play('achievement');

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
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
