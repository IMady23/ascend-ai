import { UserSync } from "./user.sync";
import { MissionSync } from "./mission.sync";
import { ChapterSync } from "./chapter.sync";
import { ActivitySync } from "./activity.sync";
import { NutritionSync } from "./nutrition.sync";
import { JournalSync } from "./journal.sync";
import { NotificationSync } from "./notification.sync";
import { ProgressSync } from "./progress.sync";
import { ConversationSync } from "./conversation.sync";
import { DailyLogSync } from "./daily-log.sync";

let deferredSyncTimer: ReturnType<typeof setTimeout> | null = null;

export const SyncManager = {
  isSyncing: false,
  currentUserId: null as string | null,

  /**
   * Initializes real-time synchronization across all domains for the authenticated user.
   * Critical syncs (profile, nutrition, activity, daily log) start immediately.
   * Secondary syncs are deferred so the dashboard paints first.
   */
  startSync(userId: string) {
    this.stopSync();

    // Critical — needed for Mission Control metrics
    UserSync.start(userId);
    NutritionSync.subscribe(userId);
    DailyLogSync.subscribe(userId);
    ActivitySync.subscribe(userId);

    // Secondary — defer to keep first paint fast
    deferredSyncTimer = setTimeout(() => {
      if (this.currentUserId !== userId) return;
      MissionSync.subscribe(userId);
      ChapterSync.subscribe(userId);
      JournalSync.subscribe(userId);
      NotificationSync.subscribe(userId);
      ProgressSync.subscribe(userId);
      ConversationSync.subscribe(userId);
    }, 1500);

    this.currentUserId = userId;
    this.isSyncing = true;
    console.log(`[SyncManager] Real-time sync started for user: ${userId}`);
  },

  stopSync() {
    if (deferredSyncTimer) {
      clearTimeout(deferredSyncTimer);
      deferredSyncTimer = null;
    }
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
    console.log(`[SyncManager] Real-time sync stopped.`);
  }
};
