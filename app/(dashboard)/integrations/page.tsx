"use client";

import React, { useState } from "react";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Activity, Apple, Watch, RefreshCw, CheckCircle, Database } from "lucide-react";

export default function IntegrationsPage() {
  const [isSyncing, setIsSyncing] = useState(false);

  const simulateSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 pt-4 pb-20 sm:px-6 lg:px-8">
      <div>
        <Heading level="h2">Connected Health</Heading>
        <BodyText className="text-[var(--color-text-muted)]">Manage external devices and platforms.</BodyText>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Apple Health (Mock) */}
        <GlassCard className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Apple size={24} className="text-white" />
              </div>
              <div>
                <Heading level="h4">Apple Health</Heading>
                <Caption className="text-[var(--color-success)] flex items-center gap-1">
                  <CheckCircle size={12} /> Connected
                </Caption>
              </div>
            </div>
            <button className="text-xs text-[var(--color-text-secondary)] hover:text-white underline">Disconnect</button>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--color-text-secondary)]">Last Synced</span>
              <span className="text-white">Just now</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--color-text-secondary)]">Imported</span>
              <span className="text-white">HRV, Sleep, Steps</span>
            </div>
          </div>

          <button 
            onClick={simulateSync}
            disabled={isSyncing}
            className="w-full mt-6 bg-white/5 hover:bg-white/10 text-white rounded-lg py-2 flex items-center justify-center gap-2 transition"
          >
            <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
            {isSyncing ? "Syncing..." : "Sync Now"}
          </button>
        </GlassCard>

        {/* Garmin (Mock) */}
        <GlassCard className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-[var(--color-glass-border)]">
                <Watch size={24} className="text-[var(--color-text-muted)]" />
              </div>
              <div>
                <Heading level="h4" className="text-[var(--color-text-muted)]">Garmin Connect</Heading>
                <Caption className="text-[var(--color-text-secondary)]">Not Connected</Caption>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <BodyText className="text-sm text-[var(--color-text-secondary)]">
              Connect your Garmin device to automatically import workouts, heart rate, and training readiness data.
            </BodyText>
          </div>

          <button className="w-full mt-6 bg-[var(--color-accent-blue)]/20 hover:bg-[var(--color-accent-blue)]/30 text-blue-100 border border-[var(--color-accent-blue)]/50 rounded-lg py-2 transition">
            Connect
          </button>
        </GlassCard>

      </div>

      <GlassCard className="p-6 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-[var(--color-accent-indigo)]/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[var(--color-accent-indigo)]/20 rounded-full flex items-center justify-center">
            <Database size={24} className="text-[var(--color-accent-indigo)]" />
          </div>
          <div>
            <Heading level="h4">Data Permissions</Heading>
            <BodyText className="text-sm text-[var(--color-text-secondary)]">Manage what data Ascend AI is allowed to read and analyze.</BodyText>
          </div>
        </div>
        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md text-sm transition">
          Manage Access
        </button>
      </GlassCard>

    </div>
  );
}
