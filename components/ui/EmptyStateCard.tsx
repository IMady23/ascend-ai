'use client';

import React from 'react';
import { MotionCard } from './motion/MotionCard';

interface EmptyStateCardProps {
  icon: string | React.ReactNode;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyStateCard({ icon, title, message, actionLabel, onAction, className }: EmptyStateCardProps) {
  return (
    <MotionCard className={`flex flex-col items-center justify-center p-8 text-center border-dashed border-2 border-border-subtle bg-bg-surface-elevated/50 ${className || ''}`} interactive={false}>
      <div className="text-4xl mb-4 bg-bg-base p-4 rounded-full shadow-sm border border-border-subtle">
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-text-primary mb-2">{title}</h4>
      <p className="text-sm text-text-secondary max-w-[280px] mb-6 leading-relaxed">
        {message}
      </p>
      
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="px-6 py-2.5 rounded-2xl bg-text-primary text-bg-base font-medium text-sm hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-text-primary"
        >
          {actionLabel}
        </button>
      )}
    </MotionCard>
  );
}
