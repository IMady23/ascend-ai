"use client";

import { ReactNode, useEffect } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { TopBar } from "../TopBar/TopBar";
import { MobileDrawer } from "@/components/navigation/MobileDrawer";
import { BottomNav } from "@/components/navigation/BottomNav";
import { CelebrationSystem } from "@/components/adl/composites/feedback/CelebrationSystem";
import { useCoachCore } from "@/lib/coach/CoachCore";

/**
 * AppShell — Main application layout.
 *
 * The CoachCore brain is initialized here so it's available globally.
 * The coach UI (CoachPresence) is NOT rendered here — each feature
 * renders the coach differently:
 *   Onboarding: CoachPresence (orb + bubble) in onboarding layout
 *   Dashboard: coach briefing card (inline, no orb)
 *   AI Chat: conversation IS the coach (no orb)
 *   Nutrition: coach chip (inline, on demand)
 */
function CoachBrainInitializer() {
  const { event } = useCoachCore();

  useEffect(() => {
    // Signal that the main app shell is active
    // Coach defaults to sleeping state until a feature activates it
    event({ type: "context_changed", context: "dashboard" });
   
  }, []);

  return null;
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[100dvh] w-full overflow-hidden text-primary">
      {/* Coach brain — active globally, UI appears only where needed */}
      <CoachBrainInitializer />

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
