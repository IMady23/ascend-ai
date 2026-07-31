import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Bell, Check, Trash2, X, Pin, Sparkles, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { useNotificationStore } from '@/stores/notification.store';
import { formatDistanceToNow } from 'date-fns';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  const { notifications, markAsRead, markAllRead, clearHistory, togglePin, removeNotification } = useNotificationStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  // Sort: Pinned first, then Unread, then by Date descending
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
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative z-50" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)] group"
      >
        <Bell className={`w-5 h-5 transition-colors ${unreadCount > 0 ? 'text-[var(--color-accent-blue)] group-hover:animate-swing' : 'text-[var(--color-text-secondary)]'}`} />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-danger)] text-[9px] font-bold text-white shadow-sm ring-2 ring-black"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.95 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            className="absolute right-0 mt-3 w-80 sm:w-[420px] rounded-2xl bg-black/80 border border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 shrink-0">
              <h3 className="font-semibold text-[var(--color-text-primary)]">Notification Center</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs font-medium text-[var(--color-accent-blue)] hover:text-blue-400 transition-colors flex items-center gap-1 bg-[var(--color-accent-blue)]/10 px-2 py-1 rounded-full"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-y-auto overscroll-contain p-2 space-y-1 flex-1 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {sortedNotifications.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 text-center text-sm text-[var(--color-text-muted)] flex flex-col items-center justify-center gap-3"
                  >
                    <Bell className="w-10 h-10 opacity-20" />
                    You're all caught up!
                  </motion.div>
                ) : (
                  sortedNotifications.map(notification => {
                    const isUnread = !notification.read;
                    const date = notification.createdAt?.toDate ? notification.createdAt.toDate() : new Date();
                    const isPinned = notification.pinned;
                    
                    // Determine Priority UI
                    let Icon = Info;
                    let iconColor = "text-[var(--color-text-muted)]";
                    let bgIcon = "bg-white/5";
                    let glow = "";
                    
                    if (notification.type === 'achievement') {
                      Icon = Sparkles;
                      iconColor = "text-[var(--color-accent-gold)]";
                      bgIcon = "bg-[var(--color-accent-gold)]/10";
                      glow = "shadow-[0_0_10px_rgba(251,191,36,0.2)]";
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
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={notification.id}
                        className={`group relative flex items-start gap-3 rounded-xl p-3 transition-colors border border-transparent ${
                          isUnread ? 'bg-white/10 hover:bg-white/15' : 'hover:bg-white/5'
                        } ${isPinned ? 'border-white/10 bg-white/5' : ''}`}
                      >
                        <div className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-full ${bgIcon} ${glow}`}>
                          <Icon size={16} className={iconColor} />
                        </div>
                        
                        <div 
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => {
                            if (isUnread) markAsRead(notification.id);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {isUnread && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-blue)] shadow-[0_0_8px_var(--color-accent-blue)]" />}
                            <p className={`text-sm font-medium ${isUnread ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'} truncate pr-8`}>
                              {notification.title}
                            </p>
                          </div>
                          <p className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-2 leading-relaxed">
                            {notification.body}
                          </p>
                          <p className="text-[10px] text-[var(--color-text-muted)] mt-1.5 font-medium uppercase tracking-wider">
                            {formatDistanceToNow(date, { addSuffix: true })}
                          </p>
                        </div>
                        
                        {/* Hover Actions */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePin(notification.id);
                            }}
                            className={`p-1.5 rounded-md transition-colors ${isPinned ? 'text-[var(--color-accent-gold)] bg-[var(--color-accent-gold)]/10' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/10'}`}
                            title={isPinned ? "Unpin" : "Pin"}
                          >
                            <Pin size={14} className={isPinned ? 'fill-current' : ''} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-colors"
                            title="Remove"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-white/10 bg-black/60 shrink-0">
                <button
                  onClick={clearHistory}
                  className="w-full flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear All Unpinned
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
