'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAnalyticsStore } from '@/stores/analytics.store';
import { Target, Calendar, CalendarDays, Infinity as InfinityIcon } from 'lucide-react';
import { AggregatedStats } from '@/types/intelligence';

export function SummaryCards() {
  const { dailyStats, weeklyStats, monthlyStats, lifetimeStats } = useAnalyticsStore();

  const renderCard = (title: string, icon: React.ReactNode, stats: AggregatedStats | null, color: string) => {
    return (
      <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl hover:bg-zinc-800/50 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg bg-${color}-500/20 text-${color}-500`}>
              {icon}
            </div>
            <h3 className="text-lg font-medium text-zinc-200">{title}</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Workouts</span>
              <span className="font-semibold text-zinc-100">{stats?.metrics?.workoutsCompleted || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Total Vol.</span>
              <span className="font-semibold text-zinc-100">{stats?.metrics?.totalVolumeKg || 0} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Avg. Protein</span>
              <span className="font-semibold text-zinc-100">{Math.round(stats?.metrics?.avgDailyProtein || 0)} g</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
              <span className="text-sm font-medium text-zinc-300">Consistency</span>
              <span className={`font-semibold ${stats?.consistency?.overall && stats.consistency.overall >= 80 ? 'text-emerald-400' : 'text-zinc-100'}`}>
                {stats?.consistency?.overall || 0}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {renderCard('Today', <Target className="w-5 h-5 text-blue-500" />, dailyStats, 'blue')}
      {renderCard('This Week', <Calendar className="w-5 h-5 text-indigo-500" />, weeklyStats, 'indigo')}
      {renderCard('This Month', <CalendarDays className="w-5 h-5 text-purple-500" />, monthlyStats, 'purple')}
      {renderCard('Lifetime', <InfinityIcon className="w-5 h-5 text-emerald-500" />, lifetimeStats, 'emerald')}
    </div>
  );
}
