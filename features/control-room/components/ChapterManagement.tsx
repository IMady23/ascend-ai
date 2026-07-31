"use client";

import { useChapterStore } from "@/stores/chapter.store";
import { motion } from "framer-motion";
import { BookOpen, Lock } from "lucide-react";

export function ChapterManagement() {
  const { currentChapter } = useChapterStore();

  const chapters = [
    { id: "c1", title: "The Awakening", status: "completed" },
    { id: "c2", title: "Momentum", status: "completed" },
    { id: "c3", title: currentChapter?.title || "Initiation", status: "current" },
    { id: "c4", title: "The Crucible", status: "locked" },
    { id: "c5", title: "Ascension", status: "locked" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-surface/30 border border-border-subtle/50 rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <BookOpen size={18} className="text-indigo-400" />
        <h2 className="text-lg font-semibold text-primary">Chapter Management</h2>
      </div>

      <div className="space-y-3">
        {chapters.map((chapter) => (
          <div key={chapter.id} className={`flex items-center justify-between p-3 rounded-lg border ${
            chapter.status === 'current' ? 'bg-indigo-500/10 border-indigo-500/30' : 
            chapter.status === 'completed' ? 'bg-base/50 border-border-subtle/50' : 
            'bg-base/20 border-border-subtle opacity-50'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                chapter.status === 'current' ? 'bg-indigo-500/20 text-indigo-400' :
                chapter.status === 'completed' ? 'bg-surface-elevated text-secondary' :
                'bg-surface text-disabled'
              }`}>
                {chapter.status === 'locked' ? <Lock size={12} /> : <BookOpen size={12} />}
              </div>
              <span className={`text-sm font-semibold ${chapter.status === 'locked' ? 'text-secondary' : 'text-primary'}`}>
                {chapter.title}
              </span>
            </div>
            
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              chapter.status === 'current' ? 'text-indigo-400' :
              chapter.status === 'completed' ? 'text-secondary' :
              'text-disabled'
            }`}>
              {chapter.status}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
