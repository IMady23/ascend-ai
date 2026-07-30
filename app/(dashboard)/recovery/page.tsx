"use client";

import React, { useEffect } from "react";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Activity, Zap, CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { useRecoveryStore } from "@/stores/recovery.store";

export default function RecoveryDashboardPage() {
  const { currentProfile, fetchRecovery, isLoading } = useRecoveryStore();

  useEffect(() => {
    fetchRecovery();
  }, [fetchRecovery]);

  if (isLoading) {
    return <div className="flex h-full items-center justify-center p-8"><span className="text-white">Analyzing recovery data...</span></div>;
  }

  const score = currentProfile?.score || 0;
  const confidence = currentProfile?.confidence || 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 px-4 pt-4 pb-20 sm:px-6 lg:px-8">
      <div>
        <Heading level="h2">Recovery Intelligence</Heading>
        <BodyText className="text-[var(--color-text-muted)]">Adaptive planning & fatigue analysis.</BodyText>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Recovery Score */}
        <div className="space-y-4">
          <Heading level="h4" className="text-[var(--color-text-secondary)] uppercase tracking-wider text-xs font-bold">Today's Readiness</Heading>
          
          <GlassCard className="p-6 flex flex-col items-center justify-center min-h-[220px]">
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="var(--color-bg-surface)" strokeWidth="12" fill="none" />
                <circle
                  cx="64" cy="64" r="56"
                  stroke={score >= 80 ? "var(--color-success)" : score >= 50 ? "var(--color-accent-orange)" : "var(--color-error)"}
                  strokeWidth="12" fill="none"
                  strokeDasharray="351.8"
                  strokeDashoffset={351.8 - (351.8 * score) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{score}</span>
                <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">{currentProfile?.state || 'Unknown'}</span>
              </div>
            </div>

            <div className="mt-4 w-full bg-[var(--color-bg-surface)] p-3 rounded-lg border border-[var(--color-glass-border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-[var(--color-accent-blue)]" size={16} />
                <Caption className="font-bold text-white">Confidence</Caption>
              </div>
              <Caption className={confidence >= 80 ? "text-[var(--color-success)] font-bold" : "text-[var(--color-accent-orange)] font-bold"}>
                {confidence}%
              </Caption>
            </div>
          </GlassCard>
        </div>

        {/* Adaptive Plan / Recommendations */}
        <div className="md:col-span-2 space-y-4">
          <Heading level="h4" className="text-[var(--color-text-secondary)] uppercase tracking-wider text-xs font-bold">AI Adaptive Recommendation</Heading>
          
          {currentProfile?.recommendations?.map((rec, i) => (
             <GlassCard key={i} className="p-6 border border-[var(--color-error)]/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-error)]/20 flex items-center justify-center shrink-0">
                    <AlertTriangle className="text-[var(--color-error)]" size={24} />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Heading level="h3" className="text-white">{rec.title}</Heading>
                      <BodyText className="text-[var(--color-text-secondary)]">{rec.description}</BodyText>
                    </div>

                    <div className="mt-4 bg-[var(--color-bg-base)]/50 rounded-lg p-4">
                      <Caption className="font-bold text-[var(--color-text-muted)] mb-2 uppercase">Why?</Caption>
                      <ul className="space-y-2">
                        {rec.reason.map((r, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                            <CheckCircle size={14} className="text-[var(--color-success)] shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[var(--color-glass-border)] flex flex-wrap gap-2">
                       <Caption className="w-full font-bold text-white mb-1">Smart Alternatives</Caption>
                       <button className="px-4 py-2 bg-[var(--color-accent-blue)]/20 text-blue-100 rounded-md border border-[var(--color-accent-blue)]/50 text-sm hover:bg-[var(--color-accent-blue)]/40 transition">
                         Light Push
                       </button>
                       <button className="px-4 py-2 bg-[var(--color-accent-green)]/20 text-green-100 rounded-md border border-[var(--color-accent-green)]/50 text-sm hover:bg-[var(--color-accent-green)]/40 transition">
                         Mobility
                       </button>
                       <button className="px-4 py-2 bg-[var(--color-accent-orange)]/20 text-orange-100 rounded-md border border-[var(--color-accent-orange)]/50 text-sm hover:bg-[var(--color-accent-orange)]/40 transition">
                         Rest Day
                       </button>
                    </div>
                  </div>
                </div>
             </GlassCard>
          ))}
          
          {(!currentProfile?.recommendations || currentProfile.recommendations.length === 0) && (
             <GlassCard className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-success)]/20 flex items-center justify-center shrink-0">
                    <Activity className="text-[var(--color-success)]" size={24} />
                  </div>
                  <div>
                    <Heading level="h3" className="text-white">Cleared for Training</Heading>
                    <BodyText className="text-[var(--color-text-secondary)]">Your recovery is strong. Proceed with today's scheduled workout.</BodyText>
                  </div>
                </div>
             </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
