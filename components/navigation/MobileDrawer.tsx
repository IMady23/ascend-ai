"use client";

import React, { useEffect, useState } from "react";
import { useUiStore } from "@/stores/ui.store";
import { useUserStore } from "@/stores/user.store";
import { useProgressionStore } from "@/stores/progression.store";
import { useSettingsStore } from "@/stores/settings.store";
import { useNotificationStore } from "@/stores/notification.store";
import { AuthRepository } from "@/services/repositories/auth.repository";
import { resetStoresOnLogout } from "@/lib/auth/reset-stores";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Moon, Sun, Monitor, Bell, Settings, LogOut, Trash2, 
  Shield, Target
} from "lucide-react";
import { Avatar } from "@/components/adl/primitives/Avatar";
import { MODULE_CONFIG } from "@/constants/modules.config";
import { MobileNotificationSheet } from "../layout/NotificationCenter/MobileNotificationSheet";

export function MobileDrawer() {
  const { isMobileDrawerOpen, setMobileDrawerOpen } = useUiStore();
  const { profile } = useUserStore();
  const { profile: progressionProfile } = useProgressionStore();
  const { appearance, updateAppearance } = useSettingsStore();
  const { notifications } = useNotificationStore();
  const router = useRouter();
  const pathname = usePathname();

  const [isNotifSheetOpen, setIsNotifSheetOpen] = useState(false);

  const theme = appearance.theme;
  const userName = profile?.identity?.fullName || "Commander";
  const userLevel = progressionProfile?.xp?.currentLevel || 1;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClose = () => setMobileDrawerOpen(false);

  useEffect(() => {
    handleClose();
  }, [pathname]);

  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") handleClose();
      };
      window.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = "auto";
        window.removeEventListener("keydown", handleEscape);
      };
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMobileDrawerOpen]);

  const handleLogout = async () => {
    try {
      import("@/utils/haptics").then(({ vibrate }) => vibrate(10));
      resetStoresOnLogout();
      await AuthRepository.signOut();
      handleClose();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Remaining modules not in BottomNav (BottomNav has dashboard, training, ai, progress)
  // MODULE_CONFIG ids for these are typically 'mission-control', 'training', 'ai-command', 'progress'
  const excludedIds = ["mission-control", "training", "ai-command", "progress", "control-room"];
  const extraModules = MODULE_CONFIG.filter((m) => !excludedIds.includes(m.id));

  return (
    <>
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-[110] md:hidden flex items-end justify-center">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-base/60 backdrop-blur-sm"
              onClick={handleClose}
              aria-hidden="true"
            />

            {/* Bottom Sheet Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-h-[90vh] bg-bg-base rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border-t border-glass-border"
              role="dialog"
              aria-modal="true"
              aria-label="More Options"
            >
              {/* Drag Handle Area */}
              <div className="w-full flex justify-center pt-3 pb-1 shrink-0" onClick={handleClose}>
                <div className="w-12 h-1.5 rounded-full bg-border" />
              </div>

              {/* Header Area / Profile Summary */}
              <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0 bg-bg-surface-elevated">
                <Link 
                  href="/settings" 
                  onClick={() => {
                    import("@/utils/haptics").then(({ vibrate }) => vibrate(10));
                    handleClose();
                  }}
                  className="flex items-center gap-4 flex-1 overflow-hidden"
                >
                  <Avatar size="md" fallback={userName.charAt(0)} />
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-bold text-base tracking-tight truncate text-primary">{userName}</span>
                    <span className="text-xs font-semibold text-text-secondary truncate mt-0.5">
                      Level {userLevel} Commander
                    </span>
                  </div>
                </Link>
                <button 
                  onClick={handleClose}
                  className="p-2 ml-4 text-text-secondary hover:text-primary transition-colors rounded-lg bg-bg-base border border-border"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-6 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                
                {/* Theme & Notifications */}
                <div className="bg-bg-surface-elevated rounded-2xl border border-border overflow-hidden">
                  <div className="p-3 border-b border-border flex items-center justify-between">
                    <span className="text-sm font-semibold text-text-primary pl-1">Appearance</span>
                    <div className="flex bg-bg-base rounded-lg p-1 border border-border">
                      <button
                        onClick={() => {
                          import("@/utils/haptics").then(({ vibrate }) => vibrate(10));
                          updateAppearance({ theme: "light" });
                        }}
                        className={`p-1.5 rounded-md transition-colors ${theme === "light" ? "bg-surface text-primary shadow-sm" : "text-text-secondary"}`}
                      >
                        <Sun size={16} />
                      </button>
                      <button
                        onClick={() => {
                          import("@/utils/haptics").then(({ vibrate }) => vibrate(10));
                          updateAppearance({ theme: "dark" });
                        }}
                        className={`p-1.5 rounded-md transition-colors ${theme === "dark" ? "bg-surface text-primary shadow-sm" : "text-text-secondary"}`}
                      >
                        <Moon size={16} />
                      </button>
                      <button
                        onClick={() => {
                          import("@/utils/haptics").then(({ vibrate }) => vibrate(10));
                          updateAppearance({ theme: "system" });
                        }}
                        className={`p-1.5 rounded-md transition-colors ${theme === "system" ? "bg-surface text-primary shadow-sm" : "text-text-secondary"}`}
                      >
                        <Monitor size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      import("@/utils/haptics").then(({ vibrate }) => vibrate(10));
                      setIsNotifSheetOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-4 hover:bg-bg-base transition-colors"
                  >
                    <div className="flex items-center gap-3 text-text-primary">
                      <Bell size={18} className="text-text-secondary" />
                      <span className="text-sm font-semibold">Notifications</span>
                    </div>
                    {unreadCount > 0 && (
                      <div className="px-2 py-0.5 bg-[var(--color-accent-blue)] text-white text-[10px] font-bold rounded-full">
                        {unreadCount}
                      </div>
                    )}
                  </button>
                </div>

                {/* Additional Features (Intelligence, Nutrition, etc.) */}
                {extraModules.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="px-3 text-[10px] font-semibold tracking-widest uppercase text-text-disabled">
                      Modules
                    </h3>
                    <div className="bg-bg-surface-elevated rounded-2xl border border-border overflow-hidden divide-y divide-border">
                      {extraModules.map((module) => (
                        <Link
                          key={module.id}
                          href={module.route}
                          onClick={() => {
                            import("@/utils/haptics").then(({ vibrate }) => vibrate(10));
                            handleClose();
                          }}
                          className="flex items-center gap-3 p-4 hover:bg-bg-base transition-colors text-text-primary"
                        >
                          <module.icon size={18} style={{ color: module.accentColor }} />
                          <span className="text-sm font-semibold">{module.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Settings Links */}
                <div className="space-y-2">
                  <h3 className="px-3 text-[10px] font-semibold tracking-widest uppercase text-text-disabled">
                    Preferences
                  </h3>
                  <div className="bg-bg-surface-elevated rounded-2xl border border-border overflow-hidden divide-y divide-border">
                    <Link href="/settings" onClick={handleClose} className="flex items-center gap-3 p-4 hover:bg-bg-base transition-colors text-text-primary">
                      <Settings size={18} className="text-text-secondary" />
                      <span className="text-sm font-semibold">General Settings</span>
                    </Link>
                    <Link href="/settings/notifications" onClick={handleClose} className="flex items-center gap-3 p-4 hover:bg-bg-base transition-colors text-text-primary">
                      <Target size={18} className="text-text-secondary" />
                      <span className="text-sm font-semibold">Notification Preferences</span>
                    </Link>
                    <Link href="/settings" onClick={handleClose} className="flex items-center gap-3 p-4 hover:bg-bg-base transition-colors text-text-primary">
                      <Shield size={18} className="text-text-secondary" />
                      <span className="text-sm font-semibold">Privacy & About</span>
                    </Link>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="space-y-2">
                  <h3 className="px-3 text-[10px] font-semibold tracking-widest uppercase text-text-disabled">
                    Account
                  </h3>
                  <div className="bg-bg-surface-elevated rounded-2xl border border-border overflow-hidden divide-y divide-border">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-4 hover:bg-danger/10 transition-colors text-[var(--color-danger)]"
                    >
                      <LogOut size={18} />
                      <span className="text-sm font-semibold">Logout</span>
                    </button>
                    <button
                      onClick={() => {
                        import("@/utils/haptics").then(({ vibrate }) => vibrate(20));
                        // Future delete account feature
                      }}
                      className="w-full flex items-center gap-3 p-4 hover:bg-danger/10 transition-colors text-[var(--color-danger)] opacity-80"
                    >
                      <Trash2 size={18} />
                      <span className="text-sm font-semibold">Delete Account</span>
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <MobileNotificationSheet 
        isOpen={isNotifSheetOpen} 
        onClose={() => setIsNotifSheetOpen(false)} 
      />
    </>
  );
}
