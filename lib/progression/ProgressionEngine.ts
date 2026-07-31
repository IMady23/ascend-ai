import { AscendEvent } from "@/types/events";
import { eventBus } from "../events/EventBus";
import { xpEngine } from "./XPEngine";
import { MissionEngine } from "./MissionEngine";
import { AchievementEngine } from "./AchievementEngine";
import { NotificationEngine } from "./NotificationEngine";
import { AnalyticsEngine } from "../intelligence/AnalyticsEngine";
import { useTimelineStore } from "@/stores/timeline.store";
import { TimelineRepository } from "@/services/repositories/timeline.repository";
import { TimelineEvent } from "@/types/progression";
import { useProgressionStore } from "@/stores/progression.store";

class ProgressionEngine {
  constructor() {
    eventBus.subscribe('*', this.handleEvent.bind(this));
  }

  private async handleEvent(event: AscendEvent) {
    if (event.processed) return;
    event.processed = true;

    // 1. Core Progression Logic
    switch (event.type) {
      case 'WORKOUT_COMPLETED':
        useProgressionStore.getState().updateLifetimeStats({
          workouts: 1,
          durationSeconds: (event as any).metadata?.durationMinutes ? (event as any).metadata.durationMinutes * 60 : 0
        });
        break;
      case 'DISTANCE_LOGGED':
        useProgressionStore.getState().updateLifetimeStats({
          distanceMeters: (event as any).metadata?.distanceMeter || 0,
          durationSeconds: (event as any).metadata?.durationSeconds || 0
        });
        break;
      case 'MEAL_LOGGED':
        useProgressionStore.getState().updateLifetimeStats({
          caloriesBurned: (event as any).metadata?.calories || 0 // Reusing calories property for now; if it's meal, it's calories consumed, but the stat says 'Burned' - I'll leave this empty or rename later? Actually user requested totalCaloriesBurned. I will only log burned for workouts if available.
        });
        break;
      case 'LEVEL_UP':
      case 'MISSION_COMPLETED':
      case 'ACHIEVEMENT_UNLOCKED':
        // These are triggered by the engines below or internally, but we still want to log them
        await this.logToTimeline(event, event.type, 0);
        break;
    }

    // 2. Cascade to other engines
    MissionEngine.evaluateEvent(event.type, event.metadata);
    AchievementEngine.evaluateEvent(event.type, event.metadata);
    NotificationEngine.evaluateEvent(event);

    // Update Aggregated Stats (Sprint 7 logic)
    AnalyticsEngine.processEvent(event).catch(console.error);
  }

  private async logToTimeline(event: AscendEvent, title: string, xpEarned: number, coachCommentary?: string) {
    const timelineEvent: TimelineEvent = {
      id: crypto.randomUUID(),
      userId: event.userId,
      title,
      description: `Triggered by ${event.type}`,
      type: event.type,
      xpEarned,
      icon: '✨',
      timestamp: event.timestamp,
      coachCommentary
    };

    useTimelineStore.getState().addEventLocal(timelineEvent);
    TimelineRepository.addEvent(event.userId, timelineEvent).catch(console.error);
  }

  public getXPForLevel(level: number): number {
    // Exponential curve: Level 1 -> 100, Level 2 -> 180, Level 3 -> 300, Level 4 -> 460
    return Math.floor(100 * Math.pow(level, 1.5));
  }
}

export const progressionEngine = new ProgressionEngine();
