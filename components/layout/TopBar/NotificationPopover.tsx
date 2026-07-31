"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle2 } from "lucide-react";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}

export function NotificationPopover({ isOpen, onClose, anchorRef }: NotificationPopoverProps) {
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
          className="absolute right-0 top-[calc(100%+8px)] w-80 bg-base border border-border-subtle rounded-[var(--radius-xl)] shadow-[var(--shadow-2xl)] overflow-hidden z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border-subtle bg-surface">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-primary" />
              <Heading level="h4" className="text-sm">Notifications</Heading>
            </div>
            <Button variant="ghost" size="sm" className="h-6 text-xs px-2">Mark all read</Button>
          </div>

          {/* Empty State Body */}
          <div className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-transparent to-[var(--color-bg-surface)]">
            <div className="w-12 h-12 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center mb-4">
              <CheckCircle2 size={24} className="text-[var(--color-success)]" />
            </div>
            <Heading level="h4" className="text-base mb-2">You're all caught up.</Heading>
            <BodyText size="sm" className="text-secondary mb-6">
              Future reminders include:
            </BodyText>
            
            <ul className="flex flex-col gap-2 text-left w-full">
              <li className="flex items-center gap-2 text-xs text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-blue)]" />
                Workout reminders
              </li>
              <li className="flex items-center gap-2 text-xs text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-green)]" />
                Nutrition alerts
              </li>
              <li className="flex items-center gap-2 text-xs text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-indigo)]" />
                AI recommendations
              </li>
              <li className="flex items-center gap-2 text-xs text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-gold)]" />
                Weekly reports
              </li>
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
