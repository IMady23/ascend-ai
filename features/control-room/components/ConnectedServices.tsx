"use client";

import { motion } from "framer-motion";
import { Link, CheckCircle2, Cloud, Heart, Calendar as CalendarIcon, HardDrive } from "lucide-react";
import type { ConnectedService } from "../types";

export function ConnectedServices() {
  const services: ConnectedService[] = [
    { id: "cs1", name: "Firebase", status: "not_connected", icon: "cloud" },
    { id: "cs2", name: "Gemini AI", status: "available", icon: "brain" },
    { id: "cs3", name: "Apple Health", status: "coming_soon", icon: "heart" },
    { id: "cs4", name: "Google Fit", status: "coming_soon", icon: "heart" },
    { id: "cs5", name: "System Calendar", status: "coming_soon", icon: "calendar" },
    { id: "cs6", name: "Cloud Storage", status: "not_connected", icon: "harddrive" },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "cloud": return <Cloud size={16} />;
      case "heart": return <Heart size={16} />;
      case "calendar": return <CalendarIcon size={16} />;
      case "harddrive": return <HardDrive size={16} />;
      default: return <Link size={16} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="bg-surface/30 border border-border-subtle/50 rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Link size={18} className="text-emerald-400" />
        <h2 className="text-lg font-semibold text-primary">Connected Services</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.id} className="p-3 bg-base/50 rounded-lg border border-border-subtle/50 flex flex-col justify-between min-h-[100px]">
             <div className="flex items-start justify-between mb-3">
               <div className="text-secondary">
                 {getIcon(service.icon)}
               </div>
               {service.status === "connected" && <CheckCircle2 size={14} className="text-emerald-500" />}
             </div>
             
             <div>
               <h3 className="text-sm font-semibold text-primary mb-1">{service.name}</h3>
               <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                 service.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                 service.status === 'available' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                 service.status === 'coming_soon' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                 'bg-surface-elevated/50 text-secondary border-border-subtle/50'
               }`}>
                 {service.status.replace("_", " ")}
               </span>
             </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
