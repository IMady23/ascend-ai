"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain } from "lucide-react";

export function AIReportPlaceholder() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="bg-surface/30 border border-border-subtle border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="w-16 h-16 rounded-full bg-surface border border-border-subtle flex items-center justify-center mb-4 relative z-10">
        <Brain size={28} className="text-disabled group-hover:text-purple-400 transition-colors duration-500" />
        <Sparkles size={14} className="text-purple-500 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
      </div>
      
      <h3 className="text-lg font-bold text-primary mb-2 relative z-10">Monthly AI Transformation Report</h3>
      <p className="text-sm text-secondary max-w-sm relative z-10">
        Deep analytical insights on your progress, generated automatically by Ascend AI.
      </p>
      
      <div className="mt-6 px-4 py-1.5 bg-surface border border-border-subtle rounded-full relative z-10">
        <span className="text-xs font-bold text-secondary uppercase tracking-wider">Coming Soon</span>
      </div>
    </motion.div>
  );
}
