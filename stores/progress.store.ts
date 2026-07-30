import { create } from "zustand";
import type { ProgressPhoto } from "@/types/storage";

interface ProgressState {
  photos: ProgressPhoto[];
  isLoading: boolean;
  setPhotos: (photos: ProgressPhoto[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  photos: [],
  isLoading: true,
  setPhotos: (photos) => set({ photos }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
