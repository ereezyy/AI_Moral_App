import React from 'react';
import { WeeklyProgress, ConsistencyStreak, TotalDecisions } from './stats';

interface PerformanceMetricsProps {
  stats: {
    weeklyEthicalScore: number;
    consistencyStreak: number;
    totalMoralDecisions: number;
  };
}

export function PerformanceMetrics({ stats }: PerformanceMetricsProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <WeeklyProgress weeklyEthicalScore={stats.weeklyEthicalScore} />
        <ConsistencyStreak streak={stats.consistencyStreak} />
        <TotalDecisions total={stats.totalMoralDecisions} />
      </div>
    </div>
  );
}