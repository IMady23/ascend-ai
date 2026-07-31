"use client";

import React, { useMemo } from "react";
import { MotionCard } from "@/components/ui/motion/MotionCard";
import { useAnalyticsStore } from "@/stores/analytics.store";
import { AnalyticsService } from "@/services/analytics/AnalyticsService";
import { Coffee, Target, Dumbbell, Activity, Droplet, Moon, Sun, Apple, HeartPulse } from "lucide-react";
import { format } from "date-fns";

export function AnalyticsTimeline() {
  const { selectedDate, hoveredDate } = useAnalyticsStore();
  const dateToInspect = hoveredDate || selectedDate || new Date().toISOString().split("T")[0];

  const timelineEvents = useMemo(() => {
    const cache = AnalyticsService.getCache();
    const events: { id: string; timeStr: string; type: string; title: string; subtitle: string; icon: any; color: string }[] = [];

    // Sleep (Mocking morning time for the timeline)
    const dailyLog = cache.dailyLogs.find(d => d.date === dateToInspect);
    if (dailyLog && (dailyLog as any).sleepHours > 0) {
      events.push({
        id: 'sleep',
        timeStr: '07:00',
        type: 'sleep',
        title: 'Sleep Logged',
        subtitle: `${(dailyLog as any).sleepHours} hours`,
        icon: Moon,
        color: 'var(--color-accent-indigo)'
      });
    }

    // Nutrition
    const meals = cache.nutritionLogs.filter(n => n.date === dateToInspect);
    meals.forEach(m => {
      let timeStr = '12:00';
      if (m.type === 'breakfast') timeStr = '08:30';
      if (m.type === 'lunch') timeStr = '13:00';
      if (m.type === 'dinner') timeStr = '19:30';
      if (m.type === 'snack') timeStr = '16:00';
      
      events.push({
        id: `meal-${m.id}`,
        timeStr,
        type: 'nutrition',
        title: m.name || m.type.charAt(0).toUpperCase() + m.type.slice(1),
        subtitle: `${m.calories || 0} kcal • ${m.protein || 0}g protein`,
        icon: m.type === 'breakfast' ? Coffee : m.type === 'snack' ? Apple : Utensils,
        color: 'var(--color-accent-orange)'
      });
    });

    // Workouts
    const workouts = cache.activities.filter(a => a.date.toDate().toISOString().split("T")[0] === dateToInspect);
    workouts.forEach(w => {
      events.push({
        id: `workout-${w.id}`,
        timeStr: format(w.date.toDate(), 'HH:mm'),
        type: 'workout',
        title: w.name || w.type,
        subtitle: `${w.durationMinutes || 0} mins`,
        icon: w.type === 'running' ? Activity : Dumbbell,
        color: 'var(--color-accent-blue)'
      });
    });

    // Hydration
    const hydration = cache.hydrationLogs.filter(h => h.date === dateToInspect);
    let totalWater = 0;
    hydration.forEach(h => totalWater += (h.amountMl || 0));
    if (totalWater > 0) {
      events.push({
        id: 'hydration',
        timeStr: '15:00',
        type: 'hydration',
        title: 'Hydration Summary',
        subtitle: `${totalWater} ml logged today`,
        icon: Droplet,
        color: 'var(--color-accent-hydration)'
      });
    }
    
    // Sort chronologically
    return events.sort((a, b) => a.timeStr.localeCompare(b.timeStr));
  }, [dateToInspect]);

  const displayDate = format(new Date(dateToInspect + "T12:00:00Z"), "MMMM d, yyyy");

  return (
    <MotionCard className="glass-panel overflow-hidden" interactive={false}>
      <div className="p-6 border-b border-border-subtle bg-bg-surface sticky top-0 z-10 flex justify-between items-center">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-text-primary">
          <Target className="w-5 h-5 text-accent-gold" />
          Analytics Timeline
        </h3>
        <span className="text-sm font-medium text-text-secondary bg-bg-base px-3 py-1 rounded-full border border-border-subtle">
          {displayDate}
        </span>
      </div>
      <div className="p-6">
        {timelineEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <Sun className="w-12 h-12 text-text-secondary opacity-30 mb-4" />
            <p className="text-text-primary font-medium">No activity on this date.</p>
            <p className="text-text-secondary text-sm mt-1">Select another day on the charts.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-border-subtle ml-4 space-y-8 py-2">
            {timelineEvents.map((event, idx) => {
              const Icon = event.icon;
              return (
                <div key={event.id} className="relative pl-8 group">
                  <div 
                    className="absolute -left-[13px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-4 border-bg-surface transition-transform duration-300 group-hover:scale-125"
                    style={{ backgroundColor: event.color }}
                  >
                    <Icon className="w-3 h-3 text-bg-base" />
                  </div>
                  
                  <div className="flex items-start justify-between cursor-pointer p-3 -mt-3 rounded-xl hover:bg-bg-surface-elevated transition-colors border border-transparent hover:border-border-subtle group">
                    <div>
                      <h4 className="text-sm font-bold text-text-primary group-hover:text-[color:var(--color-accent-blue)] transition-colors">
                        {event.title}
                      </h4>
                      <p className="text-xs text-text-secondary mt-1">{event.subtitle}</p>
                    </div>
                    <div className="text-xs font-semibold text-text-muted bg-bg-base px-2 py-1 rounded-md border border-border-subtle">
                      {event.timeStr}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MotionCard>
  );
}

// Icon fallbacks inside components
function Utensils(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg> }
