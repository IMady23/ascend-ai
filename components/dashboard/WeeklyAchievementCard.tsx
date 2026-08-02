'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Droplet, Dumbbell } from 'lucide-react';
import { GlassCard } from '@/components/adl/composites/cards/Cards';
import { useNutritionStore } from '@/stores/nutrition.store';
import { useActivityStore } from '@/stores/activity.store';
import { useProgressionStore } from '@/stores/progression.store';

interface WeeklyAchievementCardProps {
  userId?: string;
}

interface WeeklyStat {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  pct: number;
}

function getStartOfWeek(): Date {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const diff = now.getDate() - day;
  const start = new Date(now);
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function WeeklyAchievementCard({ userId }: WeeklyAchievementCardProps) {
  const { meals } = useNutritionStore();
  const { dailySteps } = useActivityStore();
  const { profile } = useProgressionStore();

  const weekStart = useMemo(() => getStartOfWeek(), []);
  const weekStartStr = weekStart.toISOString().split('T')[0];

  const weeklyMeals = useMemo(() => {
    return meals.filter(m => m.date && m.date >= weekStartStr);
  }, [meals, weekStartStr]);

  const avgProtein = useMemo(() => {
    const days = new Set(weeklyMeals.map(m => m.date)).size || 1;
    const total = weeklyMeals.reduce((s, m) => s + (m.protein || 0), 0);
    return Math.round(total / days);
  }, [weeklyMeals]);

  const totalXP = profile?.xp?.total || 0;
  const currentLevel = profile?.xp?.currentLevel || 1;
  const streak = profile?.streak?.current || 0;

  const stats: WeeklyStat[] = [
    {
      label: 'Avg Protein',
      value: `${avgProtein}g`,
      icon: <Dumbbell className="w-4 h-4" />,
      color: 'var(--color-accent-nutrition)',
      pct: Math.min(100, (avgProtein / 150) * 100),
    },
    {
      label: 'Streak',
      value: `${streak} days`,
      icon: <Zap className="w-4 h-4" />,
      color: 'var(--color-accent-gold)',
      pct: Math.min(100, (streak / 7) * 100),
    },
    {
      label: 'Meals Logged',
      value: `${weeklyMeals.length}`,
      icon: <Droplet className="w-4 h-4" />,
      color: 'var(--color-accent-hydration)',
      pct: Math.min(100, (weeklyMeals.length / 21) * 100),
    },
    {
      label: 'Total XP',
      value: `${totalXP.toLocaleString()}`,
      icon: <Trophy className="w-4 h-4" />,
      color: 'var(--color-accent-purple)',
      pct: Math.min(100, (totalXP / 1000) * 100),
    },
  ];

  return (
    <GlassCard className="p-4 md:p-6 mb-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-full bg-accent-gold/15 flex items-center justify-center">
          <Trophy className="w-4 h-4 text-accent-gold" />
        </div>
        <div>
          <p className="text-sm font-bold text-text-primary">This Week</p>
          <p className="text-xs text-text-secondary">Level {currentLevel} · Week at a glance</p>
        </div>
        <div className="ml-auto text-xs font-bold px-2 py-1 rounded-full bg-accent-gold/10 text-accent-gold border border-accent-gold/20">
          🌟 Summary
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2 p-3 rounded-xl bg-bg-surface/50 border border-border-subtle"
          >
            <div className="flex items-center gap-2">
              <span style={{ color: stat.color }}>{stat.icon}</span>
              <span className="text-xs text-text-secondary">{stat.label}</span>
            </div>
            <p className="text-lg font-black text-text-primary">{stat.value}</p>
            <div className="w-full h-1 rounded-full bg-bg-surface-elevated overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stat.pct}%` }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: stat.color }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
