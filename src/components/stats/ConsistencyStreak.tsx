import React from 'react';
import { Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConsistencyStreakProps {
  streak: number;
}

export function ConsistencyStreak({ streak }: ConsistencyStreakProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-green-50 p-4 rounded-lg"
    >
      <div className="flex items-center gap-2 mb-2">
        <Award className="w-5 h-5 text-green-600" />
        <span className="font-medium">Streak</span>
      </div>
      <div className="text-2xl font-bold text-green-600">
        {streak} days
      </div>
    </motion.div>
  );
}