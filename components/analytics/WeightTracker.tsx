'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/stores/user.store';
import { eventBus } from '@/lib/events/EventBus';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Weight } from 'lucide-react';

const mockHistory = [
  { date: 'Mon', weight: 75.5 },
  { date: 'Tue', weight: 75.3 },
  { date: 'Wed', weight: 75.1 },
  { date: 'Thu', weight: 74.8 },
  { date: 'Fri', weight: 74.9 },
  { date: 'Sat', weight: 74.6 },
  { date: 'Sun', weight: 74.5 },
];

export function WeightTracker() {
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

  return (
    <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Weight className="w-5 h-5 text-emerald-500" />
          Weight Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Input 
            type="number"
            step="0.1"
            placeholder="Enter weight in kg"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="bg-zinc-800/50 border-zinc-700"
          />
          <Button onClick={handleLogWeight} disabled={isSubmitting || !weight} className="bg-emerald-600 hover:bg-emerald-700">
            Log Weight
          </Button>
        </div>
        
        <div className="h-64 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="date" stroke="#888" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis domain={['auto', 'auto']} stroke="#888" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                itemStyle={{ color: '#10b981' }}
              />
              <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
