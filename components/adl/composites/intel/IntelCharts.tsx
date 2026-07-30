"use client";

import React from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useRouter } from "next/navigation";
import { Caption } from "@/components/adl/typography";

export default function IntelCharts({ 
  trendCategory, 
  chartData 
}: { 
  trendCategory: string; 
  chartData: any[]; 
}) {
  const router = useRouter();

  return (
    <ResponsiveContainer width="100%" height="100%">
      {trendCategory === "workout" ? (
        <BarChart data={chartData} onClick={(data: any) => {
          if (data && data.activePayload) router.push(`/training?date=${data.activePayload[0].payload.date}`);
        }}>
          <XAxis dataKey="label" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip cursor={{fill: 'var(--color-bg-surface)'}} content={<CustomTooltip category="workout" />} />
          <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill="var(--color-accent-blue)" />)}
          </Bar>
        </BarChart>
      ) : trendCategory === "nutrition" ? (
        <BarChart data={chartData} onClick={(data: any) => {
          if (data && data.activePayload) router.push(`/nutrition?date=${data.activePayload[0].payload.date}`);
        }}>
          <XAxis dataKey="label" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip cursor={{fill: 'var(--color-bg-surface)'}} content={<CustomTooltip category="nutrition" />} />
          <Bar dataKey="protein" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.protein >= 150 ? "var(--color-success)" : "var(--color-warning)"} />)}
          </Bar>
        </BarChart>
      ) : (
        <LineChart data={chartData}>
          <XAxis dataKey="label" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip cursor={{stroke: 'var(--color-text-muted)', strokeWidth: 1, strokeDasharray: '5 5'}} content={<CustomTooltip category="recovery" />} />
          <Line type="monotone" dataKey="score" stroke="var(--color-accent-green)" strokeWidth={3} dot={{r: 4, fill: "var(--color-bg-base)", strokeWidth: 2}} activeDot={{r: 6}} />
        </LineChart>
      )}
    </ResponsiveContainer>
  );
}

function CustomTooltip({ active, payload, label, category }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[var(--color-bg-surface)] border border-[var(--color-glass-border)] p-4 rounded-xl shadow-xl z-50">
        <Caption className="text-[var(--color-text-muted)] font-bold mb-2">{new Date(data.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})}</Caption>
        
        {category === "workout" && (
          <div className="space-y-1">
            <div className="flex justify-between gap-4"><span className="text-[var(--color-text-secondary)] text-sm">Volume</span><span className="text-white font-bold">{data.volume} kg</span></div>
            <div className="flex justify-between gap-4"><span className="text-[var(--color-text-secondary)] text-sm">Sets</span><span className="text-white font-bold">{data.sets}</span></div>
            <div className="flex justify-between gap-4"><span className="text-[var(--color-text-secondary)] text-sm">Duration</span><span className="text-white font-bold">{data.duration} min</span></div>
          </div>
        )}
        
        {category === "nutrition" && (
          <div className="space-y-1">
            <div className="flex justify-between gap-4"><span className="text-[var(--color-text-secondary)] text-sm">Protein</span><span className="text-white font-bold">{data.protein}g</span></div>
            <div className="flex justify-between gap-4"><span className="text-[var(--color-text-secondary)] text-sm">Calories</span><span className="text-white font-bold">{data.calories}</span></div>
            <div className="flex justify-between gap-4"><span className="text-[var(--color-text-secondary)] text-sm">Carbs</span><span className="text-white font-bold">{data.carbs}g</span></div>
          </div>
        )}

        {category === "recovery" && (
          <div className="space-y-1">
            <div className="flex justify-between gap-4"><span className="text-[var(--color-text-secondary)] text-sm">Score</span><span className="text-white font-bold">{data.score}/100</span></div>
            <div className="flex justify-between gap-4"><span className="text-[var(--color-text-secondary)] text-sm">Sleep</span><span className="text-white font-bold">{data.sleep} hrs</span></div>
          </div>
        )}
      </div>
    );
  }
  return null;
}
