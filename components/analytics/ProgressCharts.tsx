'use client';

import React from 'react';
import { MotionCard } from '@/components/ui/motion/MotionCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend } from 'recharts';
import { Activity, Dumbbell, Flame, Utensils, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAnalyticsStore } from '@/stores/analytics.store';

export interface ProgressChartsProps {
  status: 'loading' | 'no-data' | 'data' | 'error';
  data?: any;
}

const EmptyState = ({ title, message, icon: Icon }: { title: string, message: string, icon: any }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center h-72 text-center p-6 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-surface-elevated/50 z-0 pointer-events-none" />
    <Icon className="w-12 h-12 text-text-secondary mb-4 opacity-50 z-10" />
    <h3 className="text-lg font-medium text-text-primary mb-2 z-10">{title}</h3>
    <p className="text-text-secondary text-sm z-10 max-w-[200px]">
      {message}
    </p>
  </motion.div>
);

const LoadingState = () => (
  <div className="flex items-center justify-center h-72">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-text-primary"></div>
  </div>
);

const ErrorState = () => (
  <div className="flex items-center justify-center h-72 text-danger">
    <p>Failed to load analytics data.</p>
  </div>
);

export function ProgressCharts({ status, data }: ProgressChartsProps) {
  const hasSteps = data?.steps && data.steps.some((d: any) => d.steps > 0);
  const hasHydration = data?.hydration && data.hydration.some((d: any) => d.water > 0);
  const hasGoals = data?.goals && data.goals.some((d: any) => d.value > 0);
  const hasWorkoutSplit = data?.workoutSplit && data.workoutSplit.length > 0 && data.workoutSplit[0].name !== 'No Data Yet';

  const { setInteractionState, clearInteractionState } = useAnalyticsStore();

  const handleChartHover = (e: any, metric: string) => {
    if (e?.activePayload?.[0]?.payload?.date) {
      setInteractionState({
        hoveredDate: e.activePayload[0].payload.date,
        activeMetric: metric,
        inspectionMode: 'hover'
      });
    }
  };

  const handleChartLeave = () => {
    clearInteractionState();
  };

  const renderContent = (hasDataCheck: boolean, chartRenderer: () => React.ReactNode, emptyProps: any) => {
    switch (status) {
      case 'loading': return <LoadingState />;
      case 'error': return <ErrorState />;
      case 'data': 
      case 'no-data': 
        return hasDataCheck ? chartRenderer() : <EmptyState {...emptyProps} />;
    }
  };

  const COLORS = ['var(--color-accent-blue)', 'var(--color-accent-green)', 'var(--color-accent-gold)', 'var(--color-accent-orange)', 'var(--color-accent-purple)'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Steps Chart */}
      <MotionCard className="glass-panel" interactive={false}>
        <div className="p-6 border-b border-border-subtle">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-text-primary">
            <Activity className="w-5 h-5 text-accent-blue" />
            Step History
          </h3>
        </div>
        <div className="p-6">
          <div className="h-72">
            {renderContent(hasSteps, () => (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={data?.steps || []} 
                  margin={{ top: 10, right: 4, left: 0, bottom: 0 }}
                  onMouseMove={(e) => handleChartHover(e, 'steps')}
                  onMouseLeave={handleChartLeave}
                >
                  <defs>
                    <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent-blue)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--color-accent-blue)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--color-text-secondary)" tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis width={40} stroke="var(--color-text-secondary)" tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', fontSize: 12 }}
                    itemStyle={{ color: 'var(--color-accent-blue)' }}
                    wrapperStyle={{ zIndex: 100 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="steps" 
                    stroke="var(--color-accent-blue)" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorSteps)" 
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ), { title: "No Steps Recorded", message: "Connect a tracker or log your daily steps.", icon: Activity })}
          </div>
        </div>
      </MotionCard>

      {/* Hydration Chart */}
      <MotionCard className="glass-panel" interactive={false}>
        <div className="p-6 border-b border-border-subtle">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-text-primary">
            <Target className="w-5 h-5 text-accent-hydration" />
            Hydration Tracking (ml)
          </h3>
        </div>
        <div className="p-6">
          <div className="h-72">
            {renderContent(hasHydration, () => (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={data?.hydration || []} 
                  margin={{ top: 10, right: 4, left: 0, bottom: 0 }}
                  onMouseMove={(e) => handleChartHover(e, 'hydration')}
                  onMouseLeave={handleChartLeave}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--color-text-secondary)" tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis width={40} stroke="var(--color-text-secondary)" tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', fontSize: 12, cursor: 'default' }}
                    itemStyle={{ color: 'var(--color-accent-hydration)' }}
                    cursor={{ fill: 'var(--color-bg-surface)' }}
                    wrapperStyle={{ zIndex: 100 }}
                  />
                  <Bar 
                    dataKey="water" 
                    fill="var(--color-accent-hydration)" 
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            ), { title: "Hydration Empty", message: "Log your water intake to see trends.", icon: Target })}
          </div>
        </div>
      </MotionCard>

      {/* Workout Split Donut */}
      <MotionCard className="glass-panel" interactive={false}>
        <div className="p-6 border-b border-border-subtle">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-text-primary">
            <Dumbbell className="w-5 h-5 text-accent-workout" />
            Workout Split
          </h3>
        </div>
        <div className="p-6">
          <div className="h-72">
            {renderContent(hasWorkoutSplit, () => (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={data?.workoutSplit || []}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  >
                    {data?.workoutSplit?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', fontSize: 12 }} wrapperStyle={{ zIndex: 100 }} />
                  <Legend iconType="circle" verticalAlign="bottom" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ), { title: "No Workouts Logged", message: "Complete a workout to see your muscular split.", icon: Dumbbell })}
          </div>
        </div>
      </MotionCard>

      {/* Monthly Goal Completion (Radial Gauge) */}
      <MotionCard className="glass-panel" interactive={false}>
        <div className="p-6 border-b border-border-subtle">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-text-primary">
            <Flame className="w-5 h-5 text-accent-orange" />
            Goal Completion
          </h3>
        </div>
        <div className="p-6">
          <div className="h-72">
            {renderContent(hasGoals, () => (
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" barSize={12} 
                  data={data?.goals || []}
                >
                  <RadialBar 
                    background 
                    dataKey="value" 
                    cornerRadius={10} 
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                  <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" wrapperStyle={{ bottom: 0, fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', fontSize: 12 }} wrapperStyle={{ zIndex: 100 }} />
                </RadialBarChart>
              </ResponsiveContainer>
            ), { title: "Goals Pending", message: "Achieve daily goals to fill your rings.", icon: Flame })}
          </div>
        </div>
      </MotionCard>
    </div>
  );
}
