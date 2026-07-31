import { create } from 'zustand';
import { InsightRepository } from '@/services/repositories/insight.repository';
import { AggregatedStats } from '@/types/intelligence';

interface AnalyticsState {
  dailyStats: AggregatedStats | null;
  weeklyStats: AggregatedStats | null;
  monthlyStats: AggregatedStats | null;
  yearlyStats: AggregatedStats | null;
  lifetimeStats: AggregatedStats | null;
  isLoading: boolean;
  error: string | null;

  fetchStats: (
    userId: string,
    periodIds: { dailyId: string; weeklyId: string; monthlyId: string; yearlyId: string; lifetimeId: string }
  ) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  dailyStats: null,
  weeklyStats: null,
  monthlyStats: null,
  yearlyStats: null,
  lifetimeStats: null,
  isLoading: false,
  error: null,

  fetchStats: async (userId, periodIds) => {
    set({ isLoading: true, error: null });
    try {
      const [daily, weekly, monthly, yearly, lifetime] = await Promise.all([
        InsightRepository.getStats(userId, 'daily', periodIds.dailyId),
        InsightRepository.getStats(userId, 'weekly', periodIds.weeklyId),
        InsightRepository.getStats(userId, 'monthly', periodIds.monthlyId),
        InsightRepository.getStats(userId, 'yearly', periodIds.yearlyId),
        InsightRepository.getStats(userId, 'lifetime', periodIds.lifetimeId),
      ]);

      set({
        dailyStats: daily,
        weeklyStats: weekly,
        monthlyStats: monthly,
        yearlyStats: yearly,
        lifetimeStats: lifetime,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Failed to fetch analytics stats:', error);
      set({ error: error.message || 'Failed to fetch stats', isLoading: false });
    }
  },
}));
