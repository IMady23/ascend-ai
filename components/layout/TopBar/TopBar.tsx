"use client";

import React, { useRef } from "react";
import { useUserStore } from "@/stores/user.store";
import { useUiStore } from "@/stores/ui.store";
import { Avatar } from "@/components/adl/primitives/Avatar";
import { ProfileMenu } from "./ProfileMenu";
import { NotificationCenter } from "./NotificationCenter";
import { Bell, Command, Menu, Sparkles, Clock, Sun, Moon, Monitor } from "lucide-react";
import { AICoachDrawer } from "@/features/ai/components/AICoachDrawer";
import { ReminderScheduleModal } from "@/components/adl/composites/settings/ReminderScheduleModal";
import { useThemeStore } from "@/stores/theme.store";

export function TopBar() {
  const { profile } = useUserStore();
  const userName = profile?.identity?.fullName || "Commander";
  
  const { setMobileDrawerOpen } = useUiStore();
  const { theme, toggleTheme } = useThemeStore();

  const [isCommandOpen, setIsCommandOpen] = React.useState(false);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const [isReminderOpen, setIsReminderOpen] = React.useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  
  const notifRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[var(--color-bg-base)]/80 backdrop-blur-xl border-b border-[var(--color-glass-border)] pt-[env(safe-area-inset-top)]">
        <div className="flex items-center justify-between px-4 h-16 max-w-7xl mx-auto">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 md:hidden text-[var(--color-text-secondary)] hover:text-white transition-colors"
              aria-label="Open Mobile Menu"
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-4 relative">
            {/* Command Palette Trigger */}
            <button 
              onClick={() => setIsCommandOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-surface-hover)] border border-[var(--color-glass-border)] rounded-lg text-sm text-[var(--color-text-muted)] transition-colors group"
            >
              <Sparkles size={14} className="group-hover:text-[var(--color-accent-blue)] transition-colors" />
              <span className="group-hover:text-white transition-colors">Ask Ascend</span>
              <kbd className="ml-8 hidden lg:inline-flex px-1.5 py-0.5 text-[10px] bg-[var(--color-bg-base)] border border-[var(--color-glass-border)] rounded shadow-sm text-[var(--color-text-secondary)] font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Search Button */}
            <button 
              onClick={() => setIsCommandOpen(true)}
              className="p-2 md:hidden text-[var(--color-text-secondary)] hover:text-white transition-colors"
              aria-label="Open Ask Ascend"
            >
              <Command size={18} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-[var(--color-text-secondary)] hover:text-white transition-colors"
              title={`Current Theme: ${theme}`}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Moon size={18} /> : theme === "light" ? <Sun size={18} /> : <Monitor size={18} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                ref={notifRef}
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 text-[var(--color-text-secondary)] hover:text-white transition-colors hidden sm:block"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-accent-blue)] rounded-full border border-[var(--color-bg-base)]" />
              </button>
              <NotificationCenter 
                isOpen={isNotifOpen} 
                onClose={() => setIsNotifOpen(false)} 
                anchorRef={notifRef} 
              />
            </div>

            {/* Reminders Schedule */}
            <button 
              onClick={() => setIsReminderOpen(true)}
              className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-blue)] transition-colors"
              title="Manage Reminders"
              aria-label="Manage Reminders"
            >
              <Clock size={18} />
            </button>

            <div className="w-px h-6 bg-[var(--color-glass-border)] mx-1" />

            {/* Profile Dropdown */}
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-3 hover:bg-[var(--color-bg-surface-hover)] p-1.5 rounded-full md:rounded-xl transition-colors md:pr-4"
              aria-label="Profile Menu"
            >
              <Avatar fallback={userName.charAt(0)} />
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold tracking-tight leading-none text-white">{userName}</span>
                <span className="text-[10px] text-[var(--color-text-muted)] font-medium mt-1">Level 11 Commander</span>
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
