"use client";

import { motion } from "framer-motion";
import { Camera, Image as ImageIcon } from "lucide-react";

export function ProgressPhotos() {
  const months = ["April 2024", "March 2024", "February 2024"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Camera size={18} className="text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Progress Vault</h2>
        </div>
        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
          Firebase Ready
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {months.map((month, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{month}</span>
            </div>
            
            {/* Image Placeholders */}
            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-[3/4] bg-zinc-950 border border-zinc-800/50 rounded-lg flex flex-col items-center justify-center text-zinc-700 hover:text-zinc-500 transition-colors cursor-pointer group">
                <ImageIcon size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Front</span>
              </div>
              <div className="aspect-[3/4] bg-zinc-950 border border-zinc-800/50 rounded-lg flex flex-col items-center justify-center text-zinc-700 hover:text-zinc-500 transition-colors cursor-pointer group">
                <ImageIcon size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Side</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
