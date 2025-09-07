import React from 'react';
import { TrendingUp, Award, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <h2 className="text-xl font-semibold mb-6">Performance Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-50 p-4 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <span className="font-medium">Weekly Score</span>
          </div>
          <div className="text-2xl font-bold text-indigo-600">
            {(stats.weeklyEthicalScore * 100).toFixed(0)}%
          </div>
          <p className="text-sm text-indigo-600/70 mt-1">Ethical alignment</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-green-50 p-4 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-green-600" />
            <span className="font-medium">Consistency Streak</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {stats.consistencyStreak} days
          </div>
          <p className="text-sm text-green-600/70 mt-1">Keep it up!</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-purple-50 p-4 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="font-medium">Total Decisions</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {stats.totalMoralDecisions}
          </div>
          <p className="text-sm text-purple-600/70 mt-1">Analyzed so far</p>
        </motion.div>
      </div>
    </div>
  );
}