"use client";

import { ArrowRight } from "lucide-react";
import { useChapterStore } from "@/stores/chapter.store";

export function ChapterCard() {
  const { currentChapter } = useChapterStore();
  
  const estimatedDaysRemaining = 12; // Placeholder computation
  const title = currentChapter?.title || "No Active Chapter";
  const percentageComplete = 45; // Placeholder since progress is not on Chapter type
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground text-lg">
          Chapter Progress
        </h3>
        <span className="text-sm font-medium text-muted-foreground">
          {estimatedDaysRemaining} days left
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            {title}
          </span>
          <span className="text-sm font-bold font-mono text-primary">
            {percentageComplete}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${percentageComplete}%` }}
          />
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:bg-primary/5 py-2.5 rounded-xl border border-primary/20 transition-colors">
        View Transformation <ArrowRight size={16} />
      </button>
    </div>
  );
}
