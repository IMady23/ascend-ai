"use client";

import { motion } from "framer-motion";
import { DatabaseBackup, Download, Upload, AlertTriangle, FileText } from "lucide-react";

export function BackupData() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="bg-surface/30 border border-border-subtle/50 rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <DatabaseBackup size={18} className="text-amber-400" />
        <h2 className="text-lg font-semibold text-primary">Backup & Data</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button className="flex items-center gap-3 p-4 bg-base/50 border border-border-subtle/50 hover:border-border-subtle rounded-lg transition-colors group text-left">
          <div className="p-2 bg-surface rounded text-secondary group-hover:text-indigo-400 transition-colors">
            <Download size={18} />
          </div>
          <div>
            <span className="block text-sm font-semibold text-primary">Export Data</span>
            <span className="block text-[10px] text-secondary uppercase tracking-wider mt-0.5">Save JSON backup</span>
          </div>
        </button>

        <button className="flex items-center gap-3 p-4 bg-base/50 border border-border-subtle/50 hover:border-border-subtle rounded-lg transition-colors group text-left">
          <div className="p-2 bg-surface rounded text-secondary group-hover:text-emerald-400 transition-colors">
            <Upload size={18} />
          </div>
          <div>
            <span className="block text-sm font-semibold text-primary">Import Data</span>
            <span className="block text-[10px] text-secondary uppercase tracking-wider mt-0.5">Restore from backup</span>
          </div>
        </button>

        <button className="flex items-center gap-3 p-4 bg-base/50 border border-border-subtle/50 hover:border-border-subtle rounded-lg transition-colors group text-left">
          <div className="p-2 bg-surface rounded text-secondary group-hover:text-cyan-400 transition-colors">
            <FileText size={18} />
          </div>
          <div>
            <span className="block text-sm font-semibold text-primary">Download Report</span>
            <span className="block text-[10px] text-secondary uppercase tracking-wider mt-0.5">Get analytical PDF</span>
          </div>
        </button>

        <button className="flex items-center gap-3 p-4 bg-red-950/10 border border-red-900/30 hover:border-red-900/60 rounded-lg transition-colors group text-left">
          <div className="p-2 bg-red-950/50 rounded text-red-500 group-hover:text-red-400 transition-colors">
            <AlertTriangle size={18} />
          </div>
          <div>
            <span className="block text-sm font-semibold text-red-400">Reset Progress</span>
            <span className="block text-[10px] text-red-500/70 uppercase tracking-wider mt-0.5">Danger zone</span>
          </div>
        </button>
      </div>
    </motion.div>
  );
}
