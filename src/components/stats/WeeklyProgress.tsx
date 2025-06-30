import React from 'react';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeeklyProgressProps {
  weeklyEthicalScore: number;
}

export function WeeklyProgress({ weeklyEthicalScore }: WeeklyProgressProps) {
  return (
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
        {(weeklyEthicalScore * 100).toFixed(0)}%
      </div>
    </motion.div>
  );
}