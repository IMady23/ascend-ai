"use client";

import { Target, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useChapterStore } from "@/stores/chapter.store";

export function NextObjective() {
  const { currentChapter } = useChapterStore();

  if (!currentChapter) {
    return (
      <div className="bg-gradient-to-r from-indigo-900/40 to-violet-900/40 border border-indigo-900/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-zinc-950/50 rounded-2xl backdrop-blur-sm hidden sm:block">
            <Target className="text-zinc-500" size={32} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-zinc-400 mb-2">
              Next Objective: Awaiting Assignment
            </h2>
            <p className="text-zinc-500 text-sm md:text-base">
              Start a new chapter to receive your next major objective.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm hidden sm:block">
          <Target className="text-white" size={32} />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            Next Objective: Maintain Momentum
          </h2>
          <p className="text-indigo-100 text-sm md:text-base">
            Complete your daily missions to progress in the {currentChapter.title} chapter.
          </p>
        </div>
      </div>
      
      <Link 
        href="/"
        className="w-full md:w-auto shrink-0 bg-white text-indigo-600 font-bold py-3 px-8 rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 group"
      >
        Go to Mission Control
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
