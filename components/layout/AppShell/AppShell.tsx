"use client";

import { ReactNode } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { TopBar } from "../TopBar/TopBar";
import { MobileDrawer } from "@/components/navigation/MobileDrawer";
import { BottomNav } from "@/components/navigation/BottomNav";
import { CelebrationSystem } from "@/components/adl/composites/feedback/CelebrationSystem";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[100dvh] w-full overflow-hidden text-primary">
      {/* 
        The Sidebar is now a floating glass pane that is structurally part of the layout 
        but styled to float above the ambient background on Desktop/Tablet.
      */}
      <Sidebar />
      <MobileDrawer />
      <BottomNav />
      
      {/* 
        The main content area takes the remaining width.
        We apply a max-width to ensure the application never stretches uncomfortably on ultra-wide monitors.
      */}
      <div className="flex-1 flex flex-col min-w-0 h-full max-w-[1600px] mx-auto relative md:pb-0 pb-16">
        <TopBar />
        <main 
          className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-6 overscroll-none"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {children}
        </main>
      </div>
      <CelebrationSystem />
    </div>
  );
}
