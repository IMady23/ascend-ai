"use client";

import { useToastStore } from "@/stores/toast.store";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { CheckCircle2, Info, AlertTriangle, Sparkles, Server, X } from "lucide-react";
import React, { useEffect } from "react";

const ToastItem = ({ toast, removeToast }: { toast: any, removeToast: (id: string) => void }) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, 100], [1, 0]);

  let Icon = Info;
  let iconColor = "text-[var(--color-info)]";
  let bgIcon = "bg-[var(--color-info)]/10";
  let border = "border-border-subtle";
  let progressColor = "bg-[var(--color-info)]";

  if (toast.type === "success") {
    Icon = CheckCircle2;
    iconColor = "text-[var(--color-success)]";
    bgIcon = "bg-[var(--color-success)]/10";
    progressColor = "bg-[var(--color-success)]";
  } else if (toast.type === "warning") {
    Icon = AlertTriangle;
    iconColor = "text-[var(--color-warning)]";
    bgIcon = "bg-[var(--color-warning)]/10";
    border = "border-[var(--color-warning)]/30";
    progressColor = "bg-[var(--color-warning)]";
  } else if (toast.type === "ai") {
    Icon = Sparkles;
    iconColor = "text-[var(--color-accent-indigo)]";
    bgIcon = "bg-[var(--color-accent-indigo)]/10";
    border = "border-[var(--color-accent-indigo)]/30";
    progressColor = "bg-[var(--color-accent-indigo)]";
  } else if (toast.type === "system") {
    Icon = Server;
    iconColor = "text-[var(--color-text-secondary)]";
    bgIcon = "bg-surface";
    progressColor = "bg-[var(--color-text-secondary)]";
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.9, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)", transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{ x, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(e, { offset, velocity }) => {
        if (offset.x > 100 || velocity.x > 500) {
          removeToast(toast.id);
        }
      }}
      className={`relative pointer-events-auto flex gap-4 p-4 bg-white/10 dark:bg-black/40 backdrop-blur-2xl border ${border} rounded-[24px] shadow-2xl overflow-hidden group hover:bg-white/20 dark:hover:bg-black/50 transition-colors`}
    >
      <div className={`flex items-center justify-center shrink-0 w-10 h-10 rounded-full ${bgIcon}`}>
        <Icon size={20} className={iconColor} />
      </div>
      
      <div className="flex-1 flex flex-col justify-center pr-4">
        <span className="text-[15px] font-semibold text-[var(--color-text-primary)] tracking-tight">
          {toast.title}
        </span>
        {toast.message && (
          <span className="text-[13px] text-[var(--color-text-secondary)] mt-0.5 leading-snug">
            {toast.message}
          </span>
        )}
      </div>

      <button
        onClick={() => removeToast(toast.id)}
        className="absolute top-4 right-4 text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[var(--color-text-primary)] rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)]"
      >
        <X size={16} />
      </button>

      {/* Progress Indicator */}
      <motion.div
        className={`absolute bottom-0 left-0 h-1 ${progressColor} opacity-50`}
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: toast.duration ? toast.duration / 1000 : 5, ease: "linear" }}
      />
    </motion.div>
  );
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-[380px]">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
