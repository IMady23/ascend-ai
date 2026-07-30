import { ContextBuilder } from "./context.builder";
import { AiService } from "@/services/ai/ai.service";
import { useCommunicationStore } from "@/stores/communication.store";
import { CommunicationRepository } from "@/services/repositories/communication.repository";
import { useUserStore } from "@/stores/user.store";

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

    const contextSnapshot = ContextBuilder.build(type.toLowerCase());
    
    let prompt = "";
    if (type === 'MORNING_BRIEFING') {
      prompt = `Generate a highly personalized Morning Briefing as an AI Fitness Coach. 
      Do NOT output JSON. Output a structured, motivating text.
      Include:
      1. A short greeting (e.g., "Good morning!")
      2. Recovery score/status
      3. Today's focus
      4. Workout recommendation
      5. Nutrition & Hydration targets
      6. Active mission
      7. Coach insight
      8. End with one concrete recommendation.
      
      Context: ${JSON.stringify(contextSnapshot)}`;
    } else {
      prompt = `Generate a highly personalized Evening Briefing as an AI Fitness Coach. 
      Do NOT output JSON. Output a structured, reflective text.
      Include:
      1. Today's Wins (what they did well)
      2. Areas to Improve
      3. Progress (XP earned, etc.)
      4. Tomorrow's Focus
      5. Coach Reflection (e.g., "You stayed consistent today...")
      
      Context: ${JSON.stringify(contextSnapshot)}`;
    }

    try {
      // For V1, we simulate the LLM call or hit our actual OpenRouter endpoint.
      // Assuming aiService.getCoachingResponse could handle raw text if we adjusted it, 
      // but let's simulate the generation for now to ensure reliability during the freeze.
      const generatedText = await this.simulateLLM(prompt, type);
      
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

      store.addItemLocal(item);
      await CommunicationRepository.addItem(userId, item);
      return item;
    } catch (e) {
      console.error("Failed to generate briefing", e);
      return null;
    }
  }

  private static async simulateLLM(prompt: string, type: string) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (type === 'MORNING_BRIEFING') {
      return `Recovery: Good\n\nToday's Workout: Pull Day\nProtein Goal: 160g\nWater Goal: 3L\n\nYour focus today is completing your upper-body workout and reaching 160g of protein. Those two actions will move you closest to your weekly goal. Let's make today count.`;
    } else {
      return `Today's Wins: You logged all your meals and hit your protein target.\nAreas to Improve: You missed your daily hydration goal.\n\nYou stayed consistent today by meeting your calorie target. Tomorrow, prioritizing hydration will help support recovery. Keep it up!`;
    }
  }
}
