import { eventBus } from "@/lib/events/EventBus";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useActivityStore } from "@/stores/activity.store";
import { useUserStore } from "@/stores/user.store";
import { DailyLogRepository } from "@/services/repositories/daily-log.repository";

export class ResetEngine {
  static async checkAndReset() {
    const userStore = useUserStore.getState();
    const userId = userStore.userId;
    if (!userId) return;

    const timezone = userStore.profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    
    const now = new Date();
    let todayStr: string;
    try {
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      todayStr = formatter.format(now);
    } catch {
      todayStr = now.toISOString().split("T")[0];
    }
    
    const nutritionStore = useNutritionStore.getState();
    const activityStore = useActivityStore.getState();
    
    let resetHappened = false;

    if (nutritionStore.currentDate !== todayStr) {
      nutritionStore.setCurrentDate(todayStr);
      nutritionStore.setMeals([]);
      nutritionStore.setHydrationLogs([]);
      nutritionStore.setDailyWater(0); // Legacy support
      
      // Reset activity daily metrics
      useActivityStore.setState({ dailySteps: 0 });
      
      // Ensure daily log exists for the new day
      await DailyLogRepository.updateDailyLog(userId, todayStr, { steps: 0 });
      
      resetHappened = true;
    }

    if (resetHappened) {
      eventBus.dispatch({
        id: crypto.randomUUID(),
        userId,
        type: 'DAY_RESET',
        timestamp: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
        metadata: { newDate: todayStr },
        processed: false
      });
    }
  }
}
