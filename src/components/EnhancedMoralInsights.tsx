import React from 'react';
import { Brain, Lightbulb, Scale, AlertTriangle, Clock, Users, Heart, Gauge } from 'lucide-react';
import { MoralAnalysis } from '../types/analysis';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedMoralInsightsProps {
  analysis: MoralAnalysis;
}

export function EnhancedMoralInsights({ analysis }: EnhancedMoralInsightsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Enhanced Moral Insights</h2>
      </div>

      <div className="space-y-8">
        {/* Advanced Ethical Alignment Gauge */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Gauge className="w-5 h-5 text-indigo-600" />
            <h3 className="font-medium">Ethical Alignment</h3>
          </div>
          <div className="relative">
            <div className="h-4 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${analysis.ethicalAlignment * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
              />
            </div>
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
          <div className="mt-8 grid grid-cols-3 gap-2 text-xs text-center">
            <div>Critical Concern<br/>(0-33%)</div>
            <div>Needs Attention<br/>(34-66%)</div>
            <div>Ethically Sound<br/>(67-100%)</div>
          </div>
        </div>

        {/* Enhanced Conflicting Values */}
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
                    className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      </div>
                      <div>
                        <div className="font-medium text-amber-700">
                          {value.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </div>
                        <p className="text-sm text-amber-600 mt-1">
                          {this.getConflictDescription(value)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Impact Timeline */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h3 className="font-medium">Impact Timeline</h3>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Immediate Impact
              </h4>
              <div className="grid gap-2">
                {analysis.potentialConsequences.shortTerm.map((consequence, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="font-medium text-blue-700">
                          {consequence.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </div>
                        <p className="text-sm text-blue-600 mt-1">
                          {this.getConsequenceDescription(consequence, 'short')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Long-term Impact
              </h4>
              <div className="grid gap-2">
                {analysis.potentialConsequences.longTerm.map((consequence, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="font-medium text-purple-700">
                          {consequence.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </div>
                        <p className="text-sm text-purple-600 mt-1">
                          {this.getConsequenceDescription(consequence, 'long')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Recommended Actions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-indigo-600" />
            <h3 className="font-medium">Recommended Actions</h3>
          </div>
          <div className="grid gap-3">
            {analysis.recommendedActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-indigo-600 font-medium">
                    {index + 1}.
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-indigo-700">{action}</div>
                    <p className="text-sm text-indigo-600 mt-1">
                      {this.getActionDescription(action)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enhanced Moral Principles */}
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
                className="p-4 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-lg border border-gray-200"
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
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Relevance</span>
                  <span className="text-sm font-medium text-indigo-600">
                    {(relevance * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {this.getPrincipleDescription(principle)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  private getConflictDescription(conflict: string): string {
    const descriptions: Record<string, string> = {
      individual_autonomy_vs_social_harmony: 'Balancing personal freedom with group cohesion',
      emotional_reaction_vs_rational_judgment: 'Managing emotional responses while maintaining objectivity',
      immediate_vs_long_term_consequences: 'Weighing short-term benefits against long-term impacts'
    };
    return descriptions[conflict] || 'Analyzing potential ethical conflicts';
  }

  private getConsequenceDescription(consequence: string, type: 'short' | 'long'): string {
    const descriptions: Record<string, string> = {
      immediate_social_dynamics: 'Direct impact on current relationships and social interactions',
      potential_trust_erosion: 'Possible decrease in trust and credibility',
      immediate_safety_concerns: 'Immediate risks to well-being and security',
      relationship_pattern_formation: 'Development of lasting behavioral patterns',
      professional_reputation_impact: 'Long-term effects on professional standing'
    };
    return descriptions[consequence] || `${type === 'short' ? 'Immediate' : 'Long-term'} impact analysis`;
  }

  private getActionDescription(action: string): string {
    const descriptions: Record<string, string> = {
      'Reassess decision considering ethical principles': 'Take time to evaluate the decision against core moral values',
      'Take time to process emotions before acting': 'Allow emotional responses to settle before making decisions',
      'Consider seeking external perspective': 'Gain insights from uninvolved parties for better objectivity'
    };
    return descriptions[action] || 'Strategic action for ethical improvement';
  }

  private getPrincipleDescription(principle: string): string {
    const descriptions: Record<string, string> = {
      autonomy: 'Respect for individual choice and self-determination',
      beneficence: 'Active promotion of well-being and benefit',
      non_maleficence: 'Avoiding harm to others',
      justice: 'Fair and equitable treatment',
      fidelity: 'Maintaining trust and keeping commitments',
      utility: 'Maximizing overall benefit for all involved',
      care: 'Showing concern and compassion for others',
      virtue: 'Embodying moral excellence and character'
    };
    return descriptions[principle] || 'Core ethical principle';
  }
}