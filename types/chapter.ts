import { Timestamp, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "firebase/firestore";

export interface Chapter {
  id: string;
  title: string;
  description: string;
  status: "not-started" | "in-progress" | "completed";
  startDate: Timestamp | null;
  endDate: Timestamp | null;
  tasksCompleted: number;
  totalTasks: number;
  createdAt: Timestamp;
}

export const chapterConverter: FirestoreDataConverter<Chapter> = {
  toFirestore(chapter: Chapter): DocumentData {
    const { id, ...data } = chapter;
    return data;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Chapter {
    const data = snapshot.data(options);
    return { ...data, id: snapshot.id } as Chapter;
  }
};
