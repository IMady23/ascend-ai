"use client";

import React, { useEffect, useState } from "react";
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
  const pathname = usePathname();

  // Filter out primary nav items that are already in BottomNav
  const groups = MODULE_CONFIG.reduce((acc, module) => {
    if (["dashboard", "training", "ai", "progress"].includes(module.id)) {
      return acc;
    }
    if (!acc[module.navigationGroup]) {
      acc[module.navigationGroup] = [];
    }
    acc[module.navigationGroup].push(module);
    return acc;
  }, {} as Record<string, typeof MODULE_CONFIG>);

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

  return (
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
            className="relative w-full max-h-[85vh] bg-bg-base rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border-t border-glass-border"
            role="dialog"
            aria-modal="true"
            aria-label="More Options"
          >
            {/* Drag Handle Area */}
            <div className="w-full flex justify-center pt-3 pb-1 shrink-0" onClick={handleClose}>
              <div className="w-12 h-1.5 rounded-full bg-border" />
            </div>

            {/* Header Area */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-blue,var(--color-info))] flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-primary font-bold tracking-tight">AI</span>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-bold text-sm tracking-tight truncate text-primary">Ascend AI</span>
                  <span className="text-xs font-semibold text-text-secondary truncate mt-1">
                    {profile?.identity?.fullName || 'User'}
                  </span>
                </div>
              </div>
              <button 
                onClick={handleClose}
                className="p-2 -mr-2 text-text-secondary hover:text-primary transition-colors rounded-lg bg-bg-surface-elevated border border-border"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Groups */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-6 pb-[env(safe-area-inset-bottom)]">
              {Object.entries(groups).map(([groupName, modules]) => (
                <div key={groupName} className="flex flex-col gap-1">
                  <h3 className="px-3 mb-1 text-[10px] font-semibold tracking-widest uppercase text-text-disabled">
                    {groupName}
                  </h3>
                  {modules.map((module) => (
                    <SidebarItem 
                      key={module.id}
                      {...module}
                      isSidebarOpen={true}
                    />
                  ))}
                </div>
              ))}
              
              <div 
                className="mt-6 mx-2 p-4 rounded-xl bg-bg-surface-elevated border border-border flex items-center gap-3 cursor-pointer"
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
                <CloudLightning size={20} className="text-success shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-text-primary">Sync Active</span>
                  <span className="text-xs text-text-secondary">All data backed up</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
