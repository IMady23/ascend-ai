import { create } from "zustand";

interface UiState {
  isSidebarOpen: boolean;
  isDialogOpen: boolean;
  isBottomSheetOpen: boolean;
  isLoadingOverlayActive: boolean;
  toggleSidebar: (isOpen?: boolean) => void;
  setDialogOpen: (isOpen: boolean) => void;
  setBottomSheetOpen: (isOpen: boolean) => void;
  setLoadingOverlay: (isActive: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: false,
  isDialogOpen: false,
  isBottomSheetOpen: false,
  isLoadingOverlayActive: false,
  toggleSidebar: (isOpen) =>
    set((state) => ({
      isSidebarOpen: isOpen !== undefined ? isOpen : !state.isSidebarOpen,
    })),
  setDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),
  setBottomSheetOpen: (isOpen) => set({ isBottomSheetOpen: isOpen }),
  setLoadingOverlay: (isActive) => set({ isLoadingOverlayActive: isActive }),
}));
