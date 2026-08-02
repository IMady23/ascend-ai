"use client";

import React, { useEffect, useState } from "react";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Activity, Zap, CheckCircle, AlertTriangle, ShieldCheck, Info, Moon, Brain, Coffee, Plus, TrendingUp, Clock } from "lucide-react";
import { useRecoveryStore } from "@/stores/recovery.store";
import { RecoveryLoggerSheet } from "@/components/recovery/RecoveryLoggerSheet";
import { RecoveryActivityType } from "@/types/recovery";

const ACTIVITY_META: Record<RecoveryActivityType, { label: string; icon: React.ReactNode; color: string }> = {
  sleep: { label: "Sleep / Nap", icon: <Moon size={14} />, color: "var(--color-accent-indigo)" },
  meditation: { label: "Meditation", icon: <Brain size={14} />, color: "var(--color-accent-ai, #06B6D4)" },
  active_recovery: { label: "Active Recovery", icon: <Activity size={14} />, color: "var(--color-success)" },
  rest: { label: "Idle Rest", icon: <Coffee size={14} />, color: "var(--color-accent-orange)" },
};

export default function RecoveryDashboardPage() {
  const { currentProfile, explanation, muscleRecovery, sessions, fetchRecovery, fetchRecoverySessions, isLoading } = useRecoveryStore();
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);

  useEffect(() => {
    fetchRecovery();
    fetchRecoverySessions();
  }, [fetchRecovery, fetchRecoverySessions]);

  const score = currentProfile?.score || 0;
  const confidence = currentProfile?.confidence || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-3 md:px-6 pt-4 pb-20">

      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Heading level="h2">Recovery Intelligence</Heading>
          <BodyText className="text-[var(--color-text-secondary)]">Adaptive planning & fatigue analysis.</BodyText>
        </div>
        <button
          onClick={() => setIsLoggerOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-success)] text-white rounded-xl font-semibold text-sm active:scale-95 transition-all shadow-md shrink-0"
        >
          <Plus size={16} /> Log Recovery
        </button>
      </div>

      {/* Recent Sessions Strip */}
      {sessions.length > 0 && (
        <div>
          <Caption className="uppercase tracking-widest text-[var(--color-text-secondary)] font-semibold text-xs mb-3 block">
            Recent Sessions
          </Caption>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sessions.slice(0, 6).map(session => {
              const meta = ACTIVITY_META[session.type];
              const improvement = session.feelingAfter - session.feelingBefore;
              return (
                <GlassCard key={session.id} className="p-4 flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${meta.color}20`, color: meta.color }}
                  >
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{meta.label}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-[var(--color-text-secondary)] flex items-center gap-1">
                        <Clock size={10} /> {session.durationMinutes}min
                      </span>
                      <span className="text-[10px] text-[var(--color-text-secondary)]">•</span>
                      <span className="text-[10px] text-[var(--color-text-secondary)]">{session.date}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className="text-sm font-bold"
                      style={{ color: improvement >= 0 ? "var(--color-success)" : "var(--color-error)" }}
                    >
                      {improvement >= 0 ? "+" : ""}{improvement}
                    </span>
                    <p className="text-[10px] text-[var(--color-text-secondary)]">
                      {session.feelingBefore}→{session.feelingAfter}
                    </p>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* Zero state if no profile yet */}
      {!currentProfile && !isLoading && (
        <GlassCard className="p-8 text-center bg-gradient-to-br from-surface to-base border-[var(--color-success)]/20">
          <div className="w-16 h-16 rounded-full bg-[var(--color-success)]/10 mx-auto flex items-center justify-center mb-6">
            <Zap className="text-[var(--color-success)]" size={32} />
          </div>
          <Heading level="h2" className="text-2xl mb-4">Start Your Recovery Journey</Heading>
          <BodyText className="text-[var(--color-text-secondary)] max-w-lg mx-auto mb-6">
            Log your first recovery session to begin tracking readiness, fatigue trends, and how different recovery methods work for your body.
          </BodyText>
          <button
            onClick={() => setIsLoggerOpen(true)}
            className="px-8 py-3 bg-[var(--color-success)] text-white font-bold rounded-xl hover:brightness-110 transition active:scale-95"
          >
            Log First Recovery
          </button>
        </GlassCard>
      )}

      {/* Main Analysis Grid */}
      {currentProfile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Recovery Score */}
            <div className="space-y-3">
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
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-[var(--color-text-primary)]">{score}</span>
                    <span className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest">{currentProfile?.state || 'Unknown'}</span>
                  </div>
                </div>

                <div className="mt-4 w-full bg-[var(--color-bg-surface)] p-3 rounded-lg border border-[var(--color-border-subtle)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="text-[var(--color-accent-blue)]" size={16} />
                    <Caption className="font-bold text-[var(--color-text-primary)]">Confidence</Caption>
                  </div>
                  <Caption className={confidence >= 80 ? "text-[var(--color-success)] font-bold" : "text-[var(--color-accent-orange)] font-bold"}>
                    {confidence}%
                  </Caption>
                </div>
              </GlassCard>
            </div>

            {/* Feeling Trend (from sessions) */}
            {sessions.length > 1 && (
              <div className="space-y-3">
                <Heading level="h4" className="text-[var(--color-text-secondary)] uppercase tracking-wider text-xs font-bold">
                  Feeling Trend
                </Heading>
                <GlassCard className="p-4">
                  <div className="flex items-end gap-1 h-16">
                    {sessions.slice(0, 10).reverse().map((s, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm transition-all duration-500"
                        style={{
                          height: `${(s.feelingAfter / 10) * 100}%`,
                          background: s.feelingAfter >= 7 ? "var(--color-success)" : s.feelingAfter >= 5 ? "var(--color-accent-orange)" : "var(--color-error)",
                          opacity: 0.7 + (i / 10) * 0.3
                        }}
                        title={`${s.date}: ${s.feelingAfter}/10`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-[var(--color-text-secondary)] mt-2 text-center">Post-recovery feeling over time</p>
                </GlassCard>
              </div>
            )}

            {/* Muscle Recovery Map */}
            {muscleRecovery && (
              <div className="space-y-3">
                <Heading level="h4" className="text-[var(--color-text-secondary)] uppercase tracking-wider text-xs font-bold">Muscle Recovery Map</Heading>
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
                        <span className="text-[var(--color-text-primary)] font-medium">{m.name}</span>
                        <span className={m.val < 50 ? "text-[var(--color-error)]" : m.val < 80 ? "text-[var(--color-accent-orange)]" : "text-[var(--color-success)]"}>{m.val}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${m.val < 50 ? "bg-[var(--color-error)]" : m.val < 80 ? "bg-[var(--color-accent-orange)]" : "bg-[var(--color-success)]"}`}
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
            <div className="space-y-3">
              <Heading level="h4" className="text-[var(--color-text-secondary)] uppercase tracking-wider text-xs font-bold">Recovery Analysis</Heading>
              <GlassCard className="p-6 border border-[var(--color-border-subtle)]">
                <ul className="space-y-4">
                  {explanation?.map((exp, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {exp.impact === 'positive' && <CheckCircle className="text-[var(--color-success)] shrink-0 mt-0.5" size={18} />}
                      {exp.impact === 'negative' && <AlertTriangle className="text-[var(--color-error)] shrink-0 mt-0.5" size={18} />}
                      {exp.impact === 'neutral' && <Info className="text-[var(--color-accent-blue)] shrink-0 mt-0.5" size={18} />}
                      <div>
                        <Heading level="h5" className="text-sm text-[var(--color-text-primary)]">{exp.factor}</Heading>
                        <BodyText className="text-[var(--color-text-secondary)] text-sm mt-0.5">{exp.text}</BodyText>
                      </div>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>

            {/* Recommendations */}
            <div className="space-y-3">
              <Heading level="h4" className="text-[var(--color-text-secondary)] uppercase tracking-wider text-xs font-bold">AI Adaptive Recommendation</Heading>

              {currentProfile?.recommendations?.map((rec, i) => (
                <GlassCard key={i} className={`p-6 border ${rec.priority === 'CRITICAL' ? 'border-[var(--color-error)]/30' : rec.priority === 'HIGH' ? 'border-[var(--color-accent-orange)]/30' : 'border-[var(--color-border-subtle)]'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${rec.priority === 'CRITICAL' ? 'bg-[var(--color-error)]/20 text-[var(--color-error)]' : rec.priority === 'HIGH' ? 'bg-[var(--color-accent-orange)]/20 text-[var(--color-accent-orange)]' : 'bg-[var(--color-bg-surface)] text-[var(--color-text-primary)]'}`}>
                      <AlertTriangle size={24} />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Heading level="h3" className="text-[var(--color-text-primary)]">{rec.title}</Heading>
                        <BodyText className="text-[var(--color-text-secondary)]">{rec.description}</BodyText>
                      </div>
                      <div className="mt-4 bg-[var(--color-bg-base)]/50 rounded-lg p-4">
                        <Caption className="font-bold text-[var(--color-text-secondary)] mb-2 uppercase">Why?</Caption>
                        <ul className="space-y-2">
                          {rec.reason.map((r, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                              <CheckCircle size={14} className="text-[var(--color-success)] shrink-0 mt-0.5" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        onClick={() => setIsLoggerOpen(true)}
                        className="mt-2 px-4 py-2 bg-[var(--color-success)]/20 text-[var(--color-success)] rounded-lg border border-[var(--color-success)]/30 text-sm font-medium hover:bg-[var(--color-success)]/30 transition active:scale-95"
                      >
                        Log Recovery Session
                      </button>
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
                      <Heading level="h3" className="text-[var(--color-text-primary)]">Cleared for Training</Heading>
                      <BodyText className="text-[var(--color-text-secondary)]">Your recovery is strong. Proceed with today's scheduled workout.</BodyText>
                    </div>
                  </div>
                </GlassCard>
              )}
            </div>

          </div>
        </div>
      )}

      <RecoveryLoggerSheet isOpen={isLoggerOpen} onClose={() => setIsLoggerOpen(false)} />
    </div>
  );
}
