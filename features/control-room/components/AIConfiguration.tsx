"use client";

import { useSettingsStore, type AIConfig } from "@/stores/settings.store";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

export function AIConfiguration() {
  const { ai, updateAi } = useSettingsStore();

  const handleToggle = (key: keyof AIConfig) => {
    updateAi({ [key]: !ai[key] });
  };
  
  const handleSelect = (key: keyof AIConfig, value: string) => {
    updateAi({ [key]: value as any });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-surface/30 border border-border-subtle/50 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-rose-400" />
          <h2 className="text-lg font-semibold text-primary">AI Configuration</h2>
        </div>
        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider bg-base px-2 py-1 rounded">Local</span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-base/50 rounded-lg border border-border-subtle/50">
          <div>
            <h3 className="text-sm font-semibold text-primary">Coaching Style</h3>
            <p className="text-[10px] text-secondary uppercase tracking-wider">AI tone and delivery</p>
          </div>
          <select 
            value={ai.coachingStyle}
            onChange={(e) => handleSelect("coachingStyle", e.target.value)}
            className="bg-surface border border-border-subtle text-primary text-xs rounded-md px-2 py-1 outline-none focus:border-rose-500/50"
          >
            <option value="analytical">Analytical</option>
            <option value="military">Military</option>
            <option value="supportive">Supportive</option>
            <option value="balanced">Balanced</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-3 bg-base/50 rounded-lg border border-border-subtle/50">
          <div>
            <h3 className="text-sm font-semibold text-primary">Motivation Style</h3>
            <p className="text-[10px] text-secondary uppercase tracking-wider">Push intensity</p>
          </div>
          <select 
            value={ai.motivationStyle}
            onChange={(e) => handleSelect("motivationStyle", e.target.value)}
            className="bg-surface border border-border-subtle text-primary text-xs rounded-md px-2 py-1 outline-none focus:border-rose-500/50"
          >
            <option value="logical">Logical</option>
            <option value="aggressive">Aggressive</option>
            <option value="gentle">Gentle</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-3 bg-base/50 rounded-lg border border-border-subtle/50">
          <div>
            <h3 className="text-sm font-semibold text-primary">Insight Frequency</h3>
            <p className="text-[10px] text-secondary uppercase tracking-wider">How often AI analyzes data</p>
          </div>
          <select 
            value={ai.insightFrequency}
            onChange={(e) => handleSelect("insightFrequency", e.target.value)}
            className="bg-surface border border-border-subtle text-primary text-xs rounded-md px-2 py-1 outline-none focus:border-rose-500/50"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-3 bg-base/50 rounded-lg border border-border-subtle/50">
          <div>
            <h3 className="text-sm font-semibold text-primary">Daily Briefing</h3>
            <p className="text-[10px] text-secondary uppercase tracking-wider">Morning summary</p>
          </div>
          <button 
            onClick={() => handleToggle("dailyBriefing")}
            className={`w-10 h-5 rounded-full relative transition-colors ${ai.dailyBriefing ? 'bg-rose-500' : 'bg-surface-elevated'}`}
          >
            <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${ai.dailyBriefing ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-base/50 rounded-lg border border-border-subtle/50">
          <div>
            <h3 className="text-sm font-semibold text-primary">Weekly Review</h3>
            <p className="text-[10px] text-secondary uppercase tracking-wider">Sunday night deep dive</p>
          </div>
          <button 
            onClick={() => handleToggle("weeklyReview")}
            className={`w-10 h-5 rounded-full relative transition-colors ${ai.weeklyReview ? 'bg-rose-500' : 'bg-surface-elevated'}`}
          >
            <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${ai.weeklyReview ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
