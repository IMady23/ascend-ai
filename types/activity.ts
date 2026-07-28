import { Timestamp, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "firebase/firestore";

export interface Activity {
  id: string;
  type: string; // e.g., 'running', 'lifting', 'meditation'
  durationMinutes: number;
  caloriesBurned: number | null;
  metrics: Record<string, any>; // Flexible for different activity types
  date: Timestamp;
  createdAt: Timestamp;
}

export const activityConverter: FirestoreDataConverter<Activity> = {
  toFirestore(activity: Activity): DocumentData {
    const { id, ...data } = activity;
    return data;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Activity {
    const data = snapshot.data(options);
    return { ...data, id: snapshot.id } as Activity;
  }
};
