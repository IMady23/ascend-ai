"use client";

import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Setup future global providers here (e.g., Theme, Zustand, Firebase, etc.)
  return <>{children}</>;
}
