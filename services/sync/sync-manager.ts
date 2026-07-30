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

export const SyncManager = {
  isSyncing: false,
  currentUserId: null as string | null,

  /**
   * Initializes real-time synchronization across all domains for the authenticated user.
   */
  startSync(userId: string) {
    if (this.currentUserId === userId && this.isSyncing) return;
    if (this.isSyncing && this.currentUserId !== userId) this.stopSync();

    UserSync.start(userId);
    MissionSync.subscribe(userId);
    ChapterSync.subscribe(userId);
    ActivitySync.subscribe(userId);
    NutritionSync.subscribe(userId);
    JournalSync.subscribe(userId);
    NotificationSync.subscribe(userId);
    ProgressSync.subscribe(userId);
    ConversationSync.subscribe(userId);

    this.currentUserId = userId;
    this.isSyncing = true;
    console.log(`[SyncManager] Real-time sync started for user: ${userId}`);
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
    JournalSync.dispose();
    NotificationSync.dispose();
    ProgressSync.dispose();
    ConversationSync.dispose();

    this.currentUserId = null;
    this.isSyncing = false;
    console.log(`[SyncManager] Real-time sync stopped.`);
  }
};
