"use client";

import { useSettingsStore } from "@/stores/settings.store";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import type { MissionConfig } from "@/stores/settings.store";

export function MissionConfiguration() {
  const { mission, updateMission } = useSettingsStore();

  const handleUpdate = (key: keyof MissionConfig, value: number) => {
    updateMission({ [key]: value });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-surface/30 border border-border-subtle/50 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-amber-400" />
          <h2 className="text-lg font-semibold text-primary">Mission Configuration</h2>
        </div>
        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider bg-base px-2 py-1 rounded">Local</span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-base/50 rounded-lg border border-border-subtle/50">
          <div>
            <h3 className="text-sm font-semibold text-primary">Daily Missions</h3>
            <p className="text-[10px] text-secondary uppercase tracking-wider">Target tasks per day</p>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => handleUpdate('dailyMissionCount', Math.max(1, mission.dailyMissionCount - 1))} className="w-8 h-8 rounded-full bg-surface hover:bg-surface-elevated flex items-center justify-center text-secondary">-</button>
             <span className="text-sm font-bold text-primary font-mono w-4 text-center">{mission.dailyMissionCount}</span>
             <button onClick={() => handleUpdate('dailyMissionCount', Math.min(10, mission.dailyMissionCount + 1))} className="w-8 h-8 rounded-full bg-surface hover:bg-surface-elevated flex items-center justify-center text-secondary">+</button>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-base/50 rounded-lg border border-border-subtle/50">
          <div>
            <h3 className="text-sm font-semibold text-primary">Workout Days</h3>
            <p className="text-[10px] text-secondary uppercase tracking-wider">Sessions per week</p>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => handleUpdate('workoutDays', Math.max(1, mission.workoutDays - 1))} className="w-8 h-8 rounded-full bg-surface hover:bg-surface-elevated flex items-center justify-center text-secondary">-</button>
             <span className="text-sm font-bold text-primary font-mono w-4 text-center">{mission.workoutDays}</span>
             <button onClick={() => handleUpdate('workoutDays', Math.min(7, mission.workoutDays + 1))} className="w-8 h-8 rounded-full bg-surface hover:bg-surface-elevated flex items-center justify-center text-secondary">+</button>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-base/50 rounded-lg border border-border-subtle/50">
          <div>
            <h3 className="text-sm font-semibold text-primary">Water Goal</h3>
            <p className="text-[10px] text-secondary uppercase tracking-wider">Milliliters per day</p>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => handleUpdate('waterGoalMl', Math.max(1000, mission.waterGoalMl - 250))} className="w-8 h-8 rounded-full bg-surface hover:bg-surface-elevated flex items-center justify-center text-secondary">-</button>
             <span className="text-sm font-bold text-primary font-mono w-10 text-center">{mission.waterGoalMl}</span>
             <button onClick={() => handleUpdate('waterGoalMl', Math.min(6000, mission.waterGoalMl + 250))} className="w-8 h-8 rounded-full bg-surface hover:bg-surface-elevated flex items-center justify-center text-secondary">+</button>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-base/50 rounded-lg border border-border-subtle/50">
          <div>
            <h3 className="text-sm font-semibold text-primary">Protein Goal</h3>
            <p className="text-[10px] text-secondary uppercase tracking-wider">Grams per day</p>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => handleUpdate('proteinGoalG', Math.max(50, mission.proteinGoalG - 10))} className="w-8 h-8 rounded-full bg-surface hover:bg-surface-elevated flex items-center justify-center text-secondary">-</button>
             <span className="text-sm font-bold text-primary font-mono w-8 text-center">{mission.proteinGoalG}</span>
             <button onClick={() => handleUpdate('proteinGoalG', Math.min(300, mission.proteinGoalG + 10))} className="w-8 h-8 rounded-full bg-surface hover:bg-surface-elevated flex items-center justify-center text-secondary">+</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
