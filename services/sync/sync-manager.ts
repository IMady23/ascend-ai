import { UserSync } from "./user.sync";
import { MissionSync } from "./mission.sync";
import { ChapterSync } from "./chapter.sync";
import { ActivitySync } from "./activity.sync";
import { NutritionSync } from "./nutrition.sync";
import { JournalSync } from "./journal.sync";
import { NotificationSync } from "./notification.sync";
import { AiSync } from "./ai.sync";

export const SyncManager = {
  /**
   * Initializes real-time synchronization across all domains for the authenticated user.
   */
  startSync(userId: string) {
    UserSync.subscribe(userId);
    MissionSync.subscribe(userId);
    ChapterSync.subscribe(userId);
    ActivitySync.subscribe(userId);
    NutritionSync.subscribe(userId);
    JournalSync.subscribe(userId);
    NotificationSync.subscribe(userId);
    AiSync.subscribe(userId);
  },

  /**
   * Cleans up all active subscriptions. Should be called on logout.
   */
  stopSync() {
    UserSync.dispose();
    MissionSync.dispose();
    ChapterSync.dispose();
    ActivitySync.dispose();
    NutritionSync.dispose();
    JournalSync.dispose();
    NotificationSync.dispose();
    AiSync.dispose();
  }
};
