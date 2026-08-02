"use client";

import { Target, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useChapterStore } from "@/stores/chapter.store";

export function NextObjective() {
  const { currentChapter } = useChapterStore();

  if (!currentChapter) {
    return (
      <div className="bg-gradient-to-r from-[var(--color-accent-indigo)]/40 to-[var(--color-accent-purple)]/40 border border-[var(--color-accent-indigo)]/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-base/50 rounded-2xl backdrop-blur-sm hidden sm:block">
            <Target className="text-secondary" size={32} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-secondary mb-2">
              Next Objective: Awaiting Assignment
            </h2>
            <p className="text-secondary text-sm md:text-base">
              Start a new chapter to receive your next major objective.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[var(--color-accent-indigo)] to-[var(--color-accent-purple)] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm hidden sm:block">
          <Target className="text-white" size={32} />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            Next Objective: Maintain Momentum
          </h2>
          <p className="text-white/70 text-sm md:text-base">
            Complete your daily missions to progress in the {currentChapter.title} chapter.
          </p>
        </div>
      </div>
      
      <Link 
        href="/"
        className="w-full md:w-auto shrink-0 bg-bg-base text-[var(--color-accent-indigo)] font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group"
      >
        Go to Mission Control
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
