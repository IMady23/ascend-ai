"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Plus, SkipForward, Sparkles, CheckCircle2, Send } from "lucide-react";
import { cn } from "@/utils/cn";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";
import { ProgressRing } from "@/components/adl/composites/progress/Progress";

export interface RestTimerProps {
  durationSeconds: number;
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  onAddTime: (seconds: number) => void;
  aiMessage?: string;
  className?: string;
}

export function RestTimer({
  durationSeconds,
  isActive,
  onComplete,
  onSkip,
  onAddTime,
  aiMessage,
  className
}: RestTimerProps) {
  const [remaining, setRemaining] = React.useState(durationSeconds);
  const [total, setTotal] = React.useState(durationSeconds);

  React.useEffect(() => {
    setTotal(durationSeconds);
    setRemaining(durationSeconds);
  }, [durationSeconds, isActive]); // Reset when duration changes or becomes active

  React.useEffect(() => {
    if (!isActive || remaining <= 0) {
      return;
    }

    // Using a simpler interval for this demo, though requestAnimationFrame is better for prod
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, remaining, onComplete]);

  const progress = total > 0 ? ((total - remaining) / total) * 100 : 0;
  
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0, scale: 0.95 }}
          animate={{ opacity: 1, height: "auto", scale: 1 }}
          exit={{ opacity: 0, height: 0, scale: 0.95 }}
          className={cn(
            "p-6 rounded-[var(--radius-xl)] bg-[var(--color-bg-glass-active)] backdrop-blur-xl border border-[var(--color-accent-blue)]/30 shadow-[0_0_40px_rgba(var(--color-accent-blue-rgb),0.1)] flex flex-col items-center justify-center relative overflow-hidden",
            className
          )}
        >
          {/* Subtle background pulse */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent-blue)]/5 to-transparent pointer-events-none" />

          <div className="relative w-32 h-32 mb-6">
            <ProgressRing
              value={progress}
              size={128}
              strokeWidth={8}
              color="var(--color-accent-blue)"
              className="absolute inset-0"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {remaining > 0 ? (
                <>
                  <Timer size={16} className="text-[var(--color-text-muted)] mb-1" />
                  <Heading level="h3" className="text-3xl tracking-tighter tabular-nums font-mono text-primary">
                    {formatTime(remaining)}
                  </Heading>
                </>
              ) : (
                <div className="text-[var(--color-success)] flex flex-col items-center justify-center animate-pulse">
                  <CheckCircle2 size={32} className="mb-1" />
                  <div className="text-xs font-bold tracking-widest uppercase mt-1">Ready</div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 w-full max-w-[240px]">
            {remaining > 0 ? (
              <>
                <Button 
                  variant="ghost" 
                  fullWidth 
                  onClick={() => {
                    setTotal(prev => prev + 30);
                    setRemaining(prev => prev + 30);
                    onAddTime(30);
                  }}
                  leftIcon={<Plus size={16} />}
                  className="text-xs"
                >
                  30s
                </Button>
                <Button 
                  variant="secondary" 
                  fullWidth 
                  onClick={onSkip}
                  rightIcon={<SkipForward size={16} />}
                  className="text-xs"
                >
                  Skip
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  fullWidth 
                  onClick={() => {
                     setTotal(30);
                     setRemaining(30);
                     onAddTime(30);
                  }}
                  className="text-xs text-[var(--color-text-muted)] hover:text-primary"
                >
                  +30s
                </Button>
                <Button 
                  variant="primary" 
                  fullWidth 
                  onClick={onComplete}
                  className="bg-[var(--color-success)] hover:bg-[var(--color-success-dark)] border-none shadow-[0_0_20px_rgba(var(--color-success-rgb),0.3)] text-xs"
                >
                  Start Set
                </Button>
              </>
            )}
          </div>

          {/* AI Message */}
          {aiMessage && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-start gap-3 p-3 rounded-[var(--radius-lg)] bg-[var(--color-accent-indigo)]/10 border border-[var(--color-accent-indigo)]/20 w-full"
            >
              <Sparkles size={16} className="text-[var(--color-accent-indigo)] shrink-0 mt-0.5" />
              <Caption className="text-[var(--color-accent-indigo-light)] font-medium">
                {aiMessage}
              </Caption>
            </motion.div>
          )}

          {/* AI Q&A Input */}
          <div className="w-full mt-4">
            <div className="relative flex items-center">
              <Sparkles size={16} className="absolute left-3 text-[var(--color-accent-indigo)]" />
              <input 
                type="text" 
                placeholder="Ask AI Coach..." 
                className="w-full bg-base/50 border border-border-subtle rounded-full pl-10 pr-10 py-2.5 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-indigo)] placeholder:text-[var(--color-text-muted)]"
              />
              <button className="absolute right-2 p-1.5 rounded-full bg-[var(--color-accent-indigo)] text-primary hover:bg-[var(--color-accent-indigo-light)] transition-colors">
                <Send size={12} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
