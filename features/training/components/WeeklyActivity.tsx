"use client";

import { useActivityStore } from "@/stores/activity.store";
import { useMemo } from "react";

export function WeeklyActivity() {
  const activities = useActivityStore((state) => state.activities);

  const weeklyData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    
    // Generate the last 7 days array
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return {
        date: d,
        day: days[d.getDay()],
        hasWorkout: false,
        intensity: 0,
        isToday: i === 6
      };
    });

    // Populate with actual activities
    activities.forEach(activity => {
      if (!activity.date) return;
      
      let activityDate: Date;
      if ((activity.date as any).toDate) {
        activityDate = (activity.date as any).toDate();
      } else {
        activityDate = new Date(activity.date as any);
      }
      
      const dayMatch = last7Days.find(d => 
        d.date.getDate() === activityDate.getDate() &&
        d.date.getMonth() === activityDate.getMonth() &&
        d.date.getFullYear() === activityDate.getFullYear()
      );

      if (dayMatch) {
        dayMatch.hasWorkout = true;
        // Simple intensity approximation based on duration (max 100)
        dayMatch.intensity = Math.min((dayMatch.intensity || 0) + (activity.durationMinutes / 60) * 100, 100);
      }
    });

    return last7Days;
  }, [activities]);

  return (
    <section className="bg-surface border border-border-subtle rounded-2xl p-6 md:p-8 h-full flex flex-col">
      <h2 className="text-xl font-bold text-primary mb-8">Weekly Output</h2>
      
      <div className="flex items-end justify-between gap-2 h-48 mt-auto">
        {weeklyData.map((day, i) => (
          <div key={i} className="flex flex-col items-center flex-1 gap-3 group">
            <div className="w-full bg-surface-elevated/50 rounded-t-lg relative flex flex-col justify-end min-h-[120px]">
              <div 
                className={`w-full rounded-t-lg transition-all duration-500 ${
                  day.hasWorkout ? "bg-orange-500" : "bg-surface-elevated"
                }`}
                style={{ height: `${Math.max(day.intensity, 5)}%` }}
              />
            </div>
            
            <span className={`text-xs font-bold uppercase ${
              day.isToday ? "text-orange-400" : "text-secondary"
            }`}>
              {day.day}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
