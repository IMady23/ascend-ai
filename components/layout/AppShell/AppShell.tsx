"use client";

import { ReactNode } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { TopBar } from "../TopBar/TopBar";
import { BottomNavigation } from "../BottomNavigation/BottomNavigation";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}
