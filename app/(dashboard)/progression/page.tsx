"use client";

import React, { useEffect } from "react";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Flame, Trophy, Target, Star, History, Crown } from "lucide-react";
import { useProgressionStore } from "@/stores/progression.store";
import { useTimelineStore } from "@/stores/timeline.store";
import { useUserStore } from "@/stores/user.store";
import { TimelineEvent } from "@/types/progression";

export default function ProgressionPage() {
  const { profile, activeMissions } = useProgressionStore();
  const { events, fetchInitialEvents, isLoading } = useTimelineStore();
  const { profile: userProfile } = useUserStore();

  useEffect(() => {
    fetchInitialEvents();
  }, [fetchInitialEvents]);

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 px-4 pt-4 sm:px-6 lg:px-8">
        <Heading level="h1">Hall of Progress</Heading>
        <BodyText className="text-[var(--color-text-muted)]">Complete activities to begin your journey.</BodyText>
      </div>
    );
  }

  const { xp, streak, achievements } = profile;
  const progressPercent = Math.min(100, Math.max(0, (xp.xpForCurrentLevel / xp.xpToNextLevel) * 100));

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 pt-4 pb-20 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h1">Hall of Progress</Heading>
          <BodyText className="text-[var(--color-text-muted)]">Your journey and achievements</BodyText>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Stats */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Level Card */}
            <GlassCard className="p-6 relative overflow-hidden flex flex-col justify-between border-[var(--color-glass-border)]">
              <div className="flex items-start justify-between">
                <div>
                  <Caption className="text-[var(--color-accent-indigo)] font-bold uppercase tracking-wider mb-1">Current Level</Caption>
                  <Heading level="h1" className="text-5xl font-black text-white">{xp.currentLevel}</Heading>
                </div>
                <div className="w-12 h-12 rounded-full bg-[var(--color-accent-indigo)]/20 flex items-center justify-center">
                  <Star className="text-[var(--color-accent-indigo)]" size={24} />
                </div>
              </div>
              <div className="mt-6">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[var(--color-text-secondary)]">{xp.xpForCurrentLevel} XP</span>
                  <span className="text-[var(--color-text-muted)]">{xp.xpToNextLevel} XP</span>
                </div>
                <div className="w-full h-2 bg-[var(--color-bg-surface-hover)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[var(--color-accent-indigo)] to-[var(--color-accent-blue)] rounded-full transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </GlassCard>

            {/* Streak Card */}
            <GlassCard className="p-6 flex flex-col justify-between border-[var(--color-glass-border)]">
              <div className="flex items-start justify-between">
                <div>
                  <Caption className="text-[var(--color-accent-orange)] font-bold uppercase tracking-wider mb-1">Active Streak</Caption>
                  <Heading level="h1" className="text-5xl font-black text-white">{streak.current}</Heading>
                </div>
                <div className="w-12 h-12 rounded-full bg-[var(--color-accent-orange)]/20 flex items-center justify-center">
                  <Flame className="text-[var(--color-accent-orange)]" size={24} />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between text-sm">
                <span className="text-[var(--color-text-muted)]">Longest: {streak.longest} days</span>
              </div>
            </GlassCard>
          </div>

          {/* Achievements */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="text-[var(--color-accent-gold)]" size={20} />
              <Heading level="h3">Achievements</Heading>
            </div>
            
            {achievements.length === 0 ? (
              <div className="text-center py-8">
                <Crown className="mx-auto text-[var(--color-text-muted)] mb-3" size={32} />
                <BodyText className="text-[var(--color-text-muted)]">No achievements yet. Keep grinding!</BodyText>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {achievements.map((a) => (
                  <div key={a.id} className="flex flex-col items-center text-center p-4 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-glass-border)]">
                    <div className="text-3xl mb-2">{a.icon}</div>
                    <BodyText size="sm" className="font-bold text-white mb-1">{a.title}</BodyText>
                    <Caption className="text-[var(--color-text-muted)] text-[10px]">{a.description}</Caption>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Missions */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-[var(--color-accent-green)]" size={20} />
              <Heading level="h3">Active Missions</Heading>
            </div>
            {activeMissions.length === 0 ? (
              <BodyText size="sm" className="text-[var(--color-text-muted)]">No active missions right now.</BodyText>
            ) : (
              <div className="space-y-3">
                {activeMissions.map((m) => (
                  <div key={m.id} className="p-3 rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-glass-border)]">
                    <div className="flex justify-between items-start mb-2">
                      <BodyText size="sm" className="font-bold text-white">{m.title}</BodyText>
                      <span className="text-xs font-medium text-[var(--color-accent-green)]">+{m.xpReward} XP</span>
                    </div>
                    <Caption className="text-[var(--color-text-muted)] mb-3">{m.description}</Caption>
                    <div className="w-full h-1.5 bg-[var(--color-bg-surface-hover)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[var(--color-accent-green)] rounded-full transition-all"
                        style={{ width: `${Math.min(100, (m.progress / m.target) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Coach Timeline */}
          <GlassCard className="p-6 flex flex-col max-h-[500px]">
            <div className="flex items-center gap-2 mb-4">
              <History className="text-[var(--color-text-secondary)]" size={20} />
              <Heading level="h3">Coach Timeline</Heading>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 relative">
              {isLoading && events.length === 0 ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-[var(--color-bg-surface)] h-10 w-10"></div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-[var(--color-bg-surface)] rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-[var(--color-bg-surface)] rounded"></div>
                    </div>
                  </div>
                </div>
              ) : events.length === 0 ? (
                <BodyText size="sm" className="text-[var(--color-text-muted)] text-center py-8">Your story begins here.</BodyText>
              ) : (
                <div className="relative border-l border-[var(--color-glass-border)] ml-3 space-y-8 pb-4">
                  {events.map((event: TimelineEvent) => (
                    <div key={event.id} className="relative pl-6">
                      <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-[var(--color-bg-base)] border-2 border-[var(--color-glass-border)] flex items-center justify-center text-sm z-10">
                        {event.icon || '✨'}
                      </div>
                      <div>
                        <div className="flex items-baseline justify-between mb-1">
                          <Heading level="h5" className="text-sm font-bold text-white">{event.title}</Heading>
                          {event.xpEarned > 0 && (
                            <span className="text-xs font-bold text-[var(--color-accent-indigo)]">+{event.xpEarned} XP</span>
                          )}
                        </div>
                        <Caption className="text-[var(--color-text-muted)] block mb-2">
                          {new Date(event.timestamp.seconds * 1000).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </Caption>
                        
                        {event.coachCommentary && (
                          <div className="mt-2 p-3 rounded-lg bg-[var(--color-accent-indigo)]/10 border border-[var(--color-accent-indigo)]/20 text-sm text-[var(--color-text-primary)]">
                            <strong className="text-[var(--color-accent-indigo)] block mb-1">Coach:</strong>
                            "{event.coachCommentary}"
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
