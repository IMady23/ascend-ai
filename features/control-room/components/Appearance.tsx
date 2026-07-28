"use client";

import { useSettingsStore, type AppearanceConfig } from "@/stores/settings.store";
import { useThemeStore } from "@/stores/theme.store";
import { motion } from "framer-motion";
import { Paintbrush, LayoutTemplate, Sidebar, Sparkles } from "lucide-react";

export function Appearance() {
  const { appearance, updateAppearance } = useSettingsStore();
  const { theme, setTheme } = useThemeStore();

  const handleToggle = (key: keyof AppearanceConfig) => {
    updateAppearance({ [key]: !appearance[key] });
  };
  
  const handleSelect = (key: keyof AppearanceConfig, value: string) => {
    updateAppearance({ [key]: value as any });
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    updateAppearance({ theme: newTheme });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.0 }}
      className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Paintbrush size={18} className="text-pink-400" />
        <h2 className="text-lg font-semibold text-white">Appearance</h2>
      </div>

      <div className="space-y-4">
        {/* Theme */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">System Theme</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Overall color scheme</p>
          </div>
          <div className="flex bg-zinc-900 p-1 rounded-md border border-zinc-800">
             {(['dark', 'light', 'system'] as const).map(t => (
               <button 
                 key={t}
                 onClick={() => handleThemeChange(t)}
                 className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded ${theme === t ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
               >
                 {t}
               </button>
             ))}
          </div>
        </div>

        {/* Accent Color */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">Accent Color</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Primary highlight color</p>
          </div>
          <div className="flex gap-2">
            {[
              { id: 'purple', bg: 'bg-purple-500', ring: 'ring-purple-500' },
              { id: 'emerald', bg: 'bg-emerald-500', ring: 'ring-emerald-500' },
              { id: 'amber', bg: 'bg-amber-500', ring: 'ring-amber-500' },
              { id: 'rose', bg: 'bg-rose-500', ring: 'ring-rose-500' },
              { id: 'blue', bg: 'bg-blue-500', ring: 'ring-blue-500' },
            ].map(color => (
              <button 
                key={color.id}
                onClick={() => handleSelect('accentColor', color.id)}
                className={`w-6 h-6 rounded-full ${color.bg} ${appearance.accentColor === color.id ? `ring-2 ring-offset-2 ring-offset-zinc-950 ${color.ring}` : 'opacity-50 hover:opacity-100'}`}
              />
            ))}
          </div>
        </div>

        {/* Layout & Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
            <div className="flex items-center gap-3">
              <LayoutTemplate size={16} className="text-zinc-500" />
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">Compact Mode</h3>
                <p className="text-[9px] text-zinc-500 uppercase tracking-wider">Reduce padding</p>
              </div>
            </div>
            <button 
              onClick={() => handleToggle("compactLayout")}
              className={`w-10 h-5 rounded-full relative transition-colors ${appearance.compactLayout ? 'bg-pink-500' : 'bg-zinc-800'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${appearance.compactLayout ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
            <div className="flex items-center gap-3">
              <Sidebar size={16} className="text-zinc-500" />
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">Sidebar Collapse</h3>
                <p className="text-[9px] text-zinc-500 uppercase tracking-wider">Hide navigation</p>
              </div>
            </div>
            <button 
              onClick={() => handleToggle("sidebarCollapsed")}
              className={`w-10 h-5 rounded-full relative transition-colors ${appearance.sidebarCollapsed ? 'bg-pink-500' : 'bg-zinc-800'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${appearance.sidebarCollapsed ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
