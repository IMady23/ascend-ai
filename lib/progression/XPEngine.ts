import { AscendEvent } from "@/types/events";
import { eventBus } from "@/lib/events/EventBus";
import { XP_REWARDS } from "@/config/progression";
import { useProgressionStore } from "@/stores/progression.store";
import { useTimelineStore } from "@/stores/timeline.store";
import { TimelineRepository } from "@/services/repositories/timeline.repository";
import { TimelineEvent } from "@/types/progression";

export class XPEngine {
  constructor() {
    eventBus.subscribe('*', this.handleEvent.bind(this));
  }

  private async handleEvent(event: AscendEvent) {
    if (event.processed) return;

    let xpEarned = 0;
    let title = "";

    switch (event.type) {
      case 'WORKOUT_COMPLETED':
        xpEarned = XP_REWARDS.WORKOUT_COMPLETED;
        title = "Workout Completed";
        break;
      case 'MEAL_LOGGED':
        if ((event as any).metadata?.isGoalMet) {
          xpEarned = XP_REWARDS.MEAL_LOGGED;
          title = "Protein Goal Met";
        }
        break;
      case 'WATER_LOGGED':
        if ((event as any).metadata?.isGoalMet) {
          xpEarned = XP_REWARDS.WATER_GOAL;
          title = "Hydration Goal Met";
        }
        break;
      case 'MISSION_COMPLETED':
        xpEarned = (event as any).metadata?.xpReward || XP_REWARDS.MISSION_COMPLETED;
        title = "Mission Completed";
        break;
      case 'STREAK_ACHIEVED':
        if ((event as any).metadata?.streakDays === 7) {
          xpEarned = XP_REWARDS.STREAK_7_DAYS;
          title = "7-Day Streak";
        } else if ((event as any).metadata?.streakDays === 30) {
          xpEarned = XP_REWARDS.STREAK_7_DAYS * 3;
          title = "30-Day Streak";
        }
        break;
    }

    if (xpEarned > 0) {
      const store = useProgressionStore.getState();
      const oldLevel = store.profile?.xp.currentLevel || 1;
      
      await store.addXP(xpEarned);
      await this.logToTimeline(event, title, xpEarned);

      eventBus.dispatch({
        id: crypto.randomUUID(),
        userId: event.userId,
        type: 'XP_GAINED',
        timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
        metadata: { amount: xpEarned, reason: title },
        processed: false
      });

      const newLevel = useProgressionStore.getState().profile?.xp.currentLevel || 1;
      if (newLevel > oldLevel) {
        eventBus.dispatch({
          id: crypto.randomUUID(),
          userId: event.userId,
          type: 'LEVEL_UP',
          timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
          metadata: { newLevel },
          processed: false
        });
      }
    }
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
}

export const xpEngine = new XPEngine();
