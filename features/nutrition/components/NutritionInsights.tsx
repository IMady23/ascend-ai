"use client";

import { MOCK_INSIGHTS } from "../constants";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

export function NutritionInsights() {
  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-6 px-1">AI Insights</h2>
      <div className="space-y-4">
        {MOCK_INSIGHTS.map((insight) => {
          const isWarning = insight.type === "warning";
          const isSuccess = insight.type === "success";
          
          return (
            <div 
              key={insight.id} 
              className={`p-5 rounded-2xl border flex gap-4 ${
                isWarning ? "bg-amber-950/20 border-amber-900/50" :
                isSuccess ? "bg-emerald-950/20 border-emerald-900/50" :
                "bg-blue-950/20 border-blue-900/50"
              }`}
            >
              <div className={`mt-1 ${
                isWarning ? "text-amber-500" :
                isSuccess ? "text-emerald-500" :
                "text-blue-500"
              }`}>
                {isWarning && <AlertCircle size={20} />}
                {isSuccess && <CheckCircle2 size={20} />}
                {!isWarning && !isSuccess && <Info size={20} />}
              </div>
              <div>
                <h3 className={`font-bold text-sm mb-1 ${
                  isWarning ? "text-amber-400" :
                  isSuccess ? "text-emerald-400" :
                  "text-blue-400"
                }`}>
                  {insight.title}
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {insight.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
