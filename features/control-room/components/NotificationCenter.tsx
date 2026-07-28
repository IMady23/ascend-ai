"use client";

import { useSettingsStore, type NotificationConfig } from "@/stores/settings.store";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";

export function NotificationCenter() {
  const { notifications, updateNotifications } = useSettingsStore();

  const handleToggle = (key: keyof NotificationConfig) => {
    updateNotifications({ [key]: !notifications[key] });
  };

  const options = [
    { key: "morningReminder", label: "Morning Reminder", desc: "Wake up and plan" },
    { key: "workoutReminder", label: "Workout Reminder", desc: "Time to train" },
    { key: "waterReminder", label: "Water Reminder", desc: "Hydration check-ins" },
    { key: "mealReminder", label: "Meal Reminder", desc: "Log your nutrition" },
    { key: "sleepReminder", label: "Sleep Reminder", desc: "Wind down schedule" },
    { key: "weeklyReview", label: "Weekly Review", desc: "Sunday progress check" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Notification Center</h2>
        </div>
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-950 px-2 py-1 rounded">Local</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((opt) => {
          const isActive = notifications[opt.key as keyof NotificationConfig];
          return (
            <div key={opt.key} className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">{opt.label}</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{opt.desc}</p>
              </div>
              <button 
                onClick={() => handleToggle(opt.key as keyof NotificationConfig)}
                className={`w-10 h-5 rounded-full relative transition-colors ${isActive ? 'bg-cyan-500' : 'bg-zinc-800'}`}
              >
                <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${isActive ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
