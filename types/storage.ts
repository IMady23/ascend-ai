import { Timestamp, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "firebase/firestore";

export interface ProgressPhoto {
  id: string;
  url: string;
  userId: string;
  storagePath: string;
  caption?: string;
  weight?: number; // kg
  chapterId?: string;
  uploadedAt: Timestamp;
}

export interface AvatarMetadata {
  url: string;
  storagePath: string;
  updatedAt: Timestamp;
}

// Future attachment types
export interface AttachmentMetadata {
  id: string;
  url: string;
  userId: string;
  storagePath: string;
  context: "ai" | "meal" | "workout" | "badge";
  uploadedAt: Timestamp;
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
