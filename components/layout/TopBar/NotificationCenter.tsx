"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle2 } from "lucide-react";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";
import { useReminderStore } from "@/stores/reminder.store";

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLButtonElement | null>;
}

export function NotificationCenter({ isOpen, onClose, anchorRef }: NotificationCenterProps) {
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const { history, markEventRead } = useReminderStore();
  const unreadCount = history.filter(h => !h.isRead).length;

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        isOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        (!anchorRef?.current || !anchorRef.current.contains(e.target as Node))
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
            {history.length > 0 && unreadCount > 0 && (
              <Button onClick={() => history.forEach(h => markEventRead(h.id))} variant="ghost" size="sm" className="h-6 text-xs px-2">Mark all read</Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto max-h-96 bg-gradient-to-b from-transparent to-[var(--color-bg-surface)]">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center mb-4">
                  <CheckCircle2 size={24} className="text-[var(--color-success)]" />
                </div>
                <Heading level="h4" className="text-base mb-2">You're all caught up.</Heading>
                <BodyText size="sm" className="text-secondary mb-6">
                  Future events will appear here.
                </BodyText>
              </div>
            ) : (
              <ul className="flex flex-col">
                {history.map((event) => (
                  <li 
                    key={event.id}
                    className={`flex gap-3 p-4 border-b border-border-subtle hover:bg-base/50 transition-colors ${!event.isRead ? "bg-base" : ""}`}
                  >
                    <div className="shrink-0 mt-1">
                      {event.type === 'reminder_triggered' && <Bell size={16} className="text-accent-dashboard" />}
                      {event.type === 'goal_completed' && <CheckCircle2 size={16} className="text-success" />}
                      {/* Can add more icons later */}
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-sm ${!event.isRead ? "font-semibold text-text-primary" : "text-text-secondary"}`}>{event.title}</span>
                        <span className="text-[10px] text-text-muted shrink-0">
                          {new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span className="text-xs text-text-secondary mt-1">{event.message}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
