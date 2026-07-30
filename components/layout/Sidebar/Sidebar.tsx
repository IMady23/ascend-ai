"use client";

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
      animate={isSidebarOpen ? "expanded" : "collapsed"}
      variants={NavigationMotion.sidebarCollapse}
      className="hidden md:flex flex-col h-[calc(100vh-32px)] my-4 ml-4 mr-0 rounded-[var(--radius-xl)] bg-[var(--color-bg-glass-standard)] backdrop-blur-xl border border-[var(--color-glass-border)] shrink-0 sticky top-4 z-50 shadow-[var(--shadow-xl)] glass-highlight overflow-hidden"
    >
      {/* Header Area */}
      <div className="p-4 border-b border-[var(--color-glass-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-[var(--color-accent-blue)] flex items-center justify-center shrink-0 shadow-sm">
            <span className="font-bold text-white tracking-tighter">A</span>
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-sm tracking-tight truncate group-hover:text-purple-400 transition-colors">{profile?.identity?.fullName || 'Commander'}</span>
              <span className="text-xs text-[var(--color-text-secondary)] truncate">
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
            {isSidebarOpen && (
              <h3 className="px-3 mb-1 text-[10px] font-semibold tracking-widest uppercase text-[var(--color-text-muted)]">
                {groupName}
              </h3>
            )}
            {modules.map((module) => (
              <SidebarItem 
                key={module.id}
                {...module}
                isSidebarOpen={isSidebarOpen}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Footer Area */}
      <div 
        className="p-3 border-t border-[var(--color-glass-border)] cursor-pointer"
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
        <div className={cn(
          "flex items-center rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] px-3 h-10 border border-[var(--color-glass-border)] hover:bg-[var(--color-bg-glass-hover)] transition-colors",
          !isSidebarOpen && "justify-center"
        )}>
          <CloudLightning size={16} className="text-[var(--color-success)] shrink-0" />
          {isSidebarOpen && (
            <span className="ml-3 text-xs font-medium text-[var(--color-text-secondary)]">
              Sync Active
            </span>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => toggleSidebar()}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[var(--color-bg-surface)] border border-[var(--color-glass-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-glass-hover)] shadow-sm z-50 transition-colors"
      >
        {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>
    </motion.aside>
  );
}
