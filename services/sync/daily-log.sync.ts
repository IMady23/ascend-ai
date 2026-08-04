import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { useActivityStore } from "@/stores/activity.store";
import { dailyLogConverter } from "@/types/daily-log";

let unsubscribe: (() => void) | null = null;

/**
 * DailyLogSync — subscribes to the daily_log document for today.
 *
 * Steps are written via DailyLogRepository.updateDailyLog() to
 * users/{uid}/daily_logs/{dateStr}. After login, this sync reads that
 * document back and dispatches the steps count to the activity store,
 * guaranteeing steps survive logout/login cycles.
 */
export const DailyLogSync = {
  subscribe(userId: string) {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const docRef = doc(
      firestore,
      "users",
      userId,
      "daily_logs",
      todayStr
    ).withConverter(dailyLogConverter);

    unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const steps = data.steps ?? 0;
          // Update store WITHOUT re-triggering a Firestore write
          // (use setState directly to skip the setDailySteps side-effects)
          useActivityStore.setState({ dailySteps: steps });
        }
      },
      (error) => {
        console.error("[DailyLogSync] Failed to sync daily log:", error);
      }
    );
  },

  dispose() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  },
};
