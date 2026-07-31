'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore, AppNotification } from '@/lib/notifications/NotificationService';
import { X, CheckCircle, Bell, Droplet, Dumbbell, Zap } from 'lucide-react';
import { AudioEngine } from '@/lib/audio/AudioEngine';
import { FeedbackEngine } from '@/lib/haptics/FeedbackEngine';

export function Toaster() {
  const { notifications, markAsRead } = useNotificationStore();
  // Only show unread notifications as toasts, limit to top 3
  const activeToasts = notifications.filter(n => !n.read).slice(0, 3);

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-3 pointer-events-none w-80">
      <AnimatePresence>
        {activeToasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => markAsRead(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({ toast, onDismiss }: { toast: AppNotification, onDismiss: () => void }) {
  
  useEffect(() => {
    // Trigger sound and haptics on mount
    switch(toast.category) {
      case 'workout':
        AudioEngine.playEnergeticPulse();
        break;
      case 'hydration':
        AudioEngine.playWaterDrop();
        break;
      case 'meal':
        AudioEngine.playSoftNotification();
        break;
      case 'achievement':
        AudioEngine.playVictoryBurst();
        FeedbackEngine.celebrationPulse();
        break;
      default:
        AudioEngine.playAttentionTone();
        FeedbackEngine.lightTap();
    }

    if (toast.autoDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  const getIcon = () => {
    switch(toast.category) {
      case 'achievement': return <Zap className="text-accent-gold" size={20} />;
      case 'hydration': return <Droplet className="text-accent-hydration" size={20} />;
      case 'workout': return <Dumbbell className="text-accent-workout" size={20} />;
      default: return <Bell className="text-text-secondary" size={20} />;
    }
  };

  const getBorderColor = () => {
    switch(toast.category) {
      case 'achievement': return 'border-accent-gold/50';
      case 'hydration': return 'border-accent-hydration/50';
      case 'workout': return 'border-accent-workout/50';
      case 'meal': return 'border-accent-nutrition/50';
      default: return 'border-border-subtle';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, { offset, velocity }) => {
        if (offset.x > 100 || velocity.x > 500) {
          onDismiss();
        }
      }}
      className={`glass-panel p-4 pointer-events-auto border-l-4 ${getBorderColor()} shadow-lg flex items-start gap-3`}
    >
      <div className="shrink-0 p-2 bg-bg-surface-elevated rounded-full">
        {getIcon()}
      </div>
      <div className="flex-1 pt-1">
        <h4 className="text-sm font-semibold text-text-primary">{toast.title}</h4>
        <p className="text-xs text-text-secondary mt-1">{toast.message}</p>
      </div>
      <button 
        onClick={onDismiss}
        className="shrink-0 p-1 text-text-disabled hover:text-text-primary transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}
