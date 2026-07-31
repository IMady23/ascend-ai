"use client";

import React, { useMemo } from "react";
import { MotionCard } from "@/components/ui/motion/MotionCard";
import { CalendarDays } from "lucide-react";
import { format, subDays, startOfDay, getDay } from "date-fns";

interface HeatmapChartProps {
  consistency: { date: string; level: number }[]; // level: 0, 1, 2
  days?: number; // 90 by default for a nice 3-month block
}

export function HeatmapChart({ consistency, days = 90 }: HeatmapChartProps) {
  // Generate a matrix of days.
  const { weeks, monthLabels } = useMemo(() => {
    const today = startOfDay(new Date());
    const startDate = subDays(today, days - 1);
    
    const dayMap = new Map<string, number>();
    consistency.forEach(c => {
      dayMap.set(c.date, c.level);
    });

    const weeksArray: { date: Date; level: number }[][] = [];
    let currentWeek: { date: Date; level: number }[] = [];
    
    // Fill initial empty days in the first week to align with Sunday start
    const startDayOfWeek = getDay(startDate);
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push({ date: new Date(0), level: -1 }); // placeholder
    }

    const mLabels: { text: string; colIndex: number }[] = [];
    let lastMonth = -1;

    for (let i = 0; i < days; i++) {
      const d = subDays(today, days - 1 - i);
      const dateStr = format(d, "yyyy-MM-dd");
      const level = dayMap.get(dateStr) || 0;
      
      currentWeek.push({ date: d, level });
      
      const month = d.getMonth();
      if (month !== lastMonth && currentWeek.length > 1) { // ensure it's not placing label on the very edge blindly
        mLabels.push({ text: format(d, "MMM"), colIndex: weeksArray.length });
        lastMonth = month;
      }

      if (currentWeek.length === 7) {
        weeksArray.push(currentWeek);
        currentWeek = [];
      }
    }
    
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: new Date(0), level: -1 });
      }
      weeksArray.push(currentWeek);
    }

    return { weeks: weeksArray, monthLabels: mLabels };
  }, [consistency, days]);

  const getColorClass = (level: number) => {
    if (level === -1) return "bg-transparent"; // padding
    if (level === 0) return "bg-bg-surface border border-border-subtle";
    if (level === 1) return "bg-accent-gold/40 border border-accent-gold/20";
    if (level >= 2) return "bg-accent-gold border border-accent-gold";
    return "bg-bg-surface";
  };

  return (
    <MotionCard className="glass-panel overflow-hidden p-6" interactive={false}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-text-primary">
          <CalendarDays className="w-5 h-5 text-accent-gold" />
          Consistency Heatmap
        </h3>
      </div>
      
      <div className="flex flex-col overflow-x-auto pb-4">
        {/* Months Row */}
        <div className="flex text-xs text-text-secondary mb-2 relative h-4">
          {monthLabels.map((m, i) => (
            <span key={i} className="absolute" style={{ left: `${m.colIndex * 1.15}rem` }}>
              {m.text}
            </span>
          ))}
        </div>
        
        <div className="flex gap-1">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1">
              {week.map((day, dIdx) => (
                <div 
                  key={dIdx}
                  className={`w-3.5 h-3.5 rounded-sm transition-all duration-300 ${getColorClass(day.level)}`}
                  title={day.level !== -1 ? `${format(day.date, "MMM d, yyyy")}: ${day.level === 0 ? 'No activity' : day.level === 1 ? 'Moderate activity' : 'High activity'}` : ""}
                />
              ))}
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2 mt-4 text-xs text-text-secondary">
          <span>Less</span>
          <div className="flex gap-1">
            <div className={`w-3.5 h-3.5 rounded-sm ${getColorClass(0)}`} />
            <div className={`w-3.5 h-3.5 rounded-sm ${getColorClass(1)}`} />
            <div className={`w-3.5 h-3.5 rounded-sm ${getColorClass(2)}`} />
          </div>
          <span>More</span>
        </div>
      </div>
    </MotionCard>
  );
}
