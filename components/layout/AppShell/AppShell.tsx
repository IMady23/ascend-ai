"use client";

import { ReactNode } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { TopBar } from "../TopBar/TopBar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden text-[var(--color-text-primary)]">
      {/* 
        The Sidebar is now a floating glass pane that is structurally part of the layout 
        but styled to float above the ambient background.
      */}
      <Sidebar />
      
      {/* 
        The main content area takes the remaining width.
        We apply a max-width to ensure the application never stretches uncomfortably on ultra-wide monitors.
      */}
      <div className="flex-1 flex flex-col min-w-0 h-full max-w-[1600px] mx-auto relative">
        <TopBar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
