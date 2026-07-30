"use client";

import { useToastStore } from "@/stores/toast.store";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Info, AlertTriangle, Sparkles, Server } from "lucide-react";
import { X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => {
          let Icon = Info;
          let iconColor = "text-[var(--color-info)]";
          let bgIcon = "bg-[var(--color-info)]/10";
          let border = "border-[var(--color-glass-border)]";

          if (toast.type === "success") {
            Icon = CheckCircle2;
            iconColor = "text-[var(--color-success)]";
            bgIcon = "bg-[var(--color-success)]/10";
          } else if (toast.type === "warning") {
            Icon = AlertTriangle;
            iconColor = "text-[var(--color-warning)]";
            bgIcon = "bg-[var(--color-warning)]/10";
            border = "border-[var(--color-warning)]/30";
          } else if (toast.type === "ai") {
            Icon = Sparkles;
            iconColor = "text-[var(--color-accent-indigo)]";
            bgIcon = "bg-[var(--color-accent-indigo)]/10";
            border = "border-[var(--color-accent-indigo)]/30";
          } else if (toast.type === "system") {
            Icon = Server;
            iconColor = "text-[var(--color-text-secondary)]";
            bgIcon = "bg-[var(--color-bg-surface)]";
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
              className={`relative pointer-events-auto flex gap-3 p-4 bg-[var(--color-bg-glass-active)] backdrop-blur-xl border ${border} rounded-[var(--radius-xl)] shadow-lg overflow-hidden`}
            >
              <div className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-full ${bgIcon}`}>
                <Icon size={16} className={iconColor} />
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {toast.title}
                </span>
                {toast.message && (
                  <span className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    {toast.message}
                  </span>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="absolute top-3 right-3 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)] rounded-full"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
