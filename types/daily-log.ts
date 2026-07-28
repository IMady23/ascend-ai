import { Timestamp, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "firebase/firestore";

export interface DailyLog {
  id: string; // The date string e.g., '2026-07-27'
  date: string;
  mood: number; // 1-5
  energy: number; // 1-5
  sleepHours: number;
  notes: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const dailyLogConverter: FirestoreDataConverter<DailyLog> = {
  toFirestore(log: DailyLog): DocumentData {
    const { id, ...data } = log;
    return data;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): DailyLog {
    const data = snapshot.data(options);
    return { ...data, id: snapshot.id } as DailyLog;
  }
};
