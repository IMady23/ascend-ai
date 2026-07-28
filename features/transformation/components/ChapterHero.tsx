"use client";

import { useChapterStore } from "@/stores/chapter.store";
import { Flag } from "lucide-react";

export function ChapterHero() {
  const chapter = useChapterStore((state) => state.currentChapter);

  if (!chapter) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
        <p className="text-zinc-400">No active chapter found.</p>
      </div>
    );
  }

  const progress = chapter.totalTasks > 0 
    ? Math.round((chapter.tasksCompleted / chapter.totalTasks) * 100) 
    : 0;

  return (
    <section className="bg-gradient-to-br from-indigo-900/40 to-black border border-indigo-900/50 rounded-2xl p-6 md:p-10 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-medium mb-2">
            <Flag size={16} />
            <span className="uppercase tracking-wider text-xs font-bold">Active Chapter</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {chapter.title}
          </h1>
          <p className="text-zinc-400 max-w-xl text-sm md:text-base leading-relaxed">
            {chapter.description || "Embrace the journey. Every step counts towards your ultimate transformation."}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end min-w-[120px]">
          <span className="text-4xl md:text-5xl font-black text-white font-mono tracking-tighter">
            {progress}%
          </span>
          <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider">
            Completed
          </span>
        </div>
      </div>

      <div className="mt-8 w-full bg-zinc-900/80 rounded-full h-3 overflow-hidden border border-zinc-800/50 relative z-10">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  );
}
