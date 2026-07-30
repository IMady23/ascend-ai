import { onSnapshot, query, orderBy } from "firebase/firestore";
import { StorageRepository } from "@/services/repositories/storage.repository";
import { useProgressStore } from "@/stores/progress.store";

let unsubscribe: (() => void) | null = null;

export const ProgressSync = {
  subscribe(userId: string) {
    if (unsubscribe) {
      unsubscribe();
    }

    useProgressStore.getState().setIsLoading(true);

    const q = query(StorageRepository.getProgressPhotosRef(userId), orderBy("uploadedAt", "desc"));
    
    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const photos = snapshot.docs.map((doc) => doc.data());
        useProgressStore.getState().setPhotos(photos);
        useProgressStore.getState().setIsLoading(false);
      },
      (error) => {
        console.error("Failed to sync progress photos:", error);
        useProgressStore.getState().setIsLoading(false);
      }
    );
  },

  dispose() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  }
};
