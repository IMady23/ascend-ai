import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WidgetId =
  | 'calories'
  | 'water'
  | 'steps'
  | 'protein'
  | 'workout'
  | 'recovery'
  | 'coach'
  | 'nutrition'
  | 'weight';

interface DashboardPersonalizationState {
  widgetTaps: Record<WidgetId, number>;
  tapWidget: (id: WidgetId) => void;
  getTopWidgets: (limit?: number) => WidgetId[];
}

const DEFAULT_TAPS: Record<WidgetId, number> = {
  calories: 0,
  water: 0,
  steps: 0,
  protein: 0,
  workout: 0,
  recovery: 0,
  coach: 0,
  nutrition: 0,
  weight: 0,
};

export const useDashboardPersonalization = create<DashboardPersonalizationState>()(
  persist(
    (set, get) => ({
      widgetTaps: { ...DEFAULT_TAPS },

      tapWidget: (id: WidgetId) => {
        set((state) => ({
          widgetTaps: {
            ...state.widgetTaps,
            [id]: (state.widgetTaps[id] || 0) + 1,
          },
        }));
      },

      getTopWidgets: (limit = 3) => {
        const { widgetTaps } = get();
        return (Object.entries(widgetTaps) as [WidgetId, number][])
          .sort((a, b) => b[1] - a[1])
          .filter(([, count]) => count > 0)
          .slice(0, limit)
          .map(([id]) => id);
      },
    }),
    {
      name: 'ascend-dashboard-personalization',
    }
  )
);
