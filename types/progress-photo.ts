import { Timestamp, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "firebase/firestore";

export interface ProgressPhoto {
  id: string;
  photoUrl: string;
  date: Timestamp;
  weight: number | null;
  notes: string | null;
  createdAt: Timestamp;
}

export const progressPhotoConverter: FirestoreDataConverter<ProgressPhoto> = {
  toFirestore(photo: ProgressPhoto): DocumentData {
    const { id, ...data } = photo;
    return data;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): ProgressPhoto {
    const data = snapshot.data(options);
    return { ...data, id: snapshot.id } as ProgressPhoto;
  }
};
