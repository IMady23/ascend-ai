"use client";

import { motion } from "framer-motion";
import { Database, Brain, RefreshCw, HardDrive, Shield, Bell } from "lucide-react";
import type { SystemService, SystemStatus } from "../types";

const getStatusColor = (status: SystemStatus) => {
  switch (status) {
    case "operational": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "ready": return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
    case "offline": return "text-secondary bg-zinc-500/10 border-zinc-500/20";
    case "warning": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    case "coming_soon": return "text-purple-400 bg-purple-500/10 border-purple-500/20";
    default: return "text-secondary bg-zinc-500/10 border-zinc-500/20";
  }
};

const getStatusIndicator = (status: SystemStatus) => {
  switch (status) {
    case "operational": return "bg-emerald-500";
    case "ready": return "bg-indigo-500";
    case "offline": return "bg-zinc-500";
    case "warning": return "bg-amber-500";
    case "coming_soon": return "bg-purple-500";
    default: return "bg-zinc-500";
  }
};

export function SystemOverview() {
  const services: (SystemService & { icon: any })[] = [
    { id: "s1", name: "Firebase", status: "offline", description: "Backend infrastructure", icon: Database },
    { id: "s2", name: "Ascend AI Engine", status: "ready", description: "Intelligence & Coaching", icon: Brain },
    { id: "s3", name: "Sync Layer", status: "operational", description: "Local to cloud pipeline", icon: RefreshCw },
    { id: "s4", name: "Local Storage", status: "operational", description: "Zustand persistence", icon: HardDrive },
    { id: "s5", name: "Authentication", status: "offline", description: "User session manager", icon: Shield },
    { id: "s6", name: "Push Notifications", status: "coming_soon", description: "Device alerts", icon: Bell },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h2 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4 ml-1">System Overview</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.id} className="bg-surface/50 border border-border-subtle/50 rounded-xl p-4 flex flex-col justify-between backdrop-blur-sm group hover:border-border-subtle/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-base rounded-lg text-secondary group-hover:text-purple-400 transition-colors">
                <service.icon size={16} />
              </div>
              
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border ${getStatusColor(service.status)}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${getStatusIndicator(service.status)} ${service.status === 'operational' ? 'animate-pulse' : ''}`} />
                <span className="text-[9px] font-bold uppercase tracking-wider">{service.status.replace("_", " ")}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-primary mb-0.5">{service.name}</h3>
              <p className="text-[10px] font-medium text-secondary uppercase tracking-wider">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
