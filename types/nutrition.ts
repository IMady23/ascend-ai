import { Timestamp, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "firebase/firestore";

export interface NutritionLog {
  id: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: Timestamp;
  createdAt: Timestamp;
}

export const nutritionLogConverter: FirestoreDataConverter<NutritionLog> = {
  toFirestore(log: NutritionLog): DocumentData {
    const { id, ...data } = log;
    return data;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): NutritionLog {
    const data = snapshot.data(options);
    return { ...data, id: snapshot.id } as NutritionLog;
  }
};
