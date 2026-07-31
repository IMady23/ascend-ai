'use client';

import React, { useState } from 'react';
import { MotionCard } from '@/components/ui/motion/MotionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/stores/user.store';
import { eventBus } from '@/lib/events/EventBus';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Weight, Target } from 'lucide-react';

export interface WeightTrackerProps {
  status: 'loading' | 'error' | 'data' | 'no-data';
  history?: { date: string; weight: number | null }[];
}

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-64 text-center p-6">
    <Target className="w-12 h-12 text-text-secondary mb-4 opacity-50" />
    <h3 className="text-lg font-medium text-text-primary mb-2">No Weight Data Yet</h3>
    <p className="text-text-secondary text-sm">
      Log your weight to start tracking your progress.
    </p>
  </div>
);

const LoadingState = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-text-primary"></div>
  </div>
);

const ErrorState = () => (
  <div className="flex items-center justify-center h-64 text-danger">
    <p>Failed to load weight history.</p>
  </div>
);

export function WeightTracker({ status, history = [] }: WeightTrackerProps) {
  const { userId } = useUserStore();
  const [weight, setWeight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogWeight = () => {
    if (!weight || !userId) return;
    
    setIsSubmitting(true);
    
    eventBus.dispatch({
      id: crypto.randomUUID(),
      userId: userId,
      type: 'WEIGHT_UPDATED',
      timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
      metadata: {
        weightKg: parseFloat(weight),
        source: 'manual',
      },
      processed: false,
    });
    
    setWeight('');
    setIsSubmitting(false);
  };

  const renderContent = () => {
    switch (status) {
      case 'loading': return <LoadingState />;
      case 'error': return <ErrorState />;
      case 'no-data': return <EmptyState />;
      case 'data': return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
            <XAxis dataKey="date" stroke="var(--color-text-secondary)" tick={{ fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
            <YAxis domain={['auto', 'auto']} stroke="var(--color-text-secondary)" tick={{ fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--color-accent-green)' }}
            />
            <Line type="monotone" dataKey="weight" stroke="var(--color-accent-green)" strokeWidth={3} dot={{ fill: 'var(--color-accent-green)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <MotionCard className="glass-panel" interactive={false}>
      <div className="p-6 border-b border-border-subtle">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-text-primary">
          <Weight className="w-5 h-5 text-accent-nutrition" />
          Weight Tracker
        </h3>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Input 
            type="number"
            step="0.1"
            placeholder="Enter weight in kg"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && weight && !isSubmitting) {
                handleLogWeight();
              }
            }}
            className="bg-surface-elevated/50 border-border-subtle text-text-primary"
          />
          <Button onClick={handleLogWeight} disabled={isSubmitting || !weight} className="bg-accent-nutrition hover:opacity-90 text-white">
            Log Weight
          </Button>
        </div>
        
        <div className="h-64 mt-6">
          {renderContent()}
        </div>
      </div>
    </MotionCard>
  );
}
