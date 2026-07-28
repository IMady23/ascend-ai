import { Timestamp, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "firebase/firestore";

export interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  unlockedAt: Timestamp;
  metadata: Record<string, any>;
}

export const achievementConverter: FirestoreDataConverter<Achievement> = {
  toFirestore(achievement: Achievement): DocumentData {
    const { id, ...data } = achievement;
    return data;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Achievement {
    const data = snapshot.data(options);
    return { ...data, id: snapshot.id } as Achievement;
  }
};
