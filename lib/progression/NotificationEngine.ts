import { AscendEvent } from "@/types/events";
import { CommunicationItem, CommunicationType, NotificationPriority } from "@/types/communication";
import { useCommunicationStore } from "@/stores/communication.store";
import { CommunicationRepository } from "@/services/repositories/communication.repository";

export class NotificationEngine {
  
  // A simple queue to bundle related events (e.g. within 500ms)
  private static eventQueue: AscendEvent[] = [];
  private static bundleTimeout: NodeJS.Timeout | null = null;

  static async evaluateEvent(event: AscendEvent) {
    const { RulesEngine } = await import("@/lib/automation/RulesEngine");
    const shouldNotify = await RulesEngine.shouldNotify(event);
    if (!shouldNotify) return;

    this.eventQueue.push(event);
    
    if (!this.bundleTimeout) {
      this.bundleTimeout = setTimeout(() => {
        this.processBundle();
      }, 500); // 500ms bundling window
    }
  }

  private static processBundle() {
    this.bundleTimeout = null;
    const events = [...this.eventQueue];
    this.eventQueue = [];

    if (events.length === 0) return;

    // Check for specific bundles
    const workouts = events.filter(e => e.type === 'WORKOUT_COMPLETED');
    const meals = events.filter(e => e.type === 'MEAL_LOGGED');
    const levelUps = events.filter(e => e.type === 'LEVEL_UP');
    const missions = events.filter(e => e.type === 'MISSION_COMPLETED');
    const achievements = events.filter(e => e.type === 'ACHIEVEMENT_UNLOCKED');

    // Bundling Logic Example
    if (meals.length > 0 && meals.some(m => (m.metadata as any)?.isGoalMet)) {
      const metadata = meals[0].metadata as any;
      this.dispatchNotification(
        events[0].userId,
        'NOTIFICATION',
        'NORMAL',
        'Protein Goal Reached 🎯',
        `You hit your daily protein goal! (+${metadata.protein}g) +40 XP`,
        '🍽️',
        { label: 'View Progress', route: '/progress' }
      );
    } else if (meals.length > 0) {
      const metadata = meals[0].metadata as any;
      this.dispatchNotification(
        events[0].userId,
        'NOTIFICATION',
        'NORMAL',
        'Meal Logged 🍽️',
        `Protein +${metadata.protein}g • ${metadata.calories} kcal`,
        '🍽️',
        { label: 'View Nutrition', route: '/nutrition' }
      );
    }

    if (workouts.length > 0) {
      this.dispatchNotification(
        events[0].userId,
        'NOTIFICATION',
        'NORMAL',
        'Workout Completed',
        `Great job completing your workout! +120 XP`,
        '💪',
        { label: 'View Activity', route: '/' }
      );
    }

    if (levelUps.length > 0) {
      this.dispatchNotification(
        events[0].userId,
        'ACHIEVEMENT',
        'HIGH',
        'Level Up!',
        `Congratulations! You reached Level ${(levelUps[0].metadata as any).newLevel}.`,
        '⭐',
        { label: 'View Progress', route: '/progress' }
      );
    }

    if (achievements.length > 0) {
      this.dispatchNotification(
        events[0].userId,
        'ACHIEVEMENT',
        'HIGH',
        'Achievement Unlocked',
        `You unlocked a new achievement!`,
        '🏆',
        { label: 'View Gallery', route: '/progress' }
      );
    }
  }

  private static dispatchNotification(
    userId: string, 
    type: CommunicationType, 
    priority: NotificationPriority, 
    title: string, 
    message: string, 
    icon: string, 
    action?: { label: string, route: string }
  ) {
    const item: CommunicationItem = {
      id: crypto.randomUUID(),
      userId,
      type,
      priority,
      title,
      message,
      icon,
      isRead: false,
      timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
      action
    };

    useCommunicationStore.getState().addItemLocal(item);
    CommunicationRepository.addItem(userId, item).catch(console.error);

    // Also show a smart toast if priority is normal or higher
    if (priority !== 'SILENT' && priority !== 'LOW') {
      import('@/stores/toast.store').then(m => {
        m.useToastStore.getState().addToast({
          type: priority === 'CRITICAL' ? 'warning' : priority === 'HIGH' ? 'success' : 'info',
          title,
          message,
          duration: priority === 'CRITICAL' ? 10000 : 5000,
          action: action ? {
            label: action.label,
            onClick: () => {
              // Soft navigation would require a router instance here
              // For now, we will handle this via event or context
              window.location.href = action.route;
            }
          } : undefined
        } as any);
      });
    }
  }
}
