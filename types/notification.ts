import { Timestamp, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "firebase/firestore";

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: string; // e.g., 'reminder', 'system', 'achievement'
  read: boolean;
  link: string | null;
  createdAt: Timestamp;
}

export const notificationConverter: FirestoreDataConverter<Notification> = {
  toFirestore(notification: Notification): DocumentData {
    const { id, ...data } = notification;
    return data;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Notification {
    const data = snapshot.data(options);
    return { ...data, id: snapshot.id } as Notification;
  }
};
