import React, { useState, useEffect } from 'react';
import { TrendingUp, Brain, Target, AlertTriangle, Sparkles, Clock, Users, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { predictiveAnalysisService } from '../lib/services/predictiveAnalysisService';
import type { VideoAnalysis, AudioAnalysis } from '../types/analysis';

interface PredictiveInsightsProps {
  videoAnalysis: VideoAnalysis | null;
  audioAnalysis: AudioAnalysis | null;
}

interface InsightCard {
  id: string;
  type: 'behavioral' | 'emotional' | 'decision' | 'risk';
  title: string;
  content: string;
  confidence: number;
  timeframe: string;
  actions: string[];
  predictions: string[];
}

export function PredictiveInsights({ videoAnalysis, audioAnalysis }: PredictiveInsightsProps) {
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

  useEffect(() => {
    const analyzePatterns = async () => {
      if (!videoAnalysis && !audioAnalysis) return;

      setIsAnalyzing(true);
      
      try {
        // Simulate advanced predictive analysis
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockInsights: InsightCard[] = [
          {
            id: 'behavioral-pattern-1',
            type: 'behavioral',
            title: 'Decision-Making Pattern Identified',
            content: 'Your conversation patterns suggest you tend to seek extensive input before major decisions. This thoroughness is a strength, but may sometimes delay action.',
            confidence: 0.84,
            timeframe: 'Next 1-2 weeks',
            actions: [
              'Set decision deadlines to prevent analysis paralysis',
              'Trust your instincts after gathering 80% of information',
              'Create a simple decision framework'
            ],
            predictions: [
              'Decision confidence will increase with structured approach',
              'Stress levels may decrease with clearer timelines'
            ]
          },
          {
            id: 'emotional-trend-1',
            type: 'emotional',
            title: 'Emotional Growth Trajectory',
            content: 'Based on facial expression analysis and conversation tone, you show increasing emotional awareness and regulation skills.',
            confidence: 0.76,
            timeframe: 'Ongoing development',
            actions: [
              'Continue mindfulness practices',
              'Document emotional insights',
              'Practice expressing needs clearly'
            ],
            predictions: [
              'Interpersonal relationships likely to improve',
              'Decision satisfaction expected to increase'
            ]
          },
          {
            id: 'risk-assessment-1',
            type: 'risk',
            title: 'Stress Management Priority',
            content: 'Current indicators suggest moderate stress levels. Your perfectionist tendencies may be contributing to unnecessary pressure.',
            confidence: 0.72,
            timeframe: 'Immediate attention recommended',
            actions: [
              'Practice "good enough" standards for non-critical tasks',
              'Schedule regular breaks and self-care',
              'Consider talking to someone about stress management'
            ],
            predictions: [
              'Productivity may improve with reduced perfectionism',
              'Overall well-being likely to enhance with stress management'
            ]
          },
          {
            id: 'decision-outcome-1',
            type: 'decision',
            title: 'Decision Success Prediction',
            content: 'Your thoughtful approach to decision-making, combined with strong values alignment, suggests high probability of positive outcomes.',
            confidence: 0.81,
            timeframe: '3-6 months outlook',
            actions: [
              'Document decision rationale for future reference',
              'Set up success metrics to track outcomes',
              'Plan for potential adjustments along the way'
            ],
            predictions: [
              'Decisions aligned with values likely to bring satisfaction',
              'Learning from outcomes will strengthen future decisions'
            ]
          }
        ];
        
        setInsights(mockInsights);
      } catch (error) {
        console.error('Predictive analysis failed:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    // Run analysis when new data is available
    if (videoAnalysis || audioAnalysis) {
      analyzePatterns();
    }
  }, [videoAnalysis, audioAnalysis]);

  const getInsightIcon = (type: InsightCard['type']) => {
    switch (type) {
      case 'behavioral':
        return <Brain className="w-5 h-5 text-blue-600" />;
      case 'emotional':
        return <Heart className="w-5 h-5 text-purple-600" />;
      case 'decision':
        return <Target className="w-5 h-5 text-green-600" />;
      case 'risk':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getInsightStyle = (type: InsightCard['type']) => {
    switch (type) {
      case 'behavioral':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'emotional':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'decision':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'risk':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Predictive Insights</h2>
        {isAnalyzing && (
          <div className="ml-auto flex items-center gap-2 text-sm text-indigo-600">
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            Analyzing patterns...
          </div>
        )}
      </div>

      {insights.length === 0 && !isAnalyzing && (
        <div className="text-center py-8 text-gray-500">
          <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Waiting for behavioral data to generate insights...</p>
          <p className="text-xs opacity-75 mt-1">
            Insights will appear as you interact with the AI partner
          </p>
        </div>
      )}

      <AnimatePresence>
        {insights.map((insight) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-4 p-4 rounded-lg border ${getInsightStyle(insight.type)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getInsightIcon(insight.type)}
                <h3 className="font-semibold text-sm">{insight.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                  {Math.round(insight.confidence * 100)}%
                </span>
                <button
                  onClick={() => setSelectedInsight(
                    selectedInsight === insight.id ? null : insight.id
                  )}
                  className="text-xs underline hover:no-underline"
                >
                  {selectedInsight === insight.id ? 'Less' : 'Details'}
                </button>
              </div>
            </div>

            <p className="text-sm mb-3 opacity-90">{insight.content}</p>

            <div className="flex items-center justify-between text-xs opacity-75">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{insight.timeframe}</span>
              </div>
              <span className="capitalize">{insight.type} insight</span>
            </div>

            <AnimatePresence>
              {selectedInsight === insight.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-current border-opacity-20"
                >
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">🎯 Recommended Actions:</h4>
                    <ul className="text-sm space-y-1">
                      {insight.actions.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0"></span>
                          <span className="opacity-90">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">🔮 Predictions:</h4>
                    <ul className="text-sm space-y-1">
                      {insight.predictions.map((prediction, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0"></span>
                          <span className="opacity-90">{prediction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>

      {insights.length > 0 && (
        <div className="mt-6 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
          <div className="flex items-center gap-2 text-indigo-700 text-sm">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">AI Learning Active</span>
          </div>
          <p className="text-xs text-indigo-600 mt-1">
            These insights improve over time as the AI learns more about your patterns and preferences.
          </p>
        </div>
      )}
    </div>
  );
}