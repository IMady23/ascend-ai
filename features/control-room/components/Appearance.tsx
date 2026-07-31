"use client";

import { useSettingsStore, type AppearanceConfig, type LocalizationConfig } from "@/stores/settings.store";
import { motion } from "framer-motion";
import { Paintbrush, LayoutTemplate, Sidebar, Sparkles, Monitor, Sun, Moon, Globe, Clock, Ruler } from "lucide-react";

export function Appearance() {
  const { appearance, updateAppearance, localization, updateLocalization } = useSettingsStore();
  const theme = appearance.theme;

  const handleToggle = (key: keyof AppearanceConfig) => {
    updateAppearance({ [key]: !appearance[key] });
  };
  
  const handleSelect = (key: keyof AppearanceConfig, value: string) => {
    updateAppearance({ [key]: value as any });
  };

  const handleLocalization = (key: keyof LocalizationConfig, value: string) => {
    updateLocalization({ [key]: value as any });
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    updateAppearance({ theme: newTheme });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.0 }}
      className="bg-surface border border-border-subtle rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-6">
        <Paintbrush size={18} className="text-[var(--color-accent-blue)]" />
        <h2 className="text-lg font-semibold text-primary">Appearance & Preferences</h2>
      </div>

      <div className="space-y-8">
        
        {/* Theme Previews */}
        <div>
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-primary">Theme</h3>
            <p className="text-[10px] text-secondary uppercase tracking-wider">Select your interface style</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Light Preview */}
            <button 
              onClick={() => handleThemeChange('light')}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/10' : 'border-border-subtle hover:border-[var(--color-text-disabled)] bg-base'}`}
            >
              <div className="w-full h-24 bg-base rounded-md border shadow-sm flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-2 left-2 right-2 h-4 bg-surface-elevated rounded" />
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <Sun size={20} className="text-blue-500" />
                </div>
              </div>
              <span className={`text-sm font-semibold ${theme === 'light' ? 'text-[var(--color-accent-blue)]' : 'text-primary'}`}>Light</span>
            </button>
            
            {/* Dark Preview */}
            <button 
              onClick={() => handleThemeChange('dark')}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/10' : 'border-border-subtle hover:border-[var(--color-text-disabled)] bg-base'}`}
            >
              <div className="w-full h-24 bg-surface rounded-md border border-border-subtle shadow-sm flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-2 left-2 right-2 h-4 bg-surface-elevated rounded" />
                <div className="w-12 h-12 rounded-full bg-indigo-900/50 flex items-center justify-center">
                  <Moon size={20} className="text-indigo-400" />
                </div>
              </div>
              <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-[var(--color-accent-blue)]' : 'text-primary'}`}>Dark</span>
            </button>
            
            {/* System Preview */}
            <button 
              onClick={() => handleThemeChange('system')}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/10' : 'border-border-subtle hover:border-[var(--color-text-disabled)] bg-base'}`}
            >
              <div className="w-full h-24 rounded-md border shadow-sm flex relative overflow-hidden">
                {/* Left side Light */}
                <div className="w-1/2 h-full bg-[#FFFFFF] flex items-center justify-center">
                  <Sun size={16} className="text-[#475569]" />
                </div>
                {/* Right side Dark */}
                <div className="w-1/2 h-full bg-surface flex items-center justify-center">
                  <Moon size={16} className="text-secondary" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-surface-elevated border border-border-subtle flex items-center justify-center shadow-md">
                    <Monitor size={14} className="text-secondary" />
                  </div>
                </div>
              </div>
              <span className={`text-sm font-semibold ${theme === 'system' ? 'text-[var(--color-accent-blue)]' : 'text-primary'}`}>System</span>
            </button>
          </div>
        </div>

        {/* Accent Color */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-base rounded-lg border border-border-subtle gap-4">
          <div>
            <h3 className="text-sm font-semibold text-primary">Accent Color</h3>
            <p className="text-[10px] text-secondary uppercase tracking-wider">Primary highlight color</p>
          </div>
          <div className="flex gap-3">
            {[
              { id: 'blue', bg: 'bg-blue-500', ring: 'ring-blue-500' },
              { id: 'purple', bg: 'bg-purple-500', ring: 'ring-purple-500' },
              { id: 'emerald', bg: 'bg-emerald-500', ring: 'ring-emerald-500' },
              { id: 'amber', bg: 'bg-amber-500', ring: 'ring-amber-500' },
              { id: 'rose', bg: 'bg-rose-500', ring: 'ring-rose-500' },
            ].map(color => (
              <button 
                key={color.id}
                onClick={() => handleSelect('accentColor', color.id)}
                className={`w-8 h-8 rounded-full ${color.bg} ${appearance.accentColor === color.id ? `ring-2 ring-offset-2 ring-offset-[var(--color-bg-base)] ${color.ring}` : 'opacity-70 hover:opacity-100 shadow-sm'}`}
                aria-label={`Select ${color.id} accent`}
              />
            ))}
          </div>
        </div>

        {/* Localization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-3 p-4 bg-base rounded-lg border border-border-subtle">
            <div className="flex items-center gap-2 text-secondary">
              <Ruler size={16} />
              <h3 className="text-sm font-semibold text-primary">Units</h3>
            </div>
            <div className="flex bg-surface p-1 rounded-md border border-border-subtle w-full">
              <button onClick={() => handleLocalization('units', 'metric')} className={`flex-1 py-1.5 text-xs font-semibold rounded ${localization.units === 'metric' ? 'bg-base shadow-sm text-primary' : 'text-secondary hover:text-primary'}`}>Metric</button>
              <button onClick={() => handleLocalization('units', 'imperial')} className={`flex-1 py-1.5 text-xs font-semibold rounded ${localization.units === 'imperial' ? 'bg-base shadow-sm text-primary' : 'text-secondary hover:text-primary'}`}>Imperial</button>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 p-4 bg-base rounded-lg border border-border-subtle">
            <div className="flex items-center gap-2 text-secondary">
              <Clock size={16} />
              <h3 className="text-sm font-semibold text-primary">Time Format</h3>
            </div>
            <div className="flex bg-surface p-1 rounded-md border border-border-subtle w-full">
              <button onClick={() => handleLocalization('timeFormat', '12h')} className={`flex-1 py-1.5 text-xs font-semibold rounded ${localization.timeFormat === '12h' ? 'bg-base shadow-sm text-primary' : 'text-secondary hover:text-primary'}`}>12-hour</button>
              <button onClick={() => handleLocalization('timeFormat', '24h')} className={`flex-1 py-1.5 text-xs font-semibold rounded ${localization.timeFormat === '24h' ? 'bg-base shadow-sm text-primary' : 'text-secondary hover:text-primary'}`}>24-hour</button>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-4 bg-base rounded-lg border border-border-subtle">
            <div className="flex items-center gap-2 text-secondary">
              <Globe size={16} />
              <h3 className="text-sm font-semibold text-primary">Language</h3>
            </div>
            <div className="flex bg-surface p-1 rounded-md border border-border-subtle w-full">
              <button className="flex-1 py-1.5 text-xs font-semibold rounded bg-base shadow-sm text-primary">English</button>
            </div>
          </div>
        </div>

        {/* Layout & Animation Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-base rounded-lg border border-border-subtle">
            <div className="flex items-center gap-3">
              <LayoutTemplate size={16} className="text-secondary" />
              <div>
                <h3 className="text-sm font-semibold text-primary">Compact Mode</h3>
              </div>
            </div>
            <button 
              onClick={() => handleToggle("compactLayout")}
              className={`w-10 h-5 rounded-full relative transition-colors ${appearance.compactLayout ? 'bg-[var(--color-accent-blue)]' : 'bg-[var(--color-border)]'}`}
            >
              <div className={`w-3 h-3 bg-base rounded-full absolute top-1 transition-all ${appearance.compactLayout ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-base rounded-lg border border-border-subtle">
            <div className="flex items-center gap-3">
              <Sidebar size={16} className="text-secondary" />
              <div>
                <h3 className="text-sm font-semibold text-primary">Collapse Sidebar</h3>
              </div>
            </div>
            <button 
              onClick={() => handleToggle("sidebarCollapsed")}
              className={`w-10 h-5 rounded-full relative transition-colors ${appearance.sidebarCollapsed ? 'bg-[var(--color-accent-blue)]' : 'bg-[var(--color-border)]'}`}
            >
              <div className={`w-3 h-3 bg-base rounded-full absolute top-1 transition-all ${appearance.sidebarCollapsed ? 'left-6' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-base rounded-lg border border-border-subtle">
            <div className="flex items-center gap-3">
              <Sparkles size={16} className="text-secondary" />
              <div>
                <h3 className="text-sm font-semibold text-primary">Reduce Motion</h3>
              </div>
            </div>
            <button 
              onClick={() => handleToggle("reduceMotion")}
              className={`w-10 h-5 rounded-full relative transition-colors ${appearance.reduceMotion ? 'bg-[var(--color-accent-blue)]' : 'bg-[var(--color-border)]'}`}
            >
              <div className={`w-3 h-3 bg-base rounded-full absolute top-1 transition-all ${appearance.reduceMotion ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
