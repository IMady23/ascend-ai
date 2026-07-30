import { AscendEvent } from "@/types/events";

export type EventPriority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';

export interface ProactiveEvent {
  id: string;
  type: string;
  priority: EventPriority;
  context: any;
  timestamp: Date;
}

export class PriorityFilter {
  static assignPriority(event: AscendEvent): EventPriority {
    if (event.type === 'RECOVERY_CRITICAL' || event.type === 'SYNC_FAILED') return 'CRITICAL';
    if (event.type === 'PLATEAU_DETECTED' || event.type === 'WORKOUT_MISSED') return 'HIGH';
    if (event.type === 'WORKOUT_COMPLETED' || event.type === 'PROTEIN_LOW') return 'NORMAL';
    return 'LOW'; // Missions, XP, general logging
  }
}

export class CooldownManager {
  private static lastConversationTime: Record<string, number> = {};

  static canInitiate(userId: string, priority: EventPriority): boolean {
    const now = Date.now();
    const last = this.lastConversationTime[userId] || 0;
    
    // Cooldown logic based on priority
    if (priority === 'CRITICAL') return true; // Always allow
    
    if (priority === 'HIGH') {
      // 15 minute cooldown
      return (now - last) > (15 * 60 * 1000);
    }
    
    if (priority === 'NORMAL') {
      // 4 hour cooldown
      return (now - last) > (4 * 60 * 60 * 1000);
    }
    
    return false; // LOW priority events wait for Daily Briefing
  }

  static recordConversation(userId: string) {
    this.lastConversationTime[userId] = Date.now();
  }
}

export class ProactiveCoachEngine {
  
  static handleEvent(userId: string, event: AscendEvent) {
    const priority = PriorityFilter.assignPriority(event);
    
    // Bundle LOW and skip if on cooldown
    if (!CooldownManager.canInitiate(userId, priority)) {
      this.queueForBriefing(userId, event);
      return;
    }

    // AI initiates conversation
    this.initiateConversation(userId, event, priority);
    CooldownManager.recordConversation(userId);
  }

  private static queueForBriefing(userId: string, event: AscendEvent) {
    // Stores the event to be bundled into the Morning/Evening Briefing
    console.log(`Queued for briefing: ${event.type}`);
  }

  private static initiateConversation(userId: string, event: AscendEvent, priority: EventPriority) {
    // Hook into the AI service to push a message to the user's Chat UI
    // The "Why?" and "Suggested Action" are handled by the LLM prompt.
    console.log(`Initiating proactive conversation for ${event.type} [Priority: ${priority}]`);
  }
}
