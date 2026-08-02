'use client';

import React from 'react';
import { ToastContainer } from '@/components/ui/PremiumToast';
import { CelebrationSystem } from '@/components/ui/CelebrationSystem';
import { XPFloatSystem } from '@/components/ui/motion/XPFloatSystem';
import { useToastStore } from '@/stores/toast.store';

export function GlobalCelebrationProvider({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useToastStore();

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
      <CelebrationSystem />
      <XPFloatSystem />
    </>
  );
}
