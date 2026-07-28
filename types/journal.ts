import { Timestamp, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "firebase/firestore";

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string | null;
  date: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const journalEntryConverter: FirestoreDataConverter<JournalEntry> = {
  toFirestore(entry: JournalEntry): DocumentData {
    const { id, ...data } = entry;
    return data;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): JournalEntry {
    const data = snapshot.data(options);
    return { ...data, id: snapshot.id } as JournalEntry;
  }
};
