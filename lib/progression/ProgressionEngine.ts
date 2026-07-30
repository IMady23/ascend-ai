import { AscendEvent } from "@/types/events";
import { eventBus } from "../events/EventBus";
import { MissionEngine } from "./MissionEngine";
import { AchievementEngine } from "./AchievementEngine";
import { NotificationEngine } from "./NotificationEngine";
import { StatsAggregator } from "../intelligence/StatsAggregator";
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
        await this.processWorkout(event as any);
        break;
      case 'MEAL_LOGGED':
        await this.processMeal(event as any);
        break;
      case 'WATER_LOGGED':
        await this.processWater(event as any);
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
    StatsAggregator.processEvent(event).catch(console.error);
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

  private async processWorkout(event: AscendEvent) {
    const xpEarned = 120;
    const store = useProgressionStore.getState();
    const oldLevel = store.profile?.xp.currentLevel || 1;
    
    await store.addXP(xpEarned);
    await this.logToTimeline(event, "Workout Completed", xpEarned);

    const newLevel = useProgressionStore.getState().profile?.xp.currentLevel || 1;
    if (newLevel > oldLevel) {
      eventBus.dispatch({
        id: crypto.randomUUID(),
        userId: event.userId,
        type: 'LEVEL_UP',
        timestamp: event.timestamp,
        metadata: { newLevel },
        processed: false
      });
    }
  }

  private async processMeal(event: AscendEvent) {
    if ((event as any).metadata?.isGoalMet) {
      const xpEarned = 40;
      await useProgressionStore.getState().addXP(xpEarned);
      await this.logToTimeline(event, "Protein Goal Met", xpEarned);
    }
  }

  private async processWater(event: AscendEvent) {
    if ((event as any).metadata?.isGoalMet) {
      const xpEarned = 10;
      await useProgressionStore.getState().addXP(xpEarned);
      await this.logToTimeline(event, "Hydration Goal Met", xpEarned);
    }
  }

  public getXPForLevel(level: number): number {
    // Exponential curve: Level 1 -> 100, Level 2 -> 180, Level 3 -> 300, Level 4 -> 460
    return Math.floor(100 * Math.pow(level, 1.5));
  }
}

export const progressionEngine = new ProgressionEngine();
