import { Timestamp, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "firebase/firestore";

export interface Streak {
  id: string; // The streak type e.g., 'login', 'workout'
  type: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Timestamp;
  updatedAt: Timestamp;
}

export const streakConverter: FirestoreDataConverter<Streak> = {
  toFirestore(streak: Streak): DocumentData {
    const { id, ...data } = streak;
    return data;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Streak {
    const data = snapshot.data(options);
    return { ...data, id: snapshot.id } as Streak;
  }
};
