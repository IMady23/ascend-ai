"use client";

import { MOCK_WEEKLY_ACTIVITY } from "../constants";

export function WeeklyActivity() {
  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 h-full flex flex-col">
      <h2 className="text-xl font-bold text-white mb-8">Weekly Output</h2>
      
      <div className="flex items-end justify-between gap-2 h-48 mt-auto">
        {MOCK_WEEKLY_ACTIVITY.map((day, i) => (
          <div key={i} className="flex flex-col items-center flex-1 gap-3 group">
            {/* Tooltip via group hover could go here */}
            
            {/* Bar */}
            <div className="w-full bg-zinc-800/50 rounded-t-lg relative flex flex-col justify-end min-h-[120px]">
              <div 
                className={`w-full rounded-t-lg transition-all duration-500 ${
                  day.hasWorkout ? "bg-orange-500" : "bg-zinc-700"
                }`}
                style={{ height: `${Math.max(day.intensity, 5)}%` }}
              />
            </div>
            
            {/* Label */}
            <span className={`text-xs font-bold uppercase ${
              day.day === "Wed" /* Mock current day */ ? "text-orange-400" : "text-zinc-500"
            }`}>
              {day.day}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
