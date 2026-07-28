"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { generateMockCalendar } from "../constants";

const getColor = (intensity: number) => {
  switch (intensity) {
    case 4: return "bg-purple-500";
    case 3: return "bg-purple-600";
    case 2: return "bg-purple-800";
    case 1: return "bg-purple-950";
    default: return "bg-zinc-900 border border-zinc-800/50";
  }
};

export function JourneyCalendar() {
  const days = generateMockCalendar();

  // Group into weeks for layout (assuming last day is today, layout grid column-wise)
  // GitHub style layout: 7 rows (days of week), columns are weeks.
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-6">
        <Calendar size={18} className="text-purple-400" />
        <h2 className="text-lg font-semibold text-white">Journey Heatmap</h2>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-2 overflow-x-auto pb-4 hide-scrollbar">
          {/* We will render a simplified block layout to simulate the heatmap, wrapping flex */}
          <div className="flex flex-wrap gap-1.5 w-full min-w-[300px]">
             {days.map((day, i) => (
                <div 
                  key={i} 
                  title={`${day.date} (Intensity: ${day.intensity})`}
                  className={`w-3.5 h-3.5 rounded-sm ${getColor(day.intensity)} hover:ring-2 hover:ring-purple-400/50 transition-all cursor-crosshair`}
                />
             ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
          <span>90 Days Ago</span>
          <div className="flex items-center gap-1.5">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-sm bg-zinc-900 border border-zinc-800/50" />
              <div className="w-2.5 h-2.5 rounded-sm bg-purple-950" />
              <div className="w-2.5 h-2.5 rounded-sm bg-purple-800" />
              <div className="w-2.5 h-2.5 rounded-sm bg-purple-600" />
              <div className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
