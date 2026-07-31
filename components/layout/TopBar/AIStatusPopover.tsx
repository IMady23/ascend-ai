"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Activity, Clock, ShieldCheck, Zap } from "lucide-react";
import { Heading, BodyText, Caption } from "@/components/adl/typography";

interface AIStatusPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}

export function AIStatusPopover({ isOpen, onClose, anchorRef }: AIStatusPopoverProps) {
  const popoverRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        isOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, anchorRef]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute right-12 top-[calc(100%+8px)] w-64 bg-base border border-border-subtle rounded-[var(--radius-xl)] shadow-[var(--shadow-2xl)] overflow-hidden z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-border-subtle bg-surface">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-accent-indigo)]/10">
              <Sparkles size={16} className="text-[var(--color-accent-indigo)]" />
            </div>
            <div>
              <Heading level="h4" className="text-sm">Ascend AI Core</Heading>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
                <span className="text-[10px] font-medium text-[var(--color-success)] uppercase tracking-wider">Online</span>
              </div>
            </div>
          </div>

          {/* Status List */}
          <div className="p-4 space-y-4">
            <div className="flex items-start gap-3">
              <Clock size={14} className="text-[var(--color-text-muted)] mt-0.5 shrink-0" />
              <div>
                <Caption className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Latest Analysis</Caption>
                <BodyText size="sm" className="font-medium text-primary">3 minutes ago</BodyText>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Activity size={14} className="text-[var(--color-text-muted)] mt-0.5 shrink-0" />
              <div>
                <Caption className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Current Focus</Caption>
                <BodyText size="sm" className="font-medium text-primary">Recovery & Sleep</BodyText>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck size={14} className="text-[var(--color-text-muted)] mt-0.5 shrink-0" />
              <div>
                <Caption className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Model Status</Caption>
                <BodyText size="sm" className="font-medium text-[var(--color-success)]">Ready</BodyText>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Zap size={14} className="text-[var(--color-text-muted)] mt-0.5 shrink-0" />
              <div>
                <Caption className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Context Memory</Caption>
                <BodyText size="sm" className="font-medium text-primary">14-Day Trajectory</BodyText>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
