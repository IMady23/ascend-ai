"use client";

import { motion } from "framer-motion";
import { Activity, Dumbbell, Footprints, Flame, Leaf, Droplets, MapPin, Hash } from "lucide-react";
import { useActivityStore } from "@/stores/activity.store";
import { useNutritionStore } from "@/stores/nutrition.store";
export function LifetimeStatistics() {
  const { activities, dailySteps } = useActivityStore();
  const { dailyCalories, dailyProtein, dailyWaterMl } = useNutritionStore();

  const totalWorkouts = activities.length;
  const totalMinutes = activities.reduce((sum, a) => sum + (a.durationMinutes || 0), 0);
  const totalSteps = dailySteps || 0; // Ideally from historical
  const totalCalories = dailyCalories || 0;
  const totalWaterLiters = (dailyWaterMl || 0) / 1000;
  const totalProteinKg = (dailyProtein || 0) / 1000;

  const data = [
    { label: "Total Workouts", value: totalWorkouts, icon: Dumbbell, color: "text-purple-400" },
    { label: "Minutes Trained", value: totalMinutes, icon: Activity, color: "text-indigo-400" },
    { label: "Total Steps", value: `${(totalSteps / 1000).toFixed(1)}k`, icon: Footprints, color: "text-emerald-400" },
    { label: "Distance", value: "0km", icon: MapPin, color: "text-amber-400" },
    { label: "Calories Burned", value: `${(totalCalories / 1000).toFixed(1)}k`, icon: Flame, color: "text-rose-400" },
    { label: "Water Consumed", value: `${totalWaterLiters.toFixed(1)}L`, icon: Droplets, color: "text-cyan-400" },
    { label: "Protein Consumed", value: `${totalProteinKg.toFixed(2)}kg`, icon: Leaf, color: "text-emerald-400" },
    { label: "Days Active", value: totalWorkouts > 0 ? 1 : 0, icon: Hash, color: "text-zinc-400" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Activity size={18} className="text-purple-400" />
        <h2 className="text-lg font-semibold text-white">Lifetime Statistics</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {data.map((stat, i) => (
          <div key={i} className="flex flex-col gap-1 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
            <div className={`mb-2 ${stat.color}`}>
              <stat.icon size={16} />
            </div>
            <span className="text-2xl font-black text-white font-mono">{stat.value}</span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{stat.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
