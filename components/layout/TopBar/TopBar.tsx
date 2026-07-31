"use client";

import React, { useRef } from "react";
import { useUserStore } from "@/stores/user.store";
import { useProgressionStore } from "@/stores/progression.store";
import { useUiStore } from "@/stores/ui.store";
import { Avatar } from "@/components/adl/primitives/Avatar";
import { ProfileMenu } from "./ProfileMenu";
import { NotificationCenter } from "../NotificationCenter/NotificationCenter";
import { Bell, Command, Menu, Sparkles, Clock, Sun, Moon, Monitor, WifiOff } from "lucide-react";
import { AICoachDrawer } from "@/features/ai/components/AICoachDrawer";
import { ReminderScheduleModal } from "@/components/adl/composites/settings/ReminderScheduleModal";
import { useSettingsStore } from "@/stores/settings.store";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useReminderStore } from "@/stores/reminder.store";

export function TopBar() {
  const { profile } = useUserStore();
  const { profile: progressionProfile } = useProgressionStore();
  const userName = profile?.identity?.fullName || "Commander";
  
  const { setMobileDrawerOpen } = useUiStore();
  const { appearance, updateAppearance } = useSettingsStore();
  const theme = appearance.theme;
  const isOnline = useNetworkStatus();

  const [isCommandOpen, setIsCommandOpen] = React.useState(false);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const [isReminderOpen, setIsReminderOpen] = React.useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  
  const notifRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-base/80 backdrop-blur-xl border-b border-border-subtle pt-[env(safe-area-inset-top)]">
        <div className="flex items-center justify-between px-4 h-16 max-w-7xl mx-auto">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 md:hidden text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Open Mobile Menu"
            >
              <Menu size={20} />
            </button>

            {!isOnline && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-danger/10 border border-danger/20 rounded-full">
                <WifiOff size={12} className="text-danger" />
                <span className="text-[10px] font-semibold text-danger tracking-wide uppercase">Offline</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4 relative">
            {/* Command Palette Trigger */}
            <button 
              onClick={() => setIsCommandOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-surface hover:bg-surface-elevated border border-border-subtle rounded-lg text-sm text-text-secondary transition-colors group"
            >
              <Sparkles size={14} className="group-hover:text-info transition-colors" />
              <span className="group-hover:text-text-primary transition-colors">Ask Ascend</span>
              <kbd className="ml-8 hidden lg:inline-flex px-1.5 py-0.5 text-[10px] bg-base border border-border-subtle rounded shadow-sm text-text-secondary font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Search Button */}
            <button 
              onClick={() => setIsCommandOpen(true)}
              className="p-2 md:hidden text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Open Ask Ascend"
            >
              <Command size={18} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                const nextTheme = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
                updateAppearance({ theme: nextTheme });
              }}
              className="p-2 text-text-secondary hover:text-text-primary transition-colors"
              title={`Current Theme: ${theme}`}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Moon size={18} /> : theme === "light" ? <Sun size={18} /> : <Monitor size={18} />}
            </button>

            {/* Notifications */}
            <div className="relative flex items-center">
              <NotificationCenter />
            </div>

            {/* Reminders Schedule */}
            <button 
              onClick={() => setIsReminderOpen(true)}
              className="p-2 text-text-secondary hover:text-info transition-colors"
              title="Manage Reminders"
              aria-label="Manage Reminders"
            >
              <Clock size={18} />
            </button>

            <div className="w-px h-6 bg-border-subtle mx-1" />

            {/* Profile Dropdown */}
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-3 hover:bg-surface-elevated p-1.5 rounded-full md:rounded-xl transition-colors md:pr-4"
              aria-label="Profile Menu"
            >
              <Avatar fallback={userName.charAt(0)} />
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold tracking-tight leading-none text-text-primary">{userName}</span>
                <span className="text-[10px] text-text-secondary font-medium mt-1">Level {progressionProfile?.xp?.currentLevel || 1} Commander</span>
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* Profile Dropdown Menu */}
      <ProfileMenu 
        isOpen={isProfileMenuOpen} 
        onClose={() => setIsProfileMenuOpen(false)} 
      />

      {/* Global AI Coach Drawer */}
      <AICoachDrawer 
        isOpen={isCommandOpen} 
        onClose={() => setIsCommandOpen(false)} 
      />

      {/* Global Reminder Schedule Modal */}
      <ReminderScheduleModal 
        isOpen={isReminderOpen} 
        onClose={() => setIsReminderOpen(false)} 
      />
    </>
  );
}
