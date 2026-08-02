"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Trash2, X, Pin, Sparkles, AlertTriangle, Info, CheckCircle2, Flame } from "lucide-react";
import { useNotificationStore } from "@/stores/notification.store";
import { formatDistanceToNow } from "date-fns";

interface MobileNotificationSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNotificationSheet({ isOpen, onClose }: MobileNotificationSheetProps) {
  const { notifications, markAsRead, markAllRead, clearHistory, togglePin, removeNotification } = useNotificationStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    if (!a.read && b.read) return -1;
    if (a.read && !b.read) return 1;
    
    const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
    const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
    return timeB - timeA;
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = "auto";
        window.removeEventListener("keydown", handleEscape);
      };
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] md:hidden flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-base/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full h-[85vh] bg-bg-base rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border-t border-glass-border"
            role="dialog"
            aria-modal="true"
            aria-label="Notification Center"
          >
            <div className="w-full flex justify-center pt-3 pb-1 shrink-0" onClick={onClose}>
              <div className="w-12 h-1.5 rounded-full bg-border" />
            </div>

            <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0 bg-bg-surface-elevated">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-primary" />
                <h3 className="font-bold text-lg text-primary tracking-tight">Notifications</h3>
              </div>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      import("@/utils/haptics").then(({ vibrate }) => vibrate(10));
                      markAllRead();
                    }}
                    className="text-xs font-semibold text-[var(--color-accent-blue)] hover:text-blue-400 transition-colors flex items-center gap-1 bg-[var(--color-accent-blue)]/10 px-3 py-1.5 rounded-full"
                  >
                    <Check size={14} /> Mark all read
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className="p-2 -mr-2 text-text-secondary hover:text-primary transition-colors rounded-lg bg-bg-surface-elevated border border-border"
                  aria-label="Close notifications"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-2 pb-[env(safe-area-inset-bottom)]">
              <AnimatePresence mode="popLayout">
                {sortedNotifications.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-48 text-text-disabled"
                  >
                    <CheckCircle2 size={40} className="mb-3 opacity-50 text-[var(--color-success)]" />
                    <p className="text-base font-semibold text-text-secondary">You're all caught up!</p>
                  </motion.div>
                ) : (
                  <div className="space-y-2">
                    {sortedNotifications.map(notification => {
                      const isUnread = !notification.read;
                      const date = notification.createdAt?.toDate ? notification.createdAt.toDate() : new Date();
                      const isPinned = notification.pinned;
                      
                      let Icon = Info;
                      let iconColor = "text-text-disabled";
                      let bgIcon = "bg-bg-surface-elevated";
                      let glow = "";
                      
                      if (notification.type === 'achievement') {
                        Icon = Sparkles;
                        iconColor = "text-[var(--color-accent-gold)]";
                        bgIcon = "bg-[var(--color-accent-gold)]/10";
                        glow = "shadow-[0_0_10px_rgba(251,191,36,0.2)]";
                      } else if (notification.type === 'workout') {
                        Icon = Flame;
                        iconColor = "text-[var(--color-accent-purple)]";
                        bgIcon = "bg-[var(--color-accent-purple)]/10";
                      } else if (notification.priority === 'high' || notification.type === 'system') {
                        Icon = AlertTriangle;
                        iconColor = "text-[var(--color-danger)]";
                        bgIcon = "bg-[var(--color-danger)]/10";
                        glow = "shadow-[0_0_10px_rgba(239,68,68,0.2)]";
                      } else if (notification.priority === 'medium') {
                        Icon = Info;
                        iconColor = "text-[var(--color-warning)]";
                        bgIcon = "bg-[var(--color-warning)]/10";
                      } else if (notification.type === 'reminder') {
                        Icon = CheckCircle2;
                        iconColor = "text-[var(--color-accent-blue)]";
                        bgIcon = "bg-[var(--color-accent-blue)]/10";
                      }
                      
                      return (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95, x: -100 }}
                          key={notification.id}
                          className={`group relative flex items-start gap-4 rounded-2xl p-4 transition-colors border border-transparent ${
                            isUnread ? 'bg-accent-ai/5' : 'bg-bg-surface-elevated'
                          } ${isPinned ? 'border-border' : ''}`}
                          onClick={() => {
                            if (isUnread) markAsRead(notification.id);
                          }}
                        >
                          <div className={`flex items-center justify-center shrink-0 w-10 h-10 rounded-full ${bgIcon} ${glow}`}>
                            <Icon size={20} className={iconColor} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {isUnread && <div className="w-2 h-2 rounded-full bg-[var(--color-accent-blue)] shadow-[0_0_8px_var(--color-accent-blue)]" />}
                              <p className={`text-base font-semibold ${isUnread ? 'text-text-primary' : 'text-text-secondary'} truncate pr-8`}>
                                {notification.title}
                              </p>
                            </div>
                            <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                              {notification.body}
                            </p>
                            <p className="text-xs text-text-disabled mt-2 font-medium uppercase tracking-wider">
                              {formatDistanceToNow(date, { addSuffix: true })}
                            </p>
                          </div>
                          
                          <div className="absolute top-3 right-3 flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePin(notification.id);
                              }}
                              className={`p-2 rounded-xl transition-colors ${isPinned ? 'text-[var(--color-accent-gold)] bg-[var(--color-accent-gold)]/10' : 'text-text-disabled hover:bg-border'}`}
                            >
                              <Pin size={16} className={isPinned ? 'fill-current' : ''} />
                            </button>
                            {!isPinned && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  import("@/utils/haptics").then(({ vibrate }) => vibrate(10));
                                  removeNotification(notification.id);
                                }}
                                className="p-2 rounded-xl text-text-disabled hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-colors"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {notifications.length > 0 && (
              <div className="p-4 border-t border-border bg-bg-surface shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <button
                  onClick={() => {
                    import("@/utils/haptics").then(({ vibrate }) => vibrate(10));
                    clearHistory();
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-semibold text-text-secondary bg-bg-surface-elevated hover:bg-border transition-colors border border-border"
                >
                  <Trash2 size={16} /> Clear All Unpinned
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
