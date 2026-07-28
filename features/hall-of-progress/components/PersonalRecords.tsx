"use client";

import { motion } from "framer-motion";
import { Medal, Flame, Footprints, Activity, Dumbbell, Leaf, Droplets } from "lucide-react";
import { MOCK_RECORDS } from "../constants";

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
  const records = MOCK_RECORDS;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Medal size={18} className="text-amber-400" />
        <h2 className="text-lg font-semibold text-white">Personal Records</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {records.map((record, i) => (
          <div key={record.id} className="bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-zinc-400">
                {getIcon(record.icon)}
                <span className="text-[10px] font-bold uppercase tracking-wider leading-tight w-20 line-clamp-2">
                  {record.title}
                </span>
              </div>
            </div>
            
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white font-mono">{record.value}</span>
                {record.unit && <span className="text-xs text-zinc-500 font-medium">{record.unit}</span>}
              </div>
              <span className="text-[10px] text-zinc-600 font-medium block mt-1 uppercase tracking-wider">
                {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
