"use client";

import { useUserStore } from "@/stores/user.store";
import { useSettingsStore } from "@/stores/settings.store";
import { motion } from "framer-motion";
import { User, Activity, Target } from "lucide-react";

export function PersonalProfile() {
  const { profile, goals } = useUserStore();
  const { mission } = useSettingsStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <User size={18} className="text-purple-400" />
        <h2 className="text-lg font-semibold text-white">Personal Profile</h2>
      </div>

      <div className="space-y-8">
        {/* Identity */}
        <div>
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-purple-500" />
            Identity
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Name</span>
              <span className="text-sm font-semibold text-zinc-200">{"Commander"}</span>
            </div>
            <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Age</span>
              <span className="text-sm font-semibold text-zinc-200">{profile?.age || 25}</span>
            </div>
          </div>
        </div>

        {/* Body Metrics */}
        <div>
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-indigo-500" />
            Body Metrics
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Height</span>
              <span className="text-sm font-semibold text-zinc-200">{profile?.height || 180} cm</span>
            </div>
            <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Current</span>
              <span className="text-sm font-semibold text-zinc-200">{profile?.weight || 90} kg</span>
            </div>
            <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Goal</span>
              <span className="text-sm font-semibold text-zinc-200">{goals?.targetWeight || 80} kg</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
