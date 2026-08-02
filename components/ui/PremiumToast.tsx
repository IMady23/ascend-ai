import React, { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, CheckCircle, Info, AlertTriangle, Trophy } from 'lucide-react';

import { ToastType, Toast as ToastData } from '@/stores/toast.store';

interface PremiumToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
  ai: <Trophy className="w-5 h-5 text-purple-400" />,
  system: <Info className="w-5 h-5 text-gray-400" />,
};

export function PremiumToast({ toast, onDismiss }: PremiumToastProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (toast.duration !== Infinity) {
      const timer = setTimeout(() => {
        onDismiss(toast.id);
      }, toast.duration || 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  return (
    <motion.div
      layout
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 50, scale: 0.9 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-2xl bg-black/60 border border-white/10 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {icons[toast.type]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary">{toast.title}</p>
          {toast.message && (
            <p className="mt-1 text-sm text-text-secondary line-clamp-2">{toast.message}</p>
          )}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="flex-shrink-0 ml-4 rounded-full p-1 text-text-disabled hover:bg-bg-surface-elevated hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Glossy highlight line at the top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 sm:p-6 w-full sm:w-auto flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <PremiumToast key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}
