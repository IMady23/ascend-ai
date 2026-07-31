import { useProgressionStore } from "@/stores/progression.store";
import { AscendEvent } from "@/types/events";
import { XP_REWARDS } from "@/config/progression";

export class AchievementEngine {
  
  static evaluateEvent(eventType: string, metadata: any) {
    const store = useProgressionStore.getState();
    const profile = store.profile;
    if (!profile) return;
    const stats = profile.lifetimeStats;
    const achievements = profile.achievements;

    const hasUnlocked = (id: string) => achievements.some(a => a.id === id);
    const unlock = (id: string, title: string, description: string, icon: string, tier: 'bronze' | 'silver' | 'gold' | 'diamond', rewardXP = 0) => {
      if (!hasUnlocked(id)) {
        store.unlockAchievement({
          id,
          title,
          description,
          icon,
          tier,
          unlockedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
          sourceEvent: eventType,
          rewardXP
        });
        if (rewardXP > 0) {
          store.addXP(rewardXP);
        }
      }
    };

    switch (eventType) {
      case 'WORKOUT_COMPLETED':
        unlock('first-workout', 'First Blood', 'Completed your first workout.', '🏋️', 'bronze', 50);
        
        if (stats && stats.totalWorkouts >= 100) {
          unlock('workout-100', 'Century Club', 'Completed 100 workouts.', '💯', 'gold', 500);
        }
        break;
      
      case 'MEAL_LOGGED':
        unlock('first-meal', 'Nutritionist', 'Logged your first meal.', '🥗', 'bronze', 20);
        break;

      case 'DISTANCE_LOGGED':
        if (stats && stats.totalDistanceMeters >= 100000) { // 100 km
          unlock('distance-100k', 'Marathoner', 'Covered 100 km in total distance.', '🏃', 'gold', 500);
        }
        break;

      case 'STREAK_ACHIEVED':
        if (metadata.streakDays >= 7) {
          unlock('streak-7', 'Consistency is Key', 'Maintained a 7-day streak.', '🔥', 'silver', 100);
        }
        if (metadata.streakDays >= 30) {
          unlock('streak-30', 'Consistency King', 'Maintained a 30-day streak.', '👑', 'gold', 300);
        }
        break;
      
      case 'LEVEL_UP':
        if (metadata.newLevel >= 10) {
          unlock('level-10', 'Dedicated Athlete', 'Reached Level 10.', '⭐', 'silver', 150);
        }
        break;
    }
  }
}
