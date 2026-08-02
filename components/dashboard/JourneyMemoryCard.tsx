'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/adl/composites/cards/Cards';
import { useNutritionStore } from '@/stores/nutrition.store';
import { useActivityStore } from '@/stores/activity.store';
import { UserProfile } from '@/types/user';

interface JourneyMemoryCardProps {
  profile: UserProfile;
}

interface JourneyMoment {
  timeLabel: string;    // e.g. "30 days ago"
  headline: string;     // e.g. "You were 74.2kg"
  nowLabel: string;     // e.g. "Today"
  nowHeadline: string;  // e.g. "You're 71.0kg · 3.2kg closer"
  emoji: string;
  color: string;
}

function getDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function formatDate(isoStr: string): string {
  return new Date(isoStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function JourneyMemoryCard({ profile }: JourneyMemoryCardProps) {
  const { meals } = useNutritionStore();
  const { dailySteps } = useActivityStore();

  const moment: JourneyMoment | null = useMemo(() => {
    if (!profile?.createdAt) return null;

    const createdAt = new Date(profile.createdAt);
    const now = new Date();
    const daysOnJourney = Math.floor((now.getTime() - createdAt.getTime()) / 86400000);
    const currentWeight = profile.identity?.weight || 0;
    const targetWeight = (profile.preferences?.goals as any)?.weightKg || 0;

    // Journey start milestone
    if (daysOnJourney >= 7 && daysOnJourney < 60) {
      return {
        timeLabel: `${daysOnJourney} days ago`,
        headline: 'You started your Ascend journey.',
        nowLabel: 'Today',
        nowHeadline: `You've logged ${meals.length} meals and built real momentum.`,
        emoji: '🚀',
        color: 'var(--color-accent-blue)',
      };
    }

    // One month milestone — weight progress
    if (daysOnJourney >= 30 && currentWeight > 0 && targetWeight > 0) {
      const oneMonthMeals = meals.filter(m => m.date && m.date >= getDaysAgo(30));
      const avgProtein = oneMonthMeals.length > 0
        ? Math.round(oneMonthMeals.reduce((s, m) => s + (m.protein || 0), 0) / oneMonthMeals.length)
        : 0;

      const delta = Math.abs(currentWeight - targetWeight);
      return {
        timeLabel: 'One Month Ago',
        headline: `You started your mission. Your goal: ${targetWeight}kg.`,
        nowLabel: 'Today',
        nowHeadline: `${delta.toFixed(1)}kg remaining · Avg protein ${avgProtein}g/day this month.`,
        emoji: '⚖️',
        color: 'var(--color-accent-gold)',
      };
    }

    // 90-day milestone
    if (daysOnJourney >= 90) {
      const dayDate = formatDate(createdAt.toISOString());
      return {
        timeLabel: '90 Days Ago',
        headline: `On ${dayDate}, you logged your very first meal.`,
        nowLabel: 'Today',
        nowHeadline: `${meals.length} total meals logged. Your consistency is remarkable.`,
        emoji: '🏆',
        color: 'var(--color-accent-purple)',
      };
    }

    return null;
  }, [profile, meals]);

  if (!moment) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mb-6"
    >
      <GlassCard className="p-4 md:p-5 border-l-4" style={{ borderLeftColor: moment.color }}>
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xl"
            style={{ background: `${moment.color}20` }}
          >
            {moment.emoji}
          </div>

          <div className="flex-1 space-y-3">
            {/* Past */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: moment.color }}>
                {moment.timeLabel}
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">{moment.headline}</p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-border-subtle" />
              <CalendarDays className="w-3 h-3 text-text-disabled" />
              <div className="flex-1 h-px bg-border-subtle" />
            </div>

            {/* Now */}
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <TrendingUp className="w-3 h-3" style={{ color: moment.color }} />
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: moment.color }}>
                  {moment.nowLabel}
                </p>
              </div>
              <p className="text-sm font-semibold text-text-primary leading-relaxed">
                {moment.nowHeadline}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
