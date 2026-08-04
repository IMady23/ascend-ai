import { UserSync } from "./user.sync";
import { MissionSync } from "./mission.sync";
import { ChapterSync } from "./chapter.sync";
import { ActivitySync } from "./activity.sync";
import { NutritionSync } from "./nutrition.sync";
import { JournalSync } from "./journal.sync";
import { NotificationSync } from "./notification.sync";
import { AiSync } from "./ai.sync";
import { ProgressSync } from "./progress.sync";
import { ConversationSync } from "./conversation.sync";
import { DailyLogSync } from "./daily-log.sync";

export const SyncManager = {
  isSyncing: false,
  currentUserId: null as string | null,

  /**
   * Initializes real-time synchronization across all domains for the authenticated user.
   */
  startSync(userId: string) {
    // Always dispose first to guarantee clean re-subscription.
    // Do NOT early-return on same userId — after a logout the subscriptions
    // were torn down and must be re-established even for the same user.
    this.stopSync();

    UserSync.start(userId);
    MissionSync.subscribe(userId);
    ChapterSync.subscribe(userId);
    ActivitySync.subscribe(userId);
    NutritionSync.subscribe(userId);
    DailyLogSync.subscribe(userId);
    JournalSync.subscribe(userId);
    NotificationSync.subscribe(userId);
    ProgressSync.subscribe(userId);
    ConversationSync.subscribe(userId);

    this.currentUserId = userId;
    this.isSyncing = true;
  },

  /**
   * Cleans up all active subscriptions. Should be called on logout.
   */
  stopSync() {
    if (!this.isSyncing) return;

    UserSync.stopForLogout();
    MissionSync.dispose();
    ChapterSync.dispose();
    ActivitySync.dispose();
    NutritionSync.dispose();
    DailyLogSync.dispose();
    JournalSync.dispose();
    NotificationSync.dispose();
    ProgressSync.dispose();
    ConversationSync.dispose();

    this.currentUserId = null;
    this.isSyncing = false;
  }
};
