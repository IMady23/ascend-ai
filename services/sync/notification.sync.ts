import { NotificationRepository } from "@/services/repositories";
import { useNotificationStore } from "@/stores/notification.store";
import { Notification } from "@/types/notification";

let unsubscribe: (() => void) | null = null;

export const NotificationSync = {
  subscribe(userId: string) {
    if (unsubscribe) {
      unsubscribe();
    }

    unsubscribe = NotificationRepository.subscribeToNotifications(
      userId,
      (notifications: Notification[]) => {
        useNotificationStore.getState().setNotifications(notifications);
      },
      (error) => {
        console.error("Failed to sync notifications:", error);
      }
    );
  },

  dispose() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  }
};
