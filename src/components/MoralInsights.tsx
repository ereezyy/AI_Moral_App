import React from 'react';
import { Brain, Lightbulb, Scale, AlertTriangle, Clock, Users, Heart } from 'lucide-react';
import { MoralAnalysis } from '../types/analysis';
import { motion, AnimatePresence } from 'framer-motion';

interface MoralInsightsProps {
  analysis: MoralAnalysis;
}

export function MoralInsights({ analysis }: MoralInsightsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Moral Insights</h2>
      </div>

      <div className="space-y-8">
        {/* Ethical Alignment Gauge */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-5 h-5 text-indigo-600" />
            <h3 className="font-medium">Ethical Alignment</h3>
          </div>
          <div className="relative h-4 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${analysis.ethicalAlignment * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
            />
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: `${analysis.ethicalAlignment * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-6 -ml-3"
            >
              <div className="text-sm font-medium text-indigo-600">
                {(analysis.ethicalAlignment * 100).toFixed(0)}%
              </div>
            </motion.div>
          </div>
        </div>

        {/* Conflicting Values */}
        <AnimatePresence>
          {analysis.conflictingValues.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-medium">Ethical Tensions</h3>
              </div>
              <div className="grid gap-2">
                {analysis.conflictingValues.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-md"
                  >
                    {value.split('_').join(' ')}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Consequences Timeline */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h3 className="font-medium">Impact Timeline</h3>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Short-term Impact</h4>
              <div className="grid gap-2">
                {analysis.potentialConsequences.shortTerm.map((consequence, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-blue-50 text-blue-700 rounded-md"
                  >
                    {consequence.split('_').join(' ')}
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Long-term Impact</h4>
              <div className="grid gap-2">
                {analysis.potentialConsequences.longTerm.map((consequence, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-purple-50 text-purple-700 rounded-md"
                  >
                    {consequence.split('_').join(' ')}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Actions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-indigo-600" />
            <h3 className="font-medium">Recommended Actions</h3>
          </div>
          <div className="grid gap-2">
            {analysis.recommendedActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-md"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-indigo-600 font-medium">{index + 1}.</div>
                  <div className="flex-1">{action}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Moral Principles */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-indigo-600" />
            <h3 className="font-medium">Core Principles</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {analysis.moralPrinciples.map(({ principle, relevance }) => (
              <motion.div
                key={principle}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-4 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-lg"
              >
                <div className="text-sm font-medium text-gray-700 capitalize mb-2">
                  {principle.replace('_', ' ')}
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${relevance * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
                  />
                </div>
                <div className="text-xs text-right mt-1 text-gray-600">
                  {(relevance * 100).toFixed(0)}% relevance
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}