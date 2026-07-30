import { useTimelineStore } from "@/stores/timeline.store";
import { useProgressionStore } from "@/stores/progression.store";

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
}
