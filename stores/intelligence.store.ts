import { create } from "zustand";
import { AggregatedStats, Insight } from "@/types/intelligence";
import { InsightRepository } from "@/services/repositories/insight.repository";
import { useUserStore } from "@/stores/user.store";
import { format, startOfWeek, startOfMonth } from "date-fns";
import { 
  IntelligenceService, 
  TrendCategory, 
  TimeFilter, 
  ActiveInsightData, 
  ConsistencyBreakdown, 
  ChartDataPoint,
  SufficiencyState
} from "@/services/intelligence/intelligence.service";

interface IntelligenceState {
  weeklyStats: AggregatedStats | null;
  monthlyStats: AggregatedStats | null;
  latestInsights: Insight[];
  isLoading: boolean;

  // New Interactive Properties
  timeFilter: TimeFilter;
  trendCategory: TrendCategory;
  chartData: ChartDataPoint[];
  consistencyBreakdown: ConsistencyBreakdown | null;
  activeInsightData: ActiveInsightData | null;
  historicalInsights: ActiveInsightData[];
  sufficiency: SufficiencyState | null;

  setTimeFilter: (filter: TimeFilter) => void;
  setTrendCategory: (category: TrendCategory) => void;
  fetchIntelligence: () => Promise<void>;
}

export const useIntelligenceStore = create<IntelligenceState>((set, get) => ({
  weeklyStats: null,
  monthlyStats: null,
  latestInsights: [],
  isLoading: false,

  timeFilter: 30,
  trendCategory: "workout",
  chartData: [],
  consistencyBreakdown: null,
  activeInsightData: null,
  historicalInsights: [],
  sufficiency: null,

  setTimeFilter: (filter) => {
    set({ timeFilter: filter });
    get().fetchIntelligence();
  },

  setTrendCategory: (category) => {
    set({ trendCategory: category });
    get().fetchIntelligence();
  },

  fetchIntelligence: async () => {
    const userId = useUserStore.getState().userId;
    if (!userId) return;

    set({ isLoading: true });
    
    try {
      const today = new Date();
      const weeklyId = format(startOfWeek(today), 'yyyy-MM-dd');
      const monthlyId = format(startOfMonth(today), 'yyyy-MM');
      const { timeFilter, trendCategory } = get();

      // 1. Calculate Sufficiency based on real stores
      const sufficiency = IntelligenceService.getSufficiencyState();

      // 2. Pass the stage to the data fetchers
      const [weekly, monthly, insights, chartData, consistency, activeInsight, historical] = await Promise.all([
        InsightRepository.getStats(userId, 'weekly', weeklyId),
        InsightRepository.getStats(userId, 'monthly', monthlyId),
        InsightRepository.getLatestInsights(userId, 5),
        IntelligenceService.fetchChartData(trendCategory, timeFilter, sufficiency.stage),
        IntelligenceService.fetchConsistencyScore(timeFilter, sufficiency.stage),
        IntelligenceService.fetchActiveInsight(sufficiency.stage),
        IntelligenceService.fetchHistoricalInsights(timeFilter, sufficiency.stage)
      ]);

      set({
        weeklyStats: weekly,
        monthlyStats: monthly,
        latestInsights: insights,
        chartData,
        consistencyBreakdown: consistency,
        activeInsightData: activeInsight,
        historicalInsights: historical,
        sufficiency,
        isLoading: false
      });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  }
}));
