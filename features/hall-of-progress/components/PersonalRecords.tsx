"use client";

import { motion } from "framer-motion";
import { Medal, Flame, Footprints, Activity, Dumbbell, Leaf, Droplets } from "lucide-react";
import { MOCK_RECORDS } from "../constants";
import { useActivityStore } from "@/stores/activity.store";
import { useNutritionStore } from "@/stores/nutrition.store";
const getIcon = (name: string) => {
  switch(name) {
    case "flame": return <Flame size={16} className="text-rose-400" />;
    case "footprints": return <Footprints size={16} className="text-emerald-400" />;
    case "activity": return <Activity size={16} className="text-indigo-400" />;
    case "dumbbell": return <Dumbbell size={16} className="text-purple-400" />;
    case "leaf": return <Leaf size={16} className="text-emerald-400" />;
    case "droplets": return <Droplets size={16} className="text-cyan-400" />;
    default: return <Medal size={16} className="text-amber-400" />;
  }
}

export function PersonalRecords() {
  const { activities, dailySteps } = useActivityStore();
  const { dailyCalories } = useNutritionStore();

  let records = MOCK_RECORDS;

  if (activities.length > 0) {
    const maxMinutes = Math.max(...activities.map(a => a.durationMinutes || 0), 0);
    const maxCals = Math.max(...activities.map(a => a.caloriesBurned || 0), 0);

    records = [
      { id: "r1", title: "Longest Streak", value: 1, unit: "days", date: new Date().toISOString().split("T")[0], icon: "flame" },
      { id: "r2", title: "Highest Daily Steps", value: dailySteps || 0, date: new Date().toISOString().split("T")[0], icon: "footprints" },
      { id: "r3", title: "Highest Calories Burned", value: maxCals, unit: "kcal", date: new Date().toISOString().split("T")[0], icon: "activity" },
      { id: "r4", title: "Longest Workout", value: maxMinutes, unit: "min", date: new Date().toISOString().split("T")[0], icon: "dumbbell" },
      { id: "r5", title: "Nutrition Consistency", value: 1, unit: "days", date: new Date().toISOString().split("T")[0], icon: "leaf" },
      { id: "r6", title: "Hydration Streak", value: 1, unit: "days", date: new Date().toISOString().split("T")[0], icon: "droplets" },
    ];
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-surface/50 border border-border-subtle rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Medal size={18} className="text-amber-400" />
        <h2 className="text-lg font-semibold text-primary">Personal Records</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {records.map((record, i) => (
          <div key={record.id} className="bg-base/50 border border-border-subtle/50 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-secondary">
                {getIcon(record.icon)}
                <span className="text-[10px] font-bold uppercase tracking-wider leading-tight w-20 line-clamp-2">
                  {record.title}
                </span>
              </div>
            </div>
            
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-primary font-mono">{record.value}</span>
                {record.unit && <span className="text-xs text-secondary font-medium">{record.unit}</span>}
              </div>
              <span className="text-[10px] text-disabled font-medium block mt-1 uppercase tracking-wider">
                {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
