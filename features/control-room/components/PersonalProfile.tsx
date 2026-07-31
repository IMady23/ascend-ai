"use client";

import { useUserStore } from "@/stores/user.store";
import { useSettingsStore } from "@/stores/settings.store";
import { motion } from "framer-motion";
import { User } from "lucide-react";

export function PersonalProfile() {
  const { profile } = useUserStore();
  const { mission } = useSettingsStore();

  const calculateAge = (dob: string) => {
    if (!dob) return 25;
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-surface/30 border border-border-subtle/50 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <User size={18} className="text-purple-400" />
          <h2 className="text-lg font-semibold text-primary">Personal Profile</h2>
        </div>
      </div>

      <div className="space-y-8">
        {/* Identity */}
        <div>
          <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-purple-500" />
            Identity
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-base/50 rounded-lg border border-border-subtle/50">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-1">Name</span>
              <span className="text-sm font-semibold text-primary">{profile?.identity?.fullName || "Commander"}</span>
            </div>
            <div className="p-3 bg-base/50 rounded-lg border border-border-subtle/50">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-1">Age</span>
              <span className="text-sm font-semibold text-primary">{calculateAge(profile?.identity?.dob || "")}</span>
            </div>
          </div>
        </div>

        {/* Body Metrics */}
        <div>
          <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-indigo-500" />
            Body Metrics
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-base/50 rounded-lg border border-border-subtle/50">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-1">Height</span>
              <span className="text-sm font-semibold text-primary">{profile?.identity?.height || 180} cm</span>
            </div>
            <div className="p-3 bg-base/50 rounded-lg border border-border-subtle/50">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-1">Current</span>
              <span className="text-sm font-semibold text-primary">{profile?.identity?.weight || 90} kg</span>
            </div>
            <div className="p-3 bg-base/50 rounded-lg border border-border-subtle/50">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-1">Goal</span>
              <span className="text-sm font-semibold text-primary text-purple-400 capitalize">{profile?.goals?.primaryGoal.replace('_', ' ') || 'maintain'}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
