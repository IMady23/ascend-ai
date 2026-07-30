import { RecoveryProfile, RecoveryState } from "@/types/recovery";

export interface ScheduledEvent {
  id: string;
  type: 'workout' | 'meal' | 'rest' | 'conflict';
  title: string;
  date: string;
  status: 'planned' | 'completed' | 'missed';
  metadata?: Record<string, any>;
}

export interface AdaptivePlan {
  originalWorkout: string;
  recommendedAlternatives: {
    title: string;
    type: 'light_workout' | 'mobility' | 'rest' | 'recovery_walk';
    reason: string;
  }[];
}

export class AdaptiveWorkoutPlanner {

  static evaluatePlan(recovery: RecoveryProfile, scheduledWorkout: string): AdaptivePlan | null {
    if (recovery.state === 'Excellent' || recovery.state === 'Good') {
      return null; // Proceed as planned
    }

    // High fatigue detected, generate Smart Alternatives
    const alternatives = [];
    
    if (recovery.state === 'Moderate') {
      alternatives.push({
        title: `${scheduledWorkout} (Light)`,
        type: 'light_workout' as const,
        reason: "Maintain consistency but reduce volume by 30% to support recovery."
      });
      alternatives.push({
        title: "Mobility Session",
        type: 'mobility' as const,
        reason: "Active recovery to improve blood flow without adding central nervous system stress."
      });
    }

    if (recovery.state === 'Fatigued' || recovery.state === 'Overtrained') {
      alternatives.push({
        title: "Rest Day",
        type: 'rest' as const,
        reason: "Your acute training load is very high. A full rest day is highly recommended."
      });
      alternatives.push({
        title: "Recovery Walk",
        type: 'recovery_walk' as const,
        reason: "Light zone 1 cardio to aid recovery without breaking down muscle."
      });
    }

    return {
      originalWorkout: scheduledWorkout,
      recommendedAlternatives: alternatives
    };
  }

  static detectConflicts(events: ScheduledEvent[]): string[] {
    const conflicts: string[] = [];
    
    // Example logic: if a heavy workout is scheduled on the same day as a "Travel" event
    const travelDays = events.filter(e => e.type === 'conflict' && e.title.toLowerCase().includes('travel'));
    
    for (const travel of travelDays) {
      const workoutOnTravelDay = events.find(e => e.type === 'workout' && e.date === travel.date);
      if (workoutOnTravelDay) {
        conflicts.push(`You have a heavy ${workoutOnTravelDay.title} scheduled on ${travel.date}, which is a travel day. Would you like me to shift it?`);
      }
    }
    
    return conflicts;
  }
}
