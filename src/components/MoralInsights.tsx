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
      className="bg-background rounded-lg shadow-theme-lg p-6 border border-border"
    >
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Moral Insights</h2>
      </div>

      <div className="space-y-8">
        {/* Ethical Alignment Gauge */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-foreground">Ethical Alignment</h3>
          </div>
          <div className="relative h-4 bg-muted rounded-full overflow-hidden border border-border">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${analysis.ethicalAlignment * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute h-full bg-primary"
            />
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: `${analysis.ethicalAlignment * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-6 -ml-3"
            >
              <div className="text-sm font-medium text-primary">
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
                <AlertTriangle className="w-5 h-5 text-warning" />
                <h3 className="font-medium text-foreground">Ethical Tensions</h3>
              </div>
              <div className="grid gap-2">
                {analysis.conflictingValues.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-warning/10 text-warning rounded-md border border-warning/20"
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
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-foreground">Impact Timeline</h3>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Short-term Impact</h4>
              <div className="grid gap-2">
                {analysis.potentialConsequences.shortTerm.map((consequence, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-info/10 text-info rounded-md border border-info/20"
                  >
                    {consequence.split('_').join(' ')}
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Long-term Impact</h4>
              <div className="grid gap-2">
                {analysis.potentialConsequences.longTerm.map((consequence, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-primary/10 text-primary rounded-md border border-primary/20"
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
            <Lightbulb className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-foreground">Recommended Actions</h3>
          </div>
          <div className="grid gap-2">
            {analysis.recommendedActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-accent rounded-md border border-border"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-primary font-medium">{index + 1}.</div>
                  <div className="flex-1 text-foreground">{action}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Moral Principles */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-foreground">Core Principles</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {analysis.moralPrinciples.map(({ principle, relevance }) => (
              <motion.div
                key={principle}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-4 bg-muted rounded-lg border border-border"
              >
                <div className="text-sm font-medium text-foreground capitalize mb-2">
                  {principle.replace('_', ' ')}
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${relevance * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute h-full bg-primary"
                  />
                </div>
                <div className="text-xs text-right mt-1 text-muted-foreground">
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