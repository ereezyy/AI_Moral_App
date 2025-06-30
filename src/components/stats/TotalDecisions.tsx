import React from 'react';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface TotalDecisionsProps {
  total: number;
}

export function TotalDecisions({ total }: TotalDecisionsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-purple-50 p-4 rounded-lg"
    >
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-5 h-5 text-purple-600" />
        <span className="font-medium">Total Decisions</span>
      </div>
      <div className="text-2xl font-bold text-purple-600">
        {total}
      </div>
    </motion.div>
  );
}