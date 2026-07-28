import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Notification, notificationConverter } from "@/types/notification";
import { handleFirestoreError } from "./error-handler";

export const NotificationRepository = {
  getCollectionRef(userId: string) {
    return collection(firestore, `users/${userId}/notifications`).withConverter(notificationConverter);
  },

  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const q = query(this.getCollectionRef(userId), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
      handleFirestoreError(error, `fetching notifications for user ${userId}`);
    }
  },

  subscribeToNotifications(userId: string, onUpdate: (notifications: Notification[]) => void, onError: (error: Error) => void): () => void {
    const q = query(this.getCollectionRef(userId), orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snapshot) => {
        onUpdate(snapshot.docs.map((doc) => doc.data()));
      },
      (error) => {
        onError(error);
      }
    );
  },

  async createNotification(userId: string, notification: Notification): Promise<void> {
    try {
      const docRef = doc(this.getCollectionRef(userId), notification.id);
      await setDoc(docRef, notification);
    } catch (error) {
      handleFirestoreError(error, `creating notification ${notification.id} for user ${userId}`);
    }
  },

  async updateNotification(userId: string, notificationId: string, data: Partial<Notification>): Promise<void> {
    try {
      const docRef = doc(this.getCollectionRef(userId), notificationId);
      await updateDoc(docRef, data);
    } catch (error) {
      handleFirestoreError(error, `updating notification ${notificationId} for user ${userId}`);
    }
  },

  async deleteNotification(userId: string, notificationId: string): Promise<void> {
    try {
      const docRef = doc(this.getCollectionRef(userId), notificationId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, `deleting notification ${notificationId} for user ${userId}`);
    }
  },
};
