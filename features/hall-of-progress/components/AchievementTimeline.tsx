"use client";

import { motion } from "framer-motion";
import { Flag, Dumbbell, Flame, BookOpen, Trophy, Medal } from "lucide-react";
import { MOCK_TIMELINE } from "../constants";
import type { TimelineEvent } from "../types";
import { useActivityStore } from "@/stores/activity.store";

const getEventIcon = (type: TimelineEvent["type"]) => {
  switch (type) {
    case "start": return <Flag size={16} className="text-emerald-400" />;
    case "workout": return <Dumbbell size={16} className="text-indigo-400" />;
    case "streak": return <Flame size={16} className="text-rose-400" />;
    case "chapter": return <BookOpen size={16} className="text-purple-400" />;
    case "milestone": return <Trophy size={16} className="text-amber-400" />;
    case "record": return <Medal size={16} className="text-cyan-400" />;
    default: return <Flag size={16} className="text-secondary" />;
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
  const { activities } = useActivityStore();
  
  // Derive timeline events from live data
  const events: TimelineEvent[] = [];
  
  if (activities.length > 0) {
    // Just map activities as workouts for now to demonstrate live data
    // In a real app we'd map milestones, chapter completions, etc.
    activities.forEach((activity, idx) => {
      // Only show up to 5 recent workouts to avoid clutter
      if (idx < 5) {
        events.push({
          id: activity.id,
          date: new Date(activity.createdAt?.toMillis ? activity.createdAt.toMillis() : Date.now()).toISOString().split("T")[0],
          title: "Workout Completed",
          description: `Completed a ${activity.durationMinutes} minute session.`,
          type: "workout"
        });
      }
    });
    
    // Add start event
    events.push({
      id: "start-event",
      date: new Date(Date.now() - 86400000).toISOString().split("T")[0], // Mock yesterday
      title: "Journey Started",
      description: "Committed to the Ascend AI protocol.",
      type: "start"
    });
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-surface/50 border border-border-subtle rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-8">
        <Trophy size={18} className="text-purple-400" />
        <h2 className="text-lg font-semibold text-primary">Historical Timeline</h2>
      </div>

      <div className="relative border-l border-border-subtle ml-3 md:ml-4 space-y-8">
        {events.map((event, i) => (
          <div key={event.id} className="relative pl-6 md:pl-8">
            {/* Timeline Node */}
            <div className={`absolute -left-[1.35rem] md:-left-[1.35rem] top-1 p-1.5 rounded-full border bg-base ${getEventColor(event.type)}`}>
              {getEventIcon(event.type)}
            </div>
            
            <div>
              <span className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">
                {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <h3 className="text-base font-semibold text-primary mb-1">{event.title}</h3>
              <p className="text-sm text-secondary leading-relaxed max-w-lg">{event.description}</p>
            </div>
          </div>
        ))}
        
        {/* Origin node */}
        <div className="relative pl-6 md:pl-8 pt-4">
          <div className="absolute -left-[0.35rem] md:-left-[0.35rem] top-5 w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <span className="text-xs font-bold text-disabled uppercase tracking-wider">Beginning of Time</span>
        </div>
      </div>
    </motion.div>
  );
}
