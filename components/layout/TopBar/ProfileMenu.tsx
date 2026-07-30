"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/stores/user.store";
import { AuthRepository } from "@/services/repositories/auth.repository";
import { resetStoresOnLogout } from "@/lib/auth/reset-stores";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/adl/primitives/Avatar";
import { Caption } from "@/components/adl/typography";
import { Settings, LogOut, User, Trophy, Shield, Bell } from "lucide-react";
import Link from "next/link";

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileMenu({ isOpen, onClose }: ProfileMenuProps) {
  const { profile } = useUserStore();
  const router = useRouter();
  
  const userName = profile?.identity?.fullName || "Commander";
  const userLevel = 11; // Derived from XP in future

  const handleLogout = async () => {
    try {
      resetStoresOnLogout();
      await AuthRepository.signOut();
      onClose();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[72px] right-4 z-50 w-72 bg-[var(--color-bg-surface)] border border-[var(--color-glass-border)] rounded-[var(--radius-xl)] shadow-2xl overflow-hidden backdrop-blur-xl origin-top-right"
          >
            {/* Header */}
            <div className="p-4 border-b border-[var(--color-glass-border)] bg-gradient-to-br from-[var(--color-bg-glass-standard)] to-[var(--color-bg-base)]">
              <div className="flex items-center gap-3">
                <Avatar size="md" fallback={userName.charAt(0)} />
                <div>
                  <div className="font-bold text-sm tracking-tight">{userName}</div>
                  <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">commander@ascend.ai</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-px bg-[var(--color-glass-border)] border-b border-[var(--color-glass-border)]">
              <div className="bg-[var(--color-bg-base)] p-3 text-center">
                <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider font-semibold mb-1">Level</Caption>
                <div className="text-lg font-bold text-[var(--color-accent-blue)]">{userLevel}</div>
              </div>
              <div className="bg-[var(--color-bg-base)] p-3 text-center">
                <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider font-semibold mb-1">XP</Caption>
                <div className="text-lg font-bold text-[var(--color-text-secondary)]">1,420</div>
              </div>
            </div>

            {/* Links */}
            <div className="p-2 space-y-1">
              <Link href="/settings" onClick={onClose} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-surface-hover)] transition-colors group">
                <User size={16} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-blue)] transition-colors" />
                Profile & Goals
              </Link>
              <Link href="/progress" onClick={onClose} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-surface-hover)] transition-colors group">
                <Trophy size={16} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-orange)] transition-colors" />
                Achievements
              </Link>
              <Link href="/settings/notifications" onClick={onClose} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-surface-hover)] transition-colors group">
                <Bell size={16} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-purple)] transition-colors" />
                Notifications & Reminders
              </Link>
              <Link href="/settings" onClick={onClose} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-surface-hover)] transition-colors group">
                <Settings size={16} className="text-[var(--color-text-muted)] group-hover:text-white transition-colors" />
                System Settings
              </Link>
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-[var(--color-glass-border)] bg-[var(--color-bg-base)]">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-colors"
              >
                <LogOut size={16} />
                Disconnect Session
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
