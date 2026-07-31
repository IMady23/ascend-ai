'use client';

import React from 'react';
import { MotionCard } from '@/components/ui/motion/MotionCard';
import { Target, Calendar, CalendarDays, Infinity as InfinityIcon } from 'lucide-react';

export interface SummaryCardsProps {
  status: 'loading' | 'no-data' | 'data' | 'error';
  dailyStats?: any;
  weeklyStats?: any;
  monthlyStats?: any;
  lifetimeStats?: any;
}

export function SummaryCards({ status, dailyStats, weeklyStats, monthlyStats, lifetimeStats }: SummaryCardsProps) {
  
  const renderState = (content: React.ReactNode) => {
    if (status === 'loading') return <div className="h-full flex items-center justify-center py-6"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-text-primary"></div></div>;
    if (status === 'error') return <div className="text-danger py-6 text-center">Error</div>;
    if (status === 'no-data') return <div className="text-text-secondary text-sm py-6 text-center">Complete workout to unlock</div>;
    return content;
  };

  const renderCard = (title: string, icon: React.ReactNode, stats: any, colorToken: string) => {
    return (
      <MotionCard className="glass-panel" interactive={false}>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-2 rounded-lg bg-${colorToken}/20 text-${colorToken}`}>
              {icon}
            </div>
            <h3 className="text-lg font-medium text-text-primary">{title}</h3>
          </div>
          {renderState(
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Avg. Steps</span>
                <span className="font-semibold text-text-primary">{Math.round(stats?.metrics?.avgDailySteps || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Avg. Water</span>
                <span className="font-semibold text-text-primary">{Math.round(stats?.metrics?.avgDailyWater || 0)} ml</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Avg. Protein</span>
                <span className="font-semibold text-text-primary">{Math.round(stats?.metrics?.avgDailyProtein || 0)} g</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border-subtle">
                <span className="text-sm font-medium text-text-primary">Consistency</span>
                <span className={`font-semibold ${stats?.consistency?.overall && stats.consistency.overall >= 80 ? 'text-success' : 'text-text-primary'}`}>
                  {stats?.consistency?.overall || 0}%
                </span>
              </div>
            </div>
          )}
        </div>
      </MotionCard>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {renderCard('Today', <Target className="w-5 h-5 text-accent-hydration" />, dailyStats, 'accent-hydration')}
      {renderCard('This Week', <Calendar className="w-5 h-5 text-info" />, weeklyStats, 'info')}
      {renderCard('This Month', <CalendarDays className="w-5 h-5 text-accent-workout" />, monthlyStats, 'accent-workout')}
      {renderCard('Lifetime', <InfinityIcon className="w-5 h-5 text-accent-nutrition" />, lifetimeStats, 'accent-nutrition')}
    </div>
  );
}
