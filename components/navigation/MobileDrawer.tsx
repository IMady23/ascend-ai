"use client";

import React, { useEffect } from "react";
import { useUiStore } from "@/stores/ui.store";
import { useUserStore } from "@/stores/user.store";
import { useChapterStore } from "@/stores/chapter.store";
import { MODULE_CONFIG } from "@/constants/modules.config";
import { SidebarItem } from "../layout/Sidebar/SidebarItem";
import { motion, AnimatePresence } from "framer-motion";
import { X, CloudLightning } from "lucide-react";
import { usePathname } from "next/navigation";

export function MobileDrawer() {
  const { isMobileDrawerOpen, setMobileDrawerOpen } = useUiStore();
  const { profile } = useUserStore();
  const { currentChapter } = useChapterStore();
  const pathname = usePathname();

  // Group modules dynamically
  const groups = MODULE_CONFIG.reduce((acc, module) => {
    if (!acc[module.navigationGroup]) {
      acc[module.navigationGroup] = [];
    }
    acc[module.navigationGroup].push(module);
    return acc;
  }, {} as Record<string, typeof MODULE_CONFIG>);

  const handleClose = () => setMobileDrawerOpen(false);

  // Close on route change
  useEffect(() => {
    handleClose();
  }, [pathname]);

  // Lock body scroll and handle Escape key
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

  return (
    <AnimatePresence>
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-[100] md:hidden flex">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.08 }}
            className="relative w-[85%] max-w-sm h-full bg-[var(--color-bg-base)] border-r border-[var(--color-glass-border)] shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            {/* Header Area */}
            <div className="p-4 pt-[calc(1rem+env(safe-area-inset-top))] border-b border-[var(--color-glass-border)] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-[var(--color-accent-blue)] flex items-center justify-center shrink-0 shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 22h20L12 2z"/></svg>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-bold text-sm tracking-tight truncate text-white">Ascend AI</span>
                  <span className="text-xs font-semibold text-[var(--color-text-primary)] truncate mt-1">
                    {profile?.identity?.fullName || 'Madhav'}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-[var(--color-accent-blue)] font-bold truncate">
                    Premium Member
                  </span>
                </div>
              </div>
              <button 
                onClick={handleClose}
                className="p-2 -mr-2 text-[var(--color-text-secondary)] hover:text-white transition-colors rounded-lg"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Groups */}
            <motion.div 
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
                closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } }
              }}
              className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-3 py-4 space-y-6"
            >
              {Object.entries(groups).map(([groupName, modules]) => (
                <div key={groupName} className="flex flex-col gap-1">
                  <motion.h3 
                    variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: -10 } }}
                    className="px-3 mb-1 text-[10px] font-semibold tracking-widest uppercase text-[var(--color-text-muted)]"
                  >
                    {groupName}
                  </motion.h3>
                  {modules.map((module) => (
                    <motion.div key={module.id} variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: -10 } }}>
                      <SidebarItem 
                        {...module}
                        isSidebarOpen={true}
                      />
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>

            {/* Footer Area */}
            <div 
              className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t border-[var(--color-glass-border)] shrink-0"
              onClick={() => {
                import("@/stores/toast.store").then((m) => {
                  m.useToastStore.getState().addToast({
                    type: "info",
                    title: "Sync Active",
                    message: "Your devices are currently syncing with Ascend AI.",
                    duration: 3000,
                  });
                });
              }}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] px-3 h-11 border border-[var(--color-glass-border)] hover:bg-[var(--color-bg-glass-hover)] transition-colors cursor-pointer">
                <CloudLightning size={16} className="text-[var(--color-success)] shrink-0" />
                <span className="ml-3 text-sm font-medium text-[var(--color-text-secondary)]">
                  Sync Active
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
