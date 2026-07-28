"use client";

import { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
      {children}
    </main>
  );
}
