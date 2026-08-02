"use client";

import React, { useEffect } from "react";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Activity, Zap, CheckCircle, AlertTriangle, ShieldCheck, Info } from "lucide-react";
import { useRecoveryStore } from "@/stores/recovery.store";

export default function RecoveryDashboardPage() {
  const { currentProfile, explanation, muscleRecovery, fetchRecovery, isLoading } = useRecoveryStore();

  useEffect(() => {
    fetchRecovery();
  }, [fetchRecovery]);

  if (isLoading) {
    return <div className="flex h-full items-center justify-center p-8"><span className="text-primary">Analyzing recovery data...</span></div>;
  }

  const score = currentProfile?.score || 0;
  const confidence = currentProfile?.confidence || 0;

  const isZeroState = !currentProfile || (explanation && explanation.length === 0);

  if (isZeroState) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 px-4 pt-4 pb-20 sm:px-6 lg:px-8">
        <div>
          <Heading level="h2">Recovery Intelligence</Heading>
          <BodyText className="text-[var(--color-text-muted)]">Adaptive planning & fatigue analysis.</BodyText>
        </div>

        <GlassCard className="p-8 mt-12 text-center bg-gradient-to-br from-surface to-base border-accent-blue/20">
          <div className="w-16 h-16 rounded-full bg-accent-blue/10 mx-auto flex items-center justify-center mb-6">
            <Zap className="text-accent-blue" size={32} />
          </div>
          <Heading level="h2" className="text-2xl mb-4">What affects recovery?</Heading>
          <BodyText className="text-secondary max-w-lg mx-auto mb-8">
            Ascend AI calculates your readiness based on Sleep, Hydration, Nutrition, and Training Volume. Log your first sleep, hydration, and workout to calculate your readiness score.
          </BodyText>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-accent-blue text-text-primary font-bold rounded-lg hover:bg-accent-blue-light transition">
              Log Hydration
            </button>
            <button className="px-6 py-3 bg-surface border border-border-subtle font-bold rounded-lg hover:bg-surface-elevated transition">
              Start Workout
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4 pt-4 pb-20 sm:px-6 lg:px-8">
      <div>
        <Heading level="h2">Recovery Intelligence</Heading>
        <BodyText className="text-[var(--color-text-muted)]">Adaptive planning & fatigue analysis.</BodyText>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Recovery Score */}
          <div className="space-y-4">
            <Heading level="h4" className="text-secondary uppercase tracking-wider text-xs font-bold">Today's Readiness</Heading>
            
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
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-primary">{score}</span>
                  <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">{currentProfile?.state || 'Unknown'}</span>
                </div>
              </div>

              <div className="mt-4 w-full bg-surface p-3 rounded-lg border border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-[var(--color-accent-blue)]" size={16} />
                  <Caption className="font-bold text-primary">Confidence</Caption>
                </div>
                <Caption className={confidence >= 80 ? "text-[var(--color-success)] font-bold" : "text-[var(--color-accent-orange)] font-bold"}>
                  {confidence}%
                </Caption>
              </div>
            </GlassCard>
          </div>

          {/* Muscle Recovery Map */}
          {muscleRecovery && (
            <div className="space-y-4">
              <Heading level="h4" className="text-secondary uppercase tracking-wider text-xs font-bold">Muscle Recovery Map</Heading>
              <GlassCard className="p-5 space-y-4">
                {[
                  { name: "Chest", val: muscleRecovery.chest },
                  { name: "Back", val: muscleRecovery.back },
                  { name: "Legs", val: muscleRecovery.legs },
                  { name: "Shoulders", val: muscleRecovery.shoulders },
                  { name: "Arms", val: muscleRecovery.arms }
                ].map(m => (
                  <div key={m.name} className="flex flex-col gap-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-primary font-medium">{m.name}</span>
                      <span className={m.val < 50 ? "text-error" : m.val < 80 ? "text-accent-orange" : "text-success"}>{m.val}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${m.val < 50 ? "bg-error" : m.val < 80 ? "bg-accent-orange" : "bg-success"}`} 
                        style={{ width: `${m.val}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </GlassCard>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Explanation */}
          <div className="space-y-4">
            <Heading level="h4" className="text-secondary uppercase tracking-wider text-xs font-bold">Recovery Analysis</Heading>
            <GlassCard className="p-6 border border-border-subtle">
              <ul className="space-y-4">
                {explanation?.map((exp, i) => (
                  <li key={i} className="flex items-start gap-3">
                    {exp.impact === 'positive' && <CheckCircle className="text-success shrink-0 mt-0.5" size={18} />}
                    {exp.impact === 'negative' && <AlertTriangle className="text-error shrink-0 mt-0.5" size={18} />}
                    {exp.impact === 'neutral' && <Info className="text-accent-blue shrink-0 mt-0.5" size={18} />}
                    <div>
                      <Heading level="h5" className="text-sm">{exp.factor}</Heading>
                      <BodyText className="text-secondary text-sm mt-0.5">{exp.text}</BodyText>
                    </div>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>

          {/* Adaptive Plan / Recommendations */}
          <div className="space-y-4">
            <Heading level="h4" className="text-secondary uppercase tracking-wider text-xs font-bold">AI Adaptive Recommendation</Heading>
            
            {currentProfile?.recommendations?.map((rec, i) => (
               <GlassCard key={i} className={`p-6 border ${rec.priority === 'CRITICAL' ? 'border-error/30' : rec.priority === 'HIGH' ? 'border-accent-orange/30' : 'border-border-subtle'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${rec.priority === 'CRITICAL' ? 'bg-error/20 text-error' : rec.priority === 'HIGH' ? 'bg-accent-orange/20 text-accent-orange' : 'bg-surface text-primary'}`}>
                      <AlertTriangle size={24} />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Heading level="h3" className="text-primary">{rec.title}</Heading>
                        <BodyText className="text-secondary">{rec.description}</BodyText>
                      </div>

                      <div className="mt-4 bg-base/50 rounded-lg p-4">
                        <Caption className="font-bold text-[var(--color-text-muted)] mb-2 uppercase">Why?</Caption>
                        <ul className="space-y-2">
                          {rec.reason.map((r, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-secondary">
                              <CheckCircle size={14} className="text-[var(--color-success)] shrink-0 mt-0.5" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border-subtle flex flex-wrap gap-2">
                         <Caption className="w-full font-bold text-primary mb-1">Smart Actions</Caption>
                         <button className="px-4 py-2 bg-[var(--color-accent-blue)]/20 text-blue-100 rounded-md border border-[var(--color-accent-blue)]/50 text-sm hover:bg-[var(--color-accent-blue)]/40 transition">
                           Accept Plan
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
                      <Heading level="h3" className="text-primary">Cleared for Training</Heading>
                      <BodyText className="text-secondary">Your recovery is strong. Proceed with today's scheduled workout.</BodyText>
                    </div>
                  </div>
               </GlassCard>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
