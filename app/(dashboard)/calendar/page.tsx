"use client";

import React, { useState } from "react";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Calendar, ChevronLeft, ChevronRight, AlertCircle, Dumbbell, Apple, Plane } from "lucide-react";
import { AdaptiveWorkoutPlanner, ScheduledEvent } from "@/lib/planning/AdaptiveWorkoutPlanner";

export default function CalendarPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Simulated events for UI
  const events: ScheduledEvent[] = [
    { id: '1', type: 'workout', title: 'Heavy Push', date: '2026-08-01', status: 'planned' },
    { id: '2', type: 'conflict', title: 'Business Travel', date: '2026-08-01', status: 'planned' },
    { id: '3', type: 'meal', title: 'High Carb Dinner', date: '2026-08-01', status: 'planned' },
    { id: '4', type: 'rest', title: 'Recovery Day', date: '2026-08-02', status: 'planned' },
  ];

  const conflicts = AdaptiveWorkoutPlanner.detectConflicts(events);

  return (
    <div className="max-w-5xl mx-auto space-y-6 px-4 pt-4 pb-20 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <div>
          <Heading level="h2">Calendar</Heading>
          <BodyText className="text-[var(--color-text-muted)]">Adaptive scheduling & AI planning.</BodyText>
        </div>
        <div className="flex items-center gap-4 bg-[var(--color-bg-surface)] p-2 rounded-lg border border-[var(--color-glass-border)]">
          <button className="p-1 text-[var(--color-text-secondary)] hover:text-white"><ChevronLeft size={20}/></button>
          <BodyText className="font-medium text-white">August 2026</BodyText>
          <button className="p-1 text-[var(--color-text-secondary)] hover:text-white"><ChevronRight size={20}/></button>
        </div>
      </div>

      {conflicts.length > 0 && (
        <GlassCard className="p-4 border-[var(--color-accent-orange)] bg-[var(--color-accent-orange)]/10 flex gap-3">
          <AlertCircle className="text-[var(--color-accent-orange)] shrink-0" size={24} />
          <div>
            <Heading level="h4" className="text-[var(--color-accent-orange)] mb-1">AI Schedule Conflict Detected</Heading>
            <ul className="space-y-1">
              {conflicts.map((c, i) => (
                <li key={i} className="text-sm text-white/80">{c}</li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <button className="px-3 py-1 bg-[var(--color-accent-orange)] text-white text-xs font-bold rounded-md hover:bg-orange-600 transition-colors">
                Auto-Resolve
              </button>
              <button className="px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-md hover:bg-white/20 transition-colors">
                Review Options
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Basic week view skeleton */}
      <div className="grid grid-cols-7 gap-4">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
          <div key={day} className="flex flex-col gap-2">
            <div className="text-center p-2 border-b border-[var(--color-glass-border)]">
              <Caption className="text-[var(--color-text-secondary)] uppercase font-bold">{day}</Caption>
              <BodyText className="text-white font-medium">{27 + i}</BodyText>
            </div>
            
            {/* Render mock events for 'Fri' (index 4 = 31st, let's pretend 1st is Sat index 5) */}
            {i === 5 && (
              <div className="space-y-2">
                 <div className="bg-[var(--color-accent-blue)]/20 border border-[var(--color-accent-blue)]/30 rounded-md p-2 text-xs text-blue-100 flex items-center gap-1">
                   <Dumbbell size={12} /> Heavy Push
                 </div>
                 <div className="bg-[var(--color-accent-orange)]/20 border border-[var(--color-accent-orange)]/30 rounded-md p-2 text-xs text-orange-100 flex items-center gap-1">
                   <Plane size={12} /> Business Travel
                 </div>
              </div>
            )}
            
            {i === 6 && (
              <div className="space-y-2">
                 <div className="bg-[var(--color-accent-green)]/20 border border-[var(--color-accent-green)]/30 rounded-md p-2 text-xs text-green-100 flex items-center gap-1">
                   <Calendar size={12} /> Rest Day
                 </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
