"use client";

import type { ReactNode } from "react";
import type { Metadata } from "next";
import { useEffect } from "react";
import { CoachPresence } from "@/components/coach/CoachPresence";
import { useCoachCore } from "@/lib/coach/CoachCore";

/**
 * Onboarding Layout
 *
 * Deliberately minimal. No AppShell, no Sidebar, no TopBar.
 * The onboarding experience is self-contained and immersive.
 *
 * The CoachPresence lives here — above all screen content, persistent.
 * It never unmounts between steps. Only the screen content below changes.
 *
 * Layout structure:
 * ┌──────────────────────────────────────────┐
 * │  CoachPresence (orb + bubble + panel)    │ ← persistent, never unmounts
 * │         ●  "Nice to meet you."           │
 * │         [Understanding you... ██████]    │
 * ├──────────────────────────────────────────┤
 * │  {children} — screen content scrolls    │ ← step content
 * └──────────────────────────────────────────┘
 */

function OnboardingCoachInitializer() {
  const { show, event, _scheduleMicroLife } = useCoachCore();

  useEffect(() => {
    // Show the coach when entering onboarding
    show();
    event({ type: "context_changed", context: "onboarding", step: 0 });
    // Start micro-life cycle
    _scheduleMicroLife();

    return () => {
      // Coach stays in memory when leaving onboarding (brain persists)
      // Visual presence is hidden by the coach's own isVisible state
    };
   
  }, []);

  return null;
}

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100svh] bg-[var(--color-bg-base)] flex flex-col">
      {/* Coach initializer — sets context and starts micro-life */}
      <OnboardingCoachInitializer />

      {/* Persistent Coach Presence — orb + bubble + understanding panel */}
      <div className="sticky top-0 z-20 bg-[var(--color-bg-base)]/95 backdrop-blur-sm pt-2 pb-3 px-4">
        <CoachPresence
          showUnderstandingPanel
          paddingTop={0}
        />
      </div>

      {/* Screen content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
