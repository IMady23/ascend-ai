"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Key, HardDrive, RefreshCw, Lock } from "lucide-react";

export function Security() {
  const securityItems = [
    { label: "Authentication", value: "Offline Mode", icon: Key, color: "text-amber-400" },
    { label: "Last Sync", value: "Never", icon: RefreshCw, color: "text-secondary" },
    { label: "Encryption", value: "AES-256 Enabled", icon: Lock, color: "text-emerald-400" },
    { label: "Local Storage", value: "Active", icon: HardDrive, color: "text-indigo-400" },
    { label: "Repository Layer", value: "Mock Mode", icon: DatabaseIcon, color: "text-purple-400" },
    { label: "Sync Layer", value: "Standby", icon: RefreshCw, color: "text-cyan-400" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
      className="bg-surface/30 border border-border-subtle/50 rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <ShieldAlert size={18} className="text-rose-400" />
        <h2 className="text-lg font-semibold text-primary">Security & Architecture</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {securityItems.map((item, i) => (
          <div key={i} className="p-3 bg-base/50 border border-border-subtle/50 rounded-lg flex items-center gap-3">
            <div className={`p-1.5 bg-surface rounded ${item.color}`}>
              <item.icon size={14} />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-secondary uppercase tracking-wider mb-0.5">{item.label}</span>
              <span className="block text-xs font-semibold text-primary">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Temporary inline icon for Database until we swap it or import correctly above if needed.
function DatabaseIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}
