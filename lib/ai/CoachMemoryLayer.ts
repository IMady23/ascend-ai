import { useTimelineStore } from "@/stores/timeline.store";
import { useProgressionStore } from "@/stores/progression.store";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useActivityStore } from "@/stores/activity.store";

export class CoachMemoryLayer {
  static summarizeTimeline(): string {
    const { events } = useTimelineStore.getState();
    const progression = useProgressionStore.getState().profile;

    if (!progression || events.length === 0) {
      return "User just started their journey. No recent timeline events.";
    }

    // Grab the most recent events (e.g., last 10) for summary
    const recentEvents = events.slice(0, 10);
    
    // Count occurrences
    const workouts = recentEvents.filter(e => e.type === 'WORKOUT_COMPLETED').length;
    const proteinGoals = recentEvents.filter(e => e.type === 'MEAL_LOGGED' && e.title === 'Protein Goal Met').length;

    let summary = `User is currently at Level ${progression.xp.currentLevel} with a ${progression.streak.current}-day active streak. `;
    
    if (workouts > 0) {
      summary += `Recently completed ${workouts} workouts. `;
    }
    if (proteinGoals > 0) {
      summary += `Met protein goals ${proteinGoals} times recently. `;
    }

    // Check for major recent milestones (last 5 events)
    const recentMilestones = recentEvents.slice(0, 5).filter(e => e.type === 'LEVEL_UP' || e.type === 'ACHIEVEMENT_UNLOCKED');
    if (recentMilestones.length > 0) {
      summary += `User just achieved: ${recentMilestones.map(m => m.title).join(', ')}. Congratulate them!`;
    }

    return summary;
  }

  /**
   * Generates a rich contextual insight block for AI responses.
   * The AI uses this to produce specific, data-driven comments instead of generic praise.
   */
  static generateContextualInsight(): string {
    const { meals, dailyProtein, dailyCalories } = useNutritionStore.getState();
    const { dailySteps } = useActivityStore.getState();
    const today = new Date().toISOString().split('T')[0];

    // Calculate this week's daily protein values
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);
    const weekStartStr = weekStart.toISOString().split('T')[0];

    // Group protein by date for the past 7 days
    const proteinByDay: Record<string, number> = {};
    meals
      .filter(m => m.date && m.date >= weekStartStr)
      .forEach(m => {
        proteinByDay[m.date!] = (proteinByDay[m.date!] || 0) + (m.protein || 0);
      });

    const dayValues = Object.values(proteinByDay);
    const maxProteinThisWeek = dayValues.length > 0 ? Math.max(...dayValues) : 0;
    const todayProtein = proteinByDay[today] || dailyProtein;
    const isBestProteinDay = todayProtein > 0 && todayProtein >= maxProteinThisWeek;

    const insights: string[] = [];

    if (isBestProteinDay && todayProtein > 0) {
      insights.push(`Today's protein intake (${Math.round(todayProtein)}g) is the best this week — acknowledge this specifically.`);
    }

    if (dailyCalories > 0) {
      insights.push(`User has consumed ${Math.round(dailyCalories)} kcal today.`);
    }

    if (dailySteps > 0) {
      insights.push(`User has walked ${dailySteps.toLocaleString()} steps today.`);
    }

    if (insights.length === 0) return '';

    return `\n\nCONTEXTUAL INSIGHT (use this in your response, be specific not generic):\n${insights.join('\n')}`;
  }
}
