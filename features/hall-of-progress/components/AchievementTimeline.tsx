"use client";

import { motion } from "framer-motion";
import { Flag, Dumbbell, Flame, BookOpen, Trophy, Medal } from "lucide-react";
import { MOCK_TIMELINE } from "../constants";
import type { TimelineEvent } from "../types";

const getEventIcon = (type: TimelineEvent["type"]) => {
  switch (type) {
    case "start": return <Flag size={16} className="text-emerald-400" />;
    case "workout": return <Dumbbell size={16} className="text-indigo-400" />;
    case "streak": return <Flame size={16} className="text-rose-400" />;
    case "chapter": return <BookOpen size={16} className="text-purple-400" />;
    case "milestone": return <Trophy size={16} className="text-amber-400" />;
    case "record": return <Medal size={16} className="text-cyan-400" />;
    default: return <Flag size={16} className="text-zinc-400" />;
  }
};

const getEventColor = (type: TimelineEvent["type"]) => {
  switch (type) {
    case "start": return "bg-emerald-500/10 border-emerald-500/20";
    case "workout": return "bg-indigo-500/10 border-indigo-500/20";
    case "streak": return "bg-rose-500/10 border-rose-500/20";
    case "chapter": return "bg-purple-500/10 border-purple-500/20";
    case "milestone": return "bg-amber-500/10 border-amber-500/20";
    case "record": return "bg-cyan-500/10 border-cyan-500/20";
    default: return "bg-zinc-500/10 border-zinc-500/20";
  }
};

export function AchievementTimeline() {
  const events = MOCK_TIMELINE;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-8">
        <Trophy size={18} className="text-purple-400" />
        <h2 className="text-lg font-semibold text-white">Historical Timeline</h2>
      </div>

      <div className="relative border-l border-zinc-800 ml-3 md:ml-4 space-y-8">
        {events.map((event, i) => (
          <div key={event.id} className="relative pl-6 md:pl-8">
            {/* Timeline Node */}
            <div className={`absolute -left-[1.35rem] md:-left-[1.35rem] top-1 p-1.5 rounded-full border bg-zinc-950 ${getEventColor(event.type)}`}>
              {getEventIcon(event.type)}
            </div>
            
            <div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <h3 className="text-base font-semibold text-zinc-200 mb-1">{event.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-lg">{event.description}</p>
            </div>
          </div>
        ))}
        
        {/* Origin node */}
        <div className="relative pl-6 md:pl-8 pt-4">
          <div className="absolute -left-[0.35rem] md:-left-[0.35rem] top-5 w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Beginning of Time</span>
        </div>
      </div>
    </motion.div>
  );
}
