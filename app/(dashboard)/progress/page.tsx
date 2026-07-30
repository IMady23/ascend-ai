"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Flame, 
  Award, 
  Map, 
  Dumbbell, 
  History, 
  TrendingUp, 
  Calendar,
  Sparkles,
  Zap,
  Target,
  Droplets
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer/PageContainer";
import { DashboardLayout, HeroSection, WidgetSection } from "@/components/adl/layout/Layouts";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Badge } from "@/components/adl/primitives/Badge";

import { XPBar } from "@/components/adl/composites/progress/XPBar";
import { AchievementBadge } from "@/components/adl/composites/progress/AchievementBadge";
import { JourneyTimeline } from "@/components/adl/composites/progress/JourneyTimeline";
import { MilestoneCard } from "@/components/adl/composites/progress/MilestoneCard";

import { EmptyState } from "@/components/adl/composites/feedback/EmptyState";
import { useUserStore } from "@/stores/user.store";
import { useActivityStore } from "@/stores/activity.store";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useDataReadiness } from "@/hooks/useDataReadiness";

export default function ProgressModule() {
  const { profile, isLoading: isUserLoading } = useUserStore();
  const { activities, isLoading: isActivityLoading } = useActivityStore() as any;
  const { meals, isLoading: isNutritionLoading } = useNutritionStore() as any;
  const readiness = useDataReadiness();

  const isLoading = isUserLoading || isActivityLoading || isNutritionLoading;

  const workoutsCount = activities?.length || 0;
  const mealsLoggedCount = meals?.length || 0;
  const totalMissions = workoutsCount + mealsLoggedCount;
  
  const achievements = (profile as any)?.achievements || [];
  const hasAchievements = readiness.progress.status === "ready" && achievements.length > 0;
  
  // Set Page Accent
  React.useEffect(() => {
    document.documentElement.style.setProperty("--current-accent", "var(--color-accent-gold)");
    return () => document.documentElement.style.setProperty("--current-accent", "var(--color-accent-blue)");
  }, []);

  if (isLoading) {
    return (
      <PageContainer>
        <DashboardLayout>
          <div className="lg:col-span-3 space-y-6 flex items-center justify-center min-h-[50vh]">
             <div className="animate-pulse flex flex-col items-center gap-4">
               <div className="w-12 h-12 rounded-full border-4 border-[var(--color-glass-border)] border-t-[var(--color-accent-gold)] animate-spin" />
               <Caption className="text-[var(--color-text-muted)]">Syncing Repositories...</Caption>
             </div>
          </div>
        </DashboardLayout>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <DashboardLayout>
        
        {/* TOP HERO ZONE */}
        <div className="lg:col-span-3 space-y-6">
          <HeroSection className="bg-gradient-to-br from-[var(--color-bg-base)] via-[var(--color-bg-surface)] to-[var(--color-accent-gold)]/5">
            <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between w-full">
              
              <div className="flex-1 w-full max-w-2xl">
                <XPBar 
                  level={1}
                  currentXP={0}
                  maxXP={100}
                  chapter="Chapter 1 — The Beginning"
                />
                
                <div className="flex flex-wrap items-center gap-4 mt-6">
                  <div className="flex flex-col">
                    <Caption className="text-[var(--color-text-muted)] uppercase text-[10px] tracking-wider mb-0.5">Rank</Caption>
                    <Heading level="h4" className="text-[var(--color-accent-gold)]">Rookie</Heading>
                  </div>
                  <div className="w-px h-8 bg-[var(--color-glass-border)]" />
                  <div className="flex flex-col">
                    <Caption className="text-[var(--color-text-muted)] uppercase text-[10px] tracking-wider mb-0.5">Lifetime XP</Caption>
                    <div className="font-mono text-lg font-bold">0</div>
                  </div>
                </div>
              </div>

              {/* Achievement Showcase (Pinned) */}
              <div className="shrink-0 flex items-center justify-center gap-4 bg-[var(--color-bg-surface)]/50 p-6 rounded-[var(--radius-xl)] border border-[var(--color-glass-border)] w-full lg:w-auto min-h-[120px]">
                {!hasAchievements && (
                  <Caption className="text-[var(--color-text-muted)]">No pinned achievements yet.</Caption>
                )}
              </div>

            </div>
          </HeroSection>
        </div>

        {/* LEFT COLUMN: The Journey & Trophies */}
        <div className="lg:col-span-2 space-y-6">
          
          <WidgetSection title="Personal Journey Map">
            <GlassCard className="p-6">
              {!hasAchievements ? (
                 <div className="py-8 text-center">
                   <Caption className="text-[var(--color-text-muted)]">Your journey map will populate as you reach milestones.</Caption>
                 </div>
              ) : (
                 <JourneyTimeline nodes={[]} />
              )}
            </GlassCard>
          </WidgetSection>

          <WidgetSection title="Digital Trophy Room">
            <GlassCard className="p-6">
              {!hasAchievements ? (
                <EmptyState
                  emoji="🏆"
                  title="No Achievements Unlocked"
                  description="Complete your first workout. Log your first meal. Your accomplishments will appear here."
                  primaryAction={{
                    label: "Start Training",
                    onClick: () => {}
                  }}
                />
              ) : (
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                   {/* Map over earned achievements */}
                </div>
              )}
            </GlassCard>
          </WidgetSection>

          {/* Legacy Summary */}
          {totalMissions > 0 && (
            <div className="mt-12 text-center pb-12">
              <Sparkles size={24} className="mx-auto text-[var(--color-accent-gold)] mb-4" />
              <Caption className="uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Your Legacy Starts Now</Caption>
              <Heading level="h2" className="text-3xl font-serif text-[var(--color-text-secondary)] italic">
                "You've become someone your past self would admire."
              </Heading>
              <div className="flex justify-center gap-8 mt-6">
                <div>
                  <div className="font-mono text-2xl text-[var(--color-text-primary)]">{totalMissions}</div>
                  <Caption className="text-[var(--color-text-muted)]">Total Missions</Caption>
                </div>
              </div>
            </div>
          )}
          
        </div>

        {/* RIGHT COLUMN: Metrics & Coach */}
        <div className="lg:col-span-1 space-y-6">

          {/* AI Memory & Best Week */}
          <WidgetSection title="AI Journey Coach">
            <GlassCard className="p-5 border-[var(--color-accent-indigo)]/20 bg-gradient-to-br from-[var(--color-accent-indigo)]/5 to-transparent flex flex-col gap-4">
              
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-[var(--color-accent-indigo)]/10 shrink-0 mt-1">
                  <History size={16} className="text-[var(--color-accent-indigo)]" />
                </div>
                <div>
                  <Caption className="text-[var(--color-accent-indigo)] font-semibold uppercase tracking-wider text-[10px] mb-1">AI Memory</Caption>
                  <BodyText size="sm" className="text-[var(--color-text-primary)] leading-relaxed italic">
                    I don't have enough progress history yet. Let's start tracking your milestones so I can personalize your legacy.
                  </BodyText>
                </div>
              </div>

            </GlassCard>
          </WidgetSection>

          {/* Biggest Improvements */}
          <WidgetSection title="Biggest Improvements">
            <GlassCard className="p-4 flex flex-col gap-3">
              <div className="py-6 text-center">
                <Caption className="text-[var(--color-text-muted)]">No data yet.</Caption>
              </div>
            </GlassCard>
          </WidgetSection>

          {/* Journey Statistics */}
          <WidgetSection title="Lifetime Statistics">
            <GlassCard className="p-5 grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <div className="font-mono text-xl font-bold">{workoutsCount}</div>
                <Caption className="text-[var(--color-text-muted)]">Workouts</Caption>
              </div>
              <div>
                <div className="font-mono text-xl font-bold">{mealsLoggedCount}</div>
                <Caption className="text-[var(--color-text-muted)]">Meals Logged</Caption>
              </div>
              <div>
                <div className="font-mono text-xl font-bold text-[var(--color-accent-orange)]">0 <span className="text-xs">days</span></div>
                <Caption className="text-[var(--color-text-muted)]">Current Streak</Caption>
              </div>
              <div>
                <div className="font-mono text-xl font-bold text-[var(--color-accent-gold)]">0 <span className="text-xs">days</span></div>
                <Caption className="text-[var(--color-text-muted)]">Longest Streak</Caption>
              </div>
              <div>
                <div className="font-mono text-xl font-bold">0 <span className="text-xs">kg</span></div>
                <Caption className="text-[var(--color-text-muted)]">Weight Lifted</Caption>
              </div>
              <div>
                <div className="font-mono text-xl font-bold">0 <span className="text-xs">hrs</span></div>
                <Caption className="text-[var(--color-text-muted)]">Hours Trained</Caption>
              </div>
            </GlassCard>
          </WidgetSection>

        </div>
      </DashboardLayout>
    </PageContainer>
  );
}
