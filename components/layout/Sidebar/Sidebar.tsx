"use client";

import React, { useEffect, useState } from "react";
import { useUiStore } from "@/stores/ui.store";
import { useUserStore } from "@/stores/user.store";
import { useChapterStore } from "@/stores/chapter.store";
import { MODULE_CONFIG } from "@/constants/modules.config";
import { SidebarItem } from "./SidebarItem";
import { motion } from "framer-motion";
import { NavigationMotion } from "@/utils/motion";
import { ChevronLeft, ChevronRight, CloudLightning } from "lucide-react";
import { cn } from "@/utils/cn";

export function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useUiStore();
  const { profile } = useUserStore();
  const { currentChapter } = useChapterStore();
  const [isDesktop, setIsDesktop] = useState(true);

  // Handle responsive behavior: Permanent on Desktop (lg), Collapsible on Tablet (md)
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const effectivelyOpen = isDesktop ? true : isSidebarOpen;

  // Group modules dynamically
  const groups = MODULE_CONFIG.reduce((acc, module) => {
    if (!acc[module.navigationGroup]) {
      acc[module.navigationGroup] = [];
    }
    acc[module.navigationGroup].push(module);
    return acc;
  }, {} as Record<string, typeof MODULE_CONFIG>);

  return (
    <motion.aside
      initial={false}
      animate={effectivelyOpen ? "expanded" : "collapsed"}
      variants={NavigationMotion.sidebarCollapse}
      className="hidden md:flex flex-col h-[calc(100vh-32px)] my-4 ml-4 mr-0 rounded-2xl glass-panel shrink-0 sticky top-4 z-50 overflow-hidden"
    >
      {/* Header Area */}
      <div className="p-4 border-b border-border-subtle">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-info/20 flex items-center justify-center shrink-0 shadow-sm">
            <span className="font-bold text-info tracking-tighter">AI</span>
          </div>
          {effectivelyOpen && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-sm tracking-tight truncate group-hover:text-accent-workout transition-colors text-text-primary">
                {profile?.identity?.fullName || 'User'}
              </span>
              <span className="text-xs text-text-secondary truncate">
                {currentChapter ? `${currentChapter.title} • ${Math.round((currentChapter.tasksCompleted / (currentChapter.totalTasks || 1)) * 100)}%` : "Chapter 1 • 0%"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-3 py-4 space-y-6">
        {Object.entries(groups).map(([groupName, modules]) => (
          <div key={groupName} className="flex flex-col gap-1">
            {effectivelyOpen && (
              <h3 className="px-3 mb-1 text-[10px] font-semibold tracking-widest uppercase text-text-disabled">
                {groupName}
              </h3>
            )}
            {modules.map((module) => (
              <SidebarItem 
                key={module.id}
                {...module}
                isSidebarOpen={effectivelyOpen}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Footer Area */}
      <button 
        className="w-full p-4 border-t border-border-subtle cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-info"
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
        aria-label="Sync Active"
      >
        <div className={cn(
          "flex items-center rounded-md bg-surface px-3 h-10 border border-border-subtle hover:bg-surface-elevated transition-colors",
          !effectivelyOpen && "justify-center px-0 w-10 mx-auto"
        )}>
          <CloudLightning size={16} className="text-success shrink-0" />
          {effectivelyOpen && (
            <span className="ml-3 text-xs font-medium text-text-secondary">
              Sync Active
            </span>
          )}
        </div>
      </button>

      {/* Toggle Button (Hidden on Desktop) */}
      {!isDesktop && (
        <button
          onClick={() => toggleSidebar()}
          aria-label="Toggle Sidebar"
          aria-expanded={effectivelyOpen}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-surface-elevated border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface transition-colors z-50 shadow-sm"
        >
          {effectivelyOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      )}
    </motion.aside>
  );
}
