"use client";

import { useChapterStore } from "@/stores/chapter.store";
import { Chapter } from "@/types/chapter";
import { Check, Lock, Play } from "lucide-react";

export function ChapterTimeline() {
  const chapters = useChapterStore((state) => state.chapters);

  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-bold text-primary mb-8">Journey Timeline</h2>
      
      {chapters.length === 0 ? (
        <div className="text-center p-8 text-secondary">
          <p>No chapters unlocked yet.</p>
        </div>
      ) : (
        <div className="relative pl-4 md:pl-8 border-l-2 border-border-subtle space-y-8">
          {chapters.map((chapter) => {
            const isCompleted = chapter.status === "completed";
            const isActive = chapter.status === "in-progress";
            const isLocked = chapter.status === "not-started";

            return (
              <div key={chapter.id} className="relative group">
                {/* Timeline dot */}
                <div 
                  className={`absolute -left-[21px] md:-left-[37px] top-1 w-10 h-10 rounded-full border-4 border-border-subtle flex items-center justify-center transition-colors ${
                    isCompleted ? "bg-emerald-500" :
                    isActive ? "bg-indigo-500" :
                    "bg-surface-elevated"
                  }`}
                >
                  {isCompleted && <Check size={16} className="text-zinc-950 font-bold" />}
                  {isActive && <Play size={14} className="text-primary ml-0.5" />}
                  {isLocked && <Lock size={14} className="text-secondary" />}
                </div>

                {/* Content */}
                <div className={`transition-all duration-300 ${
                  isCompleted ? "opacity-100" :
                  isActive ? "opacity-100" :
                  "opacity-50"
                }`}>
                  <span className={`text-xs font-bold uppercase tracking-wider mb-1 block ${
                    isCompleted ? "text-emerald-500" :
                    isActive ? "text-indigo-400" :
                    "text-secondary"
                  }`}>
                    {chapter.status.replace('-', ' ')}
                  </span>
                  
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    {chapter.title}
                  </h3>
                  
                  <p className="text-secondary text-sm max-w-2xl">
                    {chapter.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
