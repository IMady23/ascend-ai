"use client";

import { useChapterStore } from "@/stores/chapter.store";
import { Chapter } from "@/types/chapter";
import { Check, Lock, Play } from "lucide-react";

export function ChapterTimeline() {
  // Using chapters from store, mocking if empty for UI demonstration
  const storeChapters = useChapterStore((state) => state.chapters);
  const chapters = storeChapters && storeChapters.length > 0 ? storeChapters : MOCK_CHAPTER_TIMELINE;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-bold text-white mb-8">Journey Timeline</h2>
      
      <div className="relative pl-4 md:pl-8 border-l-2 border-zinc-800 space-y-8">
        {chapters.map((chapter, index) => {
          const isCompleted = chapter.status === "completed";
          const isActive = chapter.status === "in-progress";
          const isLocked = chapter.status === "not-started";

          return (
            <div key={chapter.id} className="relative group">
              {/* Timeline dot */}
              <div 
                className={`absolute -left-[21px] md:-left-[37px] top-1 w-10 h-10 rounded-full border-4 border-zinc-900 flex items-center justify-center transition-colors ${
                  isCompleted ? "bg-emerald-500" :
                  isActive ? "bg-indigo-500" :
                  "bg-zinc-800"
                }`}
              >
                {isCompleted && <Check size={16} className="text-zinc-950 font-bold" />}
                {isActive && <Play size={14} className="text-white ml-0.5" />}
                {isLocked && <Lock size={14} className="text-zinc-500" />}
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
                  "text-zinc-500"
                }`}>
                  {chapter.status.replace('-', ' ')}
                </span>
                
                <h3 className="text-lg font-semibold text-white mb-2">
                  {chapter.title}
                </h3>
                
                <p className="text-zinc-400 text-sm max-w-2xl">
                  {chapter.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const MOCK_CHAPTER_TIMELINE: Chapter[] = [
  {
    id: "ch-0",
    title: "Genesis",
    description: "The beginning of your transformation. Establishing baseline habits and setting up the environment for success.",
    status: "completed",
    startDate: null as any,
    endDate: null as any,
    tasksCompleted: 10,
    totalTasks: 10,
    createdAt: null as any
  },
  {
    id: "chapter-1",
    title: "The Awakening",
    description: "Your current active phase. Focusing on consistent physical output and mental resilience.",
    status: "in-progress",
    startDate: null as any,
    endDate: null as any,
    tasksCompleted: 4,
    totalTasks: 10,
    createdAt: null as any
  } as any,
  {
    id: "ch-2",
    title: "Momentum",
    description: "Accelerating progress. Intensity increases across all pillars of the Ascend protocol.",
    status: "not-started",
    startDate: null as any,
    endDate: null as any,
    tasksCompleted: 0,
    totalTasks: 15,
    createdAt: null as any
  } as any
];
