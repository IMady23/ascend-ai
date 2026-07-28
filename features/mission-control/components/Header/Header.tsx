"use client";

import { useUserStore } from "@/stores/user.store";
import { useChapterStore } from "@/stores/chapter.store";

export function Header() {
  const { profile, goals } = useUserStore();
  const { currentChapter } = useChapterStore();

  const greeting = "Good Morning, Mady";
  const currentWeight = profile?.weight || 0;
  // Mock day calculation based on some active goal state
  const dayNumber = 27; 
  const currentChapterNumber = 1; // Placeholder
  const currentChapterTitle = currentChapter?.title || "No Active Chapter";

  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
          {greeting}
        </h2>
        <p className="text-muted-foreground text-sm font-medium">
          Day {dayNumber}
        </p>
      </div>

      <div className="flex gap-4">
        <div className="bg-secondary/50 border border-border rounded-xl p-3 min-w-[120px]">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block mb-1">
            Current Weight
          </span>
          <span className="text-lg font-bold text-foreground">
            {currentWeight} kg
          </span>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 min-w-[120px]">
          <span className="text-xs text-primary uppercase tracking-wider font-semibold block mb-1">
            Chapter {currentChapterNumber}
          </span>
          <span className="text-lg font-bold text-primary truncate max-w-[150px] block">
            {currentChapterTitle}
          </span>
        </div>
      </div>
    </header>
  );
}
