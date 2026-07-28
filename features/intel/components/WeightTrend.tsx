"use client";

import { useUserStore } from "@/stores/user.store";
import { TrendingDown, Scale } from "lucide-react";
import { MOCK_WEIGHT_HISTORY } from "../constants";

export function WeightTrend() {
  const { profile } = useUserStore();
  const currentWeight = profile?.weight || 91;
  const data = MOCK_WEIGHT_HISTORY;

  // Simple SVG calculation
  const minWeight = Math.min(...data.map(d => d.weight)) - 1;
  const maxWeight = Math.max(...data.map(d => d.weight)) + 1;
  const range = maxWeight - minWeight;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.weight - minWeight) / range) * 100;
    return `${x},${y}`;
  }).join(" ");

  const latestChange = data[data.length - 1].weight - data[0].weight;
  const isLoss = latestChange <= 0;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Scale size={18} className="text-zinc-400" />
          <h2 className="text-lg font-semibold text-white">Weight Trend</h2>
        </div>
        <div className="flex items-center gap-1 bg-zinc-800/50 px-3 py-1 rounded-full">
          <TrendingDown size={14} className={isLoss ? "text-emerald-400" : "text-rose-400"} />
          <span className="text-xs font-medium text-zinc-300">
            {latestChange > 0 ? "+" : ""}{latestChange.toFixed(1)} kg
          </span>
        </div>
      </div>

      <div className="flex items-end gap-2 mb-8">
        <span className="text-4xl font-black text-white font-mono">{currentWeight}</span>
        <span className="text-zinc-500 font-medium mb-1">kg</span>
      </div>

      {/* SVG Line Chart */}
      <div className="h-32 w-full relative">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible preserve-3d" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="currentColor" className="text-zinc-800" strokeWidth="0.5" strokeDasharray="2" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" className="text-zinc-800" strokeWidth="0.5" strokeDasharray="2" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="currentColor" className="text-zinc-800" strokeWidth="0.5" strokeDasharray="2" />
          
          {/* Data line */}
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            className="text-emerald-500"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 100 - ((d.weight - minWeight) / range) * 100;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="#18181b"
                stroke="currentColor"
                className="text-emerald-400"
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {/* X Axis Labels */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
          {data.map((d, i) => (
            <span key={i}>{d.date}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
