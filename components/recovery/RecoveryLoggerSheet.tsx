"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Moon, Brain, Activity, Coffee, ChevronRight, Check, Clock } from "lucide-react";
import { useRecoveryStore } from "@/stores/recovery.store";
import { useToastStore } from "@/stores/toast.store";
import { RecoveryActivityType } from "@/types/recovery";
import { cn } from "@/utils/cn";
import { useScrollIntoViewIfNeeded } from "@/hooks/useScrollIntoViewIfNeeded";

interface RecoveryLoggerSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECOVERY_OPTIONS: {
  type: RecoveryActivityType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  suggestedMinutes: number;
}[] = [
  {
    type: "sleep",
    label: "Sleep / Nap",
    description: "Rest and let your body repair itself.",
    icon: <Moon size={28} />,
    color: "var(--color-accent-indigo)",
    suggestedMinutes: 30,
  },
  {
    type: "meditation",
    label: "Meditation",
    description: "Clear your mind and reduce cortisol.",
    icon: <Brain size={28} />,
    color: "var(--color-accent-ai, #06B6D4)",
    suggestedMinutes: 10,
  },
  {
    type: "active_recovery",
    label: "Active Recovery",
    description: "Light stretching, yoga, or a slow walk.",
    icon: <Activity size={28} />,
    color: "var(--color-success)",
    suggestedMinutes: 20,
  },
  {
    type: "rest",
    label: "Sitting Idle / Rest",
    description: "No effort — just relax and do nothing.",
    icon: <Coffee size={28} />,
    color: "var(--color-accent-orange)",
    suggestedMinutes: 15,
  },
];

const FEELING_LABELS: Record<number, string> = {
  1: "Terrible 😣",
  2: "Very Bad 😖",
  3: "Bad 😞",
  4: "Meh 😐",
  5: "Okay 🙂",
  6: "Good 😊",
  7: "Pretty Good 😄",
  8: "Great 💪",
  9: "Excellent 🔥",
  10: "Peak 🚀",
};

type Step = "pick" | "during" | "checkin" | "done";

export function RecoveryLoggerSheet({ isOpen, onClose }: RecoveryLoggerSheetProps) {
  const { logRecoverySession } = useRecoveryStore();
  const { addToast } = useToastStore();

  const [step, setStep] = useState<Step>("pick");
  const [selectedType, setSelectedType] = useState<RecoveryActivityType | null>(null);
  const [activityTime, setActivityTime] = useState(30);
  const scrollRef = useScrollIntoViewIfNeeded<HTMLDivElement>(isOpen, {
    alignment: "nearest",
    offset: 64,
    focusFirstInput: false,
  });
  const [feelingBefore, setFeelingBefore] = useState(5);
  const [feelingAfter, setFeelingAfter] = useState(7);
  const [notes, setNotes] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setStep("pick");
      setSelectedType(null);
      setFeelingBefore(5);
      setFeelingAfter(7);
      setNotes("");
      setDurationMinutes(0);
      setElapsed(0);
      setTimerRunning(false);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen]);

  // Timer logic
  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed(e => e + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const selectedOption = RECOVERY_OPTIONS.find(o => o.type === selectedType);

  const handleStartRecovery = () => {
    if (!selectedType) return;
    setStep("during");
    setTimerRunning(true);
  };

  const handleDoneRecovery = () => {
    setTimerRunning(false);
    setDurationMinutes(Math.max(1, Math.round(elapsed / 60)));
    setStep("checkin");
  };

  const handleSubmit = async () => {
    if (!selectedType) return;
    setIsSubmitting(true);
    try {
      await logRecoverySession({
        type: selectedType,
        durationMinutes,
        feelingBefore,
        feelingAfter,
        notes: notes.trim() || undefined,
      });
      setStep("done");
      addToast({
        title: "Recovery Logged! 💪",
        message: `${selectedOption?.label} session of ${durationMinutes}min saved.`,
        type: "success",
      });
    } catch {
      addToast({ title: "Error", message: "Failed to save session.", type: "warning" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={step === "done" ? onClose : undefined} />
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        drag={step !== "during" ? "y" : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, { offset, velocity }) => {
          if (offset.y > 120 || velocity.y > 400) onClose();
        }}
        className="relative w-full max-w-lg mt-auto md:mt-0 z-10"
        ref={scrollRef}
      >
        <div
          className="flex flex-col overflow-hidden shadow-2xl rounded-t-[32px] md:rounded-[24px] rounded-b-none md:rounded-b-[24px] border border-[var(--color-border-subtle)]"
          style={{ background: "var(--color-bg-surface-elevated)" }}
        >
          {/* Drag handle */}
          <div className="md:hidden flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 rounded-full bg-[var(--color-border)]" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-subtle)]">
            <div>
              <h2 className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight">
                {step === "pick" && "Log Recovery"}
                {step === "during" && `${selectedOption?.label}`}
                {step === "checkin" && "How Do You Feel?"}
                {step === "done" && "Session Saved ✅"}
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                {step === "pick" && "Choose your recovery method"}
                {step === "during" && "Timer is running — take your time"}
                {step === "checkin" && "Rate before & after to track progress"}
                {step === "done" && "Great work. Your data is stored."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* ─── STEP 1: Pick Type ─── */}
          <AnimatePresence mode="wait">
            {step === "pick" && (
              <motion.div
                key="pick"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 space-y-4"
              >
                {/* Feeling Before */}
                <div>
                  <label className="text-xs uppercase tracking-widest font-semibold text-[var(--color-text-secondary)] mb-2 block">
                    How are you feeling RIGHT NOW?
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={feelingBefore}
                      onChange={e => setFeelingBefore(Number(e.target.value))}
                      className="flex-1 accent-[var(--color-success)]"
                    />
                    <span className="text-sm font-bold text-[var(--color-text-primary)] w-32 text-right">
                      {feelingBefore}/10 — {FEELING_LABELS[feelingBefore]}
                    </span>
                  </div>
                </div>

                {/* Recovery Options */}
                <label className="text-xs uppercase tracking-widest font-semibold text-[var(--color-text-secondary)] block">
                  Choose Recovery Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {RECOVERY_OPTIONS.map(opt => (
                    <button
                      key={opt.type}
                      onClick={() => setSelectedType(opt.type)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 active:scale-95 text-center",
                        selectedType === opt.type
                          ? "border-[var(--color-success)] bg-[var(--color-success)]/10"
                          : "border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] hover:border-[var(--color-border)]"
                      )}
                    >
                      <span style={{ color: opt.color }}>{opt.icon}</span>
                      <span className="text-sm font-semibold text-[var(--color-text-primary)] leading-tight">{opt.label}</span>
                      <span className="text-[10px] text-[var(--color-text-secondary)] leading-tight">{opt.description}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleStartRecovery}
                  disabled={!selectedType}
                  className="w-full py-4 bg-[var(--color-success)] text-white font-bold rounded-2xl text-base transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                >
                  Start Recovery <ChevronRight size={20} />
                </button>
              </motion.div>
            )}

            {/* ─── STEP 2: During ─── */}
            {step === "during" && (
              <motion.div
                key="during"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 flex flex-col items-center gap-6"
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ background: `${selectedOption?.color}20`, color: selectedOption?.color }}
                >
                  {selectedOption?.icon}
                </div>

                {/* Timer */}
                <div className="text-center">
                  <div className="text-6xl font-mono font-bold text-[var(--color-text-primary)] tracking-tighter">
                    {formatTime(elapsed)}
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                    {selectedOption?.label} in progress…
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1 flex items-center gap-1 justify-center">
                    <Clock size={12} />
                    Suggested: {selectedOption?.suggestedMinutes} min
                  </p>
                </div>

                <button
                  onClick={handleDoneRecovery}
                  className="w-full py-4 bg-[var(--color-success)] text-white font-bold rounded-2xl text-base transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Check size={20} /> Done — I Feel Better
                </button>
              </motion.div>
            )}

            {/* ─── STEP 3: Check-in After ─── */}
            {step === "checkin" && (
              <motion.div
                key="checkin"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 space-y-5"
              >
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-success)]/10 border border-[var(--color-success)]/20">
                  <Check size={16} className="text-[var(--color-success)]" />
                  <span className="text-sm text-[var(--color-text-primary)] font-medium">
                    Session: {durationMinutes} min of {selectedOption?.label}
                  </span>
                </div>

                {/* Feeling After */}
                <div>
                  <label className="text-xs uppercase tracking-widest font-semibold text-[var(--color-text-secondary)] mb-2 block">
                    How do you feel NOW? (after recovery)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={feelingAfter}
                      onChange={e => setFeelingAfter(Number(e.target.value))}
                      className="flex-1 accent-[var(--color-success)]"
                    />
                    <span className="text-sm font-bold text-[var(--color-text-primary)] w-32 text-right">
                      {feelingAfter}/10 — {FEELING_LABELS[feelingAfter]}
                    </span>
                  </div>
                  {feelingAfter > feelingBefore && (
                    <p className="text-xs text-[var(--color-success)] mt-1 font-medium">
                      ↑ +{feelingAfter - feelingBefore} points improvement!
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs uppercase tracking-widest font-semibold text-[var(--color-text-secondary)] mb-2 block">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="e.g. Felt tight in lower back, needed extra rest…"
                    rows={2}
                    className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-success)] transition-colors resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[var(--color-success)] text-white font-bold rounded-2xl text-base transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Saving…" : <><Check size={20} /> Save Recovery Session</>}
                </button>
              </motion.div>
            )}

            {/* ─── STEP 4: Done ─── */}
            {step === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 flex flex-col items-center gap-4 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center">
                  <Check size={40} className="text-[var(--color-success)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Recovery Saved!</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Your {selectedOption?.label} session of {durationMinutes} min has been logged. You went from{" "}
                  <strong>{feelingBefore}/10</strong> → <strong className="text-[var(--color-success)]">{feelingAfter}/10</strong>. 
                  Check your progress trends to see recovery history.
                </p>
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-[var(--color-success)] text-white font-bold rounded-2xl text-base active:scale-95"
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom safe area */}
          <div className="h-[env(safe-area-inset-bottom)]" />
        </div>
      </motion.div>
    </div>
  );
}
