"use client";

import React, { useState } from "react";
import { MotionCard } from "@/components/ui/motion/MotionCard";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { useAnalyticsStore } from "@/stores/analytics.store";
import { AnalyticsService } from "@/services/analytics/AnalyticsService";

export function ExportCenter() {
  const [isExporting, setIsExporting] = useState(false);
  const { hasData } = useAnalyticsStore();

  const handleCSVExport = async () => {
    if (!hasData) return;
    setIsExporting(true);
    
    try {
      const cache = AnalyticsService.getCache();
      
      // Comprehensive CSV combining all domains by Date
      const dates = new Set([
        ...cache.activities.map(a => a.date.toDate().toISOString().split("T")[0]),
        ...cache.nutritionLogs.map(n => n.date),
        ...cache.hydrationLogs.map(h => h.date),
        ...cache.dailyLogs.map(d => d.date)
      ]);

      const sortedDates = Array.from(dates).sort((a, b) => b.localeCompare(a));
      
      const headers = "Date,WeightKg,Steps,SleepHours,TotalCalories,TotalProtein,TotalCarbs,TotalFat,TotalWaterMl,WorkoutsCompleted,WorkoutTypes,TotalVolumeKg,TotalDistanceKm\n";
      
      const rows = sortedDates.map(date => {
        const dailyLog = cache.dailyLogs.find(d => d.date === date);
        const nutrition = cache.nutritionLogs.filter(n => n.date === date);
        const hydration = cache.hydrationLogs.filter(h => h.date === date);
        const activities = cache.activities.filter(a => a.date.toDate().toISOString().split("T")[0] === date);

        const weight = (dailyLog as any)?.weightKg || 0;
        const steps = dailyLog?.steps || 0;
        const sleep = (dailyLog as any)?.sleepHours || 0;

        const cal = nutrition.reduce((s, n) => s + (n.calories || 0), 0);
        const pro = nutrition.reduce((s, n) => s + (n.protein || 0), 0);
        const car = nutrition.reduce((s, n) => s + (n.carbs || 0), 0);
        const fat = nutrition.reduce((s, n) => s + (n.fat || 0), 0);

        const water = hydration.reduce((s, h) => s + (h.amountMl || 0), 0);

        const wCount = activities.length;
        const wTypes = activities.map(a => a.type).join("|") || "None";
        const vol = activities.reduce((s, a) => s + ((a.metrics?.totalVolume as number) || 0), 0);
        const dist = activities.reduce((s, a) => s + ((a.metrics?.distance as number) || 0), 0);

        return `${date},${weight},${steps},${sleep},${cal},${pro},${car},${fat},${water},${wCount},${wTypes},${vol},${dist}`;
      }).join("\n");
      
      const csvContent = headers + rows;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `ascend_analytics_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Failed to export CSV", e);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePDFExport = () => {
    // PDF generation will be added later without changing UI
    alert("PDF export will be available in a future update.");
  };

  return (
    <MotionCard className="glass-panel overflow-hidden" interactive={false}>
      <div className="p-6 border-b border-border-subtle bg-bg-surface">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-text-primary">
          <Download className="w-5 h-5 text-accent-blue" />
          Export Center
        </h3>
      </div>
      <div className="p-6 flex flex-col gap-4">
        <p className="text-text-secondary text-sm mb-2">
          Download your complete history of workouts, nutrition, and hydration for external analysis.
        </p>
        
        <div className="flex gap-4">
          <button 
            onClick={handleCSVExport}
            disabled={!hasData || isExporting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-bg-surface-elevated hover:bg-bg-surface-elevated/80 text-text-primary rounded-xl border border-border-subtle transition-colors disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4 text-accent-green" />
            <span className="font-medium">Export CSV</span>
          </button>
          
          <button 
            onClick={handlePDFExport}
            disabled={!hasData || isExporting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-bg-surface-elevated hover:bg-bg-surface-elevated/80 text-text-primary rounded-xl border border-border-subtle transition-colors disabled:opacity-50"
          >
            <FileText className="w-4 h-4 text-accent-orange" />
            <span className="font-medium">Export PDF</span>
          </button>
        </div>
      </div>
    </MotionCard>
  );
}
