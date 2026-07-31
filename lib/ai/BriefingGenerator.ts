import { ContextBuilder } from "@/services/ai/context.builder";

import { useCommunicationStore } from "@/stores/communication.store";
import { CommunicationRepository } from "@/services/repositories/communication.repository";
import { useUserStore } from "@/stores/user.store";

import { NutritionCoach } from "@/lib/ai/NutritionCoach";
import { useNutritionStore } from "@/stores/nutrition.store";

export class BriefingGenerator {
  static async generateDailyBriefing() {
    const userId = useUserStore.getState().userId;
    if (!userId) return null;

    const hour = new Date().getHours();
    const type = hour < 12 ? 'MORNING_BRIEFING' : 'EVENING_BRIEFING';
    
    // Check if we already have one today
    const store = useCommunicationStore.getState();
    const todayStr = new Date().toISOString().split('T')[0];
    const alreadyExists = store.items.some(
      i => i.type === type && new Date(i.timestamp.seconds * 1000).toISOString().startsWith(todayStr)
    );

    if (alreadyExists) return null;

    // Use NutritionCoach instead of LLM simulation
    const nutritionState = useNutritionStore.getState();
    const userProfile = useUserStore.getState().profile;
    
    const progress = NutritionCoach.generateGoalProgress(
      nutritionState.dailyCalories,
      nutritionState.dailyProtein,
      nutritionState.dailyWaterMl,
      nutritionState.meals,
      userProfile
    );

    const generatedText = this.generateBriefingText(type, progress, userProfile);
      
    try {
      const item = {
        id: crypto.randomUUID(),
        userId,
        type,
        priority: 'HIGH' as const,
        title: type === 'MORNING_BRIEFING' ? 'Good Morning!' : 'Evening Summary',
        message: generatedText,
        icon: type === 'MORNING_BRIEFING' ? '🌅' : '🌙',
        isRead: false,
        timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
        action: { label: 'Start Day', route: '/' }
      };

      store.addItemLocal(item as any);
      await CommunicationRepository.addItem(userId, item as any);
      return item;
    } catch (e) {
      console.error("Failed to generate briefing", e);
      return null;
    }
  }

  private static generateBriefingText(type: string, progress: any, profile: any) {
    const dailyInsights = NutritionCoach.generateDailyInsights(progress);

    if (type === 'MORNING_BRIEFING') {
      return `Good morning! Your focus today is reaching ${progress.protein.target}g of protein and ${progress.water.target}L of water.\n\nNutrition Coach: ${dailyInsights}\n\nLet's make today count.`;
    } else {
      let reflection = "You stayed consistent today.";
      if (progress.calories.percentage > 100) reflection = "You were a bit over your calorie target today.";
      if (progress.protein.percentage >= 100) reflection = "Excellent work hitting your protein goal!";

      return `Evening Summary:\n\n${dailyInsights}\n\nCoach Reflection: ${reflection}`;
    }
  }
}
