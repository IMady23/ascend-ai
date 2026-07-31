import { create } from 'zustand';
import { AnalyticsService, TimeRange } from '@/services/analytics/AnalyticsService';
import { useUserStore } from './user.store';

export type AnalyticsSlice = 'nutrition' | 'workout' | 'hydration' | 'weight' | 'sleep' | 'general' | 'all';

export interface AnalyticsState {
  timeRange: TimeRange;
  isLoading: boolean;
  error: string | null;
  hasData: boolean;

  // Sliced data states
  stepTrend: ReturnType<typeof AnalyticsService.getStepTrend> | null;
  hydrationTrend: ReturnType<typeof AnalyticsService.getHydrationTrend> | null;
  workoutSplit: ReturnType<typeof AnalyticsService.getWorkoutSplit> | null;
  nutritionSplit: ReturnType<typeof AnalyticsService.getNutritionSplit> | null;
  goalCompletion: ReturnType<typeof AnalyticsService.getGoalCompletion> | null;
  weightTrend: ReturnType<typeof AnalyticsService.getWeightTrend> | null;
  consistency: ReturnType<typeof AnalyticsService.getConsistency> | null;
  personalRecords: ReturnType<typeof AnalyticsService.getPersonalRecords> | null;
  trendCards: ReturnType<typeof AnalyticsService.getTrendCards> | null;
  aiSummary: ReturnType<typeof AnalyticsService.getAISummary> | null;
  overviewStats: ReturnType<typeof AnalyticsService.getOverviewStats> | null;

  // Interaction Layer State
  selectedDate: string | null;
  hoveredDate: string | null;
  isTimelineLocked: boolean;
  activeMetric: string | null;
  selectedChart: string | null;
  inspectionMode: 'live' | 'hover' | 'locked';
  comparisonMode: 'today-vs-selected' | 'week-vs-week' | 'month-vs-month';

  // Actions
  setTimeRange: (range: TimeRange) => void;
  fetchStats: (userId: string, forceRefresh?: boolean) => Promise<void>;
  recalculate: (slices?: AnalyticsSlice[]) => void;
  setInteractionState: (updates: Partial<Pick<AnalyticsState, 'selectedDate' | 'hoveredDate' | 'isTimelineLocked' | 'activeMetric' | 'selectedChart' | 'inspectionMode' | 'comparisonMode'>>) => void;
  clearInteractionState: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  timeRange: 7,
  isLoading: false,
  error: null,
  hasData: false,

  stepTrend: null,
  hydrationTrend: null,
  workoutSplit: null,
  nutritionSplit: null,
  goalCompletion: null,
  weightTrend: null,
  consistency: null,
  personalRecords: null,
  trendCards: null,
  aiSummary: null,
  overviewStats: null,

  // Interaction State defaults
  selectedDate: null,
  hoveredDate: null,
  isTimelineLocked: false,
  activeMetric: null,
  selectedChart: null,
  inspectionMode: 'live',
  comparisonMode: 'today-vs-selected',

  setInteractionState: (updates) => {
    set((state) => {
      const nextState = { ...state, ...updates };
      // Broadcast interaction state
      if (typeof window !== 'undefined') {
        try {
          const channel = new BroadcastChannel('ascend_analytics_sync');
          channel.postMessage({ 
            type: 'SYNC_INTERACTION', 
            state: {
              selectedDate: nextState.selectedDate,
              hoveredDate: nextState.hoveredDate,
              isTimelineLocked: nextState.isTimelineLocked,
              activeMetric: nextState.activeMetric,
              selectedChart: nextState.selectedChart,
              inspectionMode: nextState.inspectionMode,
              comparisonMode: nextState.comparisonMode
            } 
          });
        } catch (e) {}
      }
      return nextState;
    });
  },
  
  clearInteractionState: () => {
    set((state) => {
      const nextState = {
        ...state,
        selectedDate: null,
        hoveredDate: null,
        isTimelineLocked: false,
        activeMetric: null,
        selectedChart: null,
        inspectionMode: 'live' as const
      };
      
      if (typeof window !== 'undefined') {
        try {
          const channel = new BroadcastChannel('ascend_analytics_sync');
          channel.postMessage({ 
            type: 'SYNC_INTERACTION', 
            state: {
              selectedDate: null,
              hoveredDate: null,
              isTimelineLocked: false,
              activeMetric: null,
              selectedChart: null,
              inspectionMode: 'live',
              comparisonMode: nextState.comparisonMode
            } 
          });
        } catch (e) {}
      }
      
      return nextState;
    });
  },

  setTimeRange: (range) => {
    set({ timeRange: range });
    get().recalculate(['all']);
  },

  recalculate: (slices = ['all']) => {
    const state = get();
    const range = state.timeRange;
    const profile = useUserStore.getState().profile;
    
    const updates: Partial<AnalyticsState> = { hasData: true };
    
    const isAll = slices.includes('all');
    const updateNutrition = isAll || slices.includes('nutrition');
    const updateWorkout = isAll || slices.includes('workout');
    const updateHydration = isAll || slices.includes('hydration');
    const updateWeight = isAll || slices.includes('weight');
    const updateGeneral = isAll || slices.includes('general');

    if (updateNutrition) {
      updates.nutritionSplit = AnalyticsService.getNutritionSplit(range);
    }
    
    if (updateWorkout) {
      updates.workoutSplit = AnalyticsService.getWorkoutSplit(range);
      updates.personalRecords = AnalyticsService.getPersonalRecords();
    }
    
    if (updateHydration) {
      updates.hydrationTrend = AnalyticsService.getHydrationTrend(range);
    }
    
    if (updateWeight) {
      updates.weightTrend = AnalyticsService.getWeightTrend(range);
    }

    if (updateGeneral || updateNutrition || updateWorkout || updateHydration || updateWeight) {
      updates.stepTrend = AnalyticsService.getStepTrend(range);
      updates.goalCompletion = AnalyticsService.getGoalCompletion(range, profile);
      updates.consistency = AnalyticsService.getConsistency(range);
      updates.trendCards = AnalyticsService.getTrendCards(range);
      updates.aiSummary = AnalyticsService.getAISummary(range, profile);
      updates.overviewStats = AnalyticsService.getOverviewStats();
    }

    set(updates);
  },

  fetchStats: async (userId, forceRefresh = false) => {
    set({ isLoading: true, error: null });
    try {
      await AnalyticsService.initializeCache(userId, forceRefresh);
      
      const cache = AnalyticsService.getCache();
      const hasData = cache.activities.length > 0 || cache.dailyLogs.length > 0 || cache.nutritionLogs.length > 0;
      
      if (!hasData) {
        set({ hasData: false, isLoading: false });
      }

      set({ hasData: true, isLoading: false });
      get().recalculate(['all']); // initial full slice

      // Setup BroadcastChannel for cross-tab sync
      if (typeof window !== 'undefined') {
        try {
          const channel = new BroadcastChannel('ascend_analytics_sync');
          channel.onmessage = (event) => {
             if (event.data.type === 'SYNC_RECALCULATE') {
               get().recalculate(event.data.slices);
             } else if (event.data.type === 'SYNC_INTERACTION') {
               set({ ...event.data.state });
             }
          };
          window.addEventListener('storage', (e) => {
            if (e.key === 'ascend_sync_trigger') {
               get().recalculate(['all']);
            }
          });
        } catch (e) {
          console.warn('BroadcastChannel not supported');
        }
      }
    } catch (error: any) {
      console.error('Failed to fetch analytics stats:', error);
      set({ error: error.message || 'Failed to fetch stats', isLoading: false });
    }
  },
}));

// Setup EventBus listener outside the store to bridge domains
import { eventBus } from '@/lib/events/EventBus';

if (typeof window !== 'undefined') {
  eventBus.subscribe('*', async (event) => {
    const store = useAnalyticsStore.getState();

    let slicesToUpdate: AnalyticsSlice[] = ['general'];

    // Intelligent Recalculation
    switch (event.type) {
      case 'MEAL_LOGGED':
        if ((event.metadata as any)?.log) AnalyticsService.injectNutritionLog((event.metadata as any).log);
        slicesToUpdate = ['nutrition'];
        break;
      case 'WORKOUT_COMPLETED':
        if ((event.metadata as any)?.activity) AnalyticsService.injectActivity((event.metadata as any).activity);
        slicesToUpdate = ['workout'];
        break;
      case 'WATER_LOGGED':
        if ((event.metadata as any)?.log) AnalyticsService.injectHydrationLog((event.metadata as any).log);
        slicesToUpdate = ['hydration'];
        break;
      case 'DISTANCE_LOGGED':
        if ((event.metadata as any)?.source === 'steps') {
          const dateStr = new Date().toISOString().split("T")[0];
          const steps = (await import('./activity.store')).useActivityStore.getState().dailySteps;
          AnalyticsService.updateDailyLogSteps(dateStr, steps);
          slicesToUpdate = ['general'];
        }
        break;
      case 'WEIGHT_UPDATED': {
        const dateStr = new Date().toISOString().split("T")[0];
        const weightKg = (event.metadata as any)?.weightKg;
        if (weightKg) {
          import('@/services/repositories/daily-log.repository').then(({ DailyLogRepository }) => {
            DailyLogRepository.updateDailyLog(event.userId, dateStr, { weightKg });
          });
          const existing = AnalyticsService.getCache().dailyLogs.find(l => l.date === dateStr);
          if (existing) {
            existing.weightKg = weightKg;
          } else {
            AnalyticsService.injectDailyLog({ id: '', userId: event.userId, date: dateStr, weightKg } as any);
          }
        }
        slicesToUpdate = ['weight'];
        break;
      }
      case 'SLEEP_LOGGED':
        if ((event.metadata as any)?.dailyLog) AnalyticsService.injectDailyLog((event.metadata as any).dailyLog);
        slicesToUpdate = ['sleep'];
        break;
      case 'RECOVERY_UPDATED':
        if ((event.metadata as any)?.dailyLog) AnalyticsService.injectDailyLog((event.metadata as any).dailyLog);
        slicesToUpdate = ['general'];
        break;
      case 'GOAL_UPDATED':
      case 'PROFILE_UPDATED':
        slicesToUpdate = ['general', 'nutrition', 'workout', 'hydration'];
        break;
    }

    store.recalculate(slicesToUpdate);

    try {
      const channel = new BroadcastChannel('ascend_analytics_sync');
      channel.postMessage({ type: 'SYNC_RECALCULATE', slices: slicesToUpdate });
      localStorage.setItem('ascend_sync_trigger', Date.now().toString());
    } catch (e) {}
  });
}
