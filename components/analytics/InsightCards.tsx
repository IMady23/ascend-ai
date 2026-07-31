"use client";

import { useEffect, useState } from "react";
import { Insight } from "@/types/insights";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface InsightCardsProps {
  userId: string;
}

export function InsightCards({ userId }: InsightCardsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch from a new API route that calls InsightEngine
    const fetchInsights = async () => {
      try {
        const response = await fetch('/api/insights');
        if (response.ok) {
          const data = await response.json();
          setInsights(data.insights);
        }
      } catch (error) {
        console.error("Failed to fetch insights", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInsights();
  }, [userId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse bg-card/50 h-24 rounded-2xl border-none" />
        ))}
      </div>
    );
  }

  if (insights.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {insights.map((insight) => (
        <Card key={insight.id} className="rounded-2xl border-none bg-card/40 backdrop-blur-md shadow-sm hover:bg-card/60 transition-colors">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="text-3xl bg-background/50 p-2 rounded-full h-12 w-12 flex items-center justify-center">
              {insight.icon || '💡'}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground/80">{insight.title}</h4>
                {insight.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                {insight.trend === 'down' && <TrendingDown className="w-4 h-4 text-rose-500" />}
                {insight.trend === 'neutral' && <Minus className="w-4 h-4 text-muted-foreground" />}
              </div>
              <p className="text-xs text-muted-foreground">{insight.description}</p>
              {insight.value && (
                <p className={`text-lg font-bold ${insight.trend === 'up' ? 'text-emerald-500' : insight.trend === 'down' ? 'text-rose-500' : ''}`}>
                  {insight.value}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
