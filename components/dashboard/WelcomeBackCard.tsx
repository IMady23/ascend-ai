'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X } from 'lucide-react';

function getRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 5) return 'just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'yesterday';
  return `${diffDays} days ago`;
}

interface WelcomeBackCardProps {
  userName: string;
  dailyScore: number;
}

export function WelcomeBackCard({ userName, dailyScore }: WelcomeBackCardProps) {
  const [lastVisit, setLastVisit] = useState<number | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [relativeTime, setRelativeTime] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('ascend-last-visit');
    const now = Date.now();

    if (stored) {
      const lastTimestamp = parseInt(stored, 10);
      const diffHours = (now - lastTimestamp) / 3600000;

      // Only show if last visit was more than 2 hours ago
      if (diffHours >= 2) {
        setLastVisit(lastTimestamp);
        setRelativeTime(getRelativeTime(lastTimestamp));
      }
    }

    // Update last visit timestamp every time dashboard loads
    localStorage.setItem('ascend-last-visit', now.toString());
  }, []);

  if (!lastVisit || isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="mb-4 relative"
      >
        <div className="glass-panel rounded-2xl p-4 border border-accent-blue/20 bg-accent-blue/5 flex items-center gap-4">
          {/* Icon */}
          <div className="w-10 h-10 rounded-full bg-accent-blue/15 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-accent-blue" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary">
              Welcome back, {userName} 👋
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              Last visit{' '}
              <span className="text-text-primary font-medium">{relativeTime}</span>
              {dailyScore > 0 && (
                <> · You're at <span className="text-accent-blue font-bold">{dailyScore}%</span> today</>
              )}
            </p>
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setIsDismissed(true)}
            className="shrink-0 p-1.5 rounded-full text-text-disabled hover:text-text-primary hover:bg-bg-surface-elevated transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
