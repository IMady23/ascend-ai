import { useProgressionStore } from "@/stores/progression.store";

export class AchievementEngine {
  
  static evaluateEvent(eventType: string, metadata: any) {
    // Basic achievement logic
    if (eventType === 'STREAK_ACHIEVED' && metadata.streakDays === 30) {
      useProgressionStore.getState().unlockAchievement({
        id: 'streak-30',
        title: 'Consistency King',
        description: 'Maintained a 30 day active streak.',
        icon: '🔥',
        unlockedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
        tier: 'gold'
      });
    }

    if (eventType === 'LEVEL_UP' && metadata.newLevel === 10) {
      useProgressionStore.getState().unlockAchievement({
        id: 'level-10',
        title: 'Dedicated Athlete',
        description: 'Reached Level 10.',
        icon: '⭐',
        unlockedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
        tier: 'silver'
      });
    }
  }
}
