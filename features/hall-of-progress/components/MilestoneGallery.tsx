"use client";

import { motion } from "framer-motion";
import { Award, Lock, Play, Crown, Dumbbell, Droplets, Zap, Leaf } from "lucide-react";
import { MOCK_MILESTONES } from "../constants";

const getMilestoneIcon = (iconName: string, locked: boolean) => {
  if (locked) return <Lock size={20} className="text-disabled" />;
  
  switch(iconName) {
    case "play": return <Play size={20} className="text-purple-400" />;
    case "crown": return <Crown size={20} className="text-amber-400" />;
    case "dumbbell": return <Dumbbell size={20} className="text-indigo-400" />;
    case "droplets": return <Droplets size={20} className="text-cyan-400" />;
    case "zap": return <Zap size={20} className="text-rose-400" />;
    case "leaf": return <Leaf size={20} className="text-emerald-400" />;
    default: return <Award size={20} className="text-purple-400" />;
  }
};

export function MilestoneGallery() {
  const milestones = MOCK_MILESTONES;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="bg-surface/50 border border-border-subtle rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Award size={18} className="text-amber-400" />
        <h2 className="text-lg font-semibold text-primary">Milestone Gallery</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {milestones.map((m) => {
          const isLocked = !m.unlockedAt;
          
          return (
            <div 
              key={m.id} 
              className={`relative flex flex-col items-center text-center p-4 rounded-xl border transition-all ${
                isLocked 
                  ? 'bg-base/30 border-border-subtle grayscale opacity-50' 
                  : 'bg-base/80 border-border-subtle/50 hover:border-purple-500/30'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                isLocked ? 'bg-surface' : 'bg-surface shadow-[0_0_15px_rgba(168,85,247,0.2)]'
              }`}>
                {getMilestoneIcon(m.icon, isLocked)}
              </div>
              
              <h3 className="text-xs font-bold text-primary mb-1 leading-tight">{m.title}</h3>
              
              {!isLocked && m.unlockedAt && (
                 <span className="text-[9px] font-bold text-purple-400/80 uppercase tracking-wider mt-auto pt-2">
                   {new Date(m.unlockedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                 </span>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
