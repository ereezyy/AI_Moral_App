import React, { useState, useEffect } from 'react';
import { TrendingUp, Brain, Target, Clock, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { conversationService } from '../lib/services/conversationService';
import { ErrorHandler } from '../lib/utils/error/errorHandler';
import { TextAnalyzer } from '../lib/utils/textAnalysis';
import type { VideoAnalysis, AudioAnalysis } from '../types/analysis';

interface PredictiveInsightsProps {
  videoAnalysis: VideoAnalysis | null;
  audioAnalysis: AudioAnalysis | null;
}

interface PredictiveInsight {
  category: 'behavioral' | 'emotional' | 'decision' | 'growth';
  insight: string;
  confidence: number;
  timeframe: string;
  recommendations: string[];
}

export function PredictiveInsights({ videoAnalysis, audioAnalysis }: PredictiveInsightsProps) {
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const generateInsights = async () => {
      setIsAnalyzing(true);
      
      try {
        const conversationHistory = conversationService.getConversationHistory(20);
        const userProfile = conversationService.getUserProfile();
        
        const newInsights = await generatePredictiveInsights(
          conversationHistory,
          userProfile,
          videoAnalysis,
          audioAnalysis
        );
        
        setInsights(newInsights);
      } catch (error) {
        ErrorHandler.handle(error, 'Predictive insights generation');
      } finally {
        setIsAnalyzing(false);
      }
    };

    if (videoAnalysis || audioAnalysis) {
      generateInsights();
    }
  }, [videoAnalysis, audioAnalysis]);

  const generatePredictiveInsights = async (
    history: any[],
    profile: any,
    video: VideoAnalysis | null,
    audio: AudioAnalysis | null
  ): Promise<PredictiveInsight[]> => {
    const insights: PredictiveInsight[] = [];
    const allText = history.map(msg => msg.content || '').join(' ');
    
    // Behavioral predictions
    const stressWords = TextAnalyzer.countKeywords(allText, ['stress', 'overwhelm', 'pressure']);
    if (stressWords > 2) {
      insights.push({
        category: 'behavioral',
        insight: 'Stress management patterns suggest need for proactive coping strategies',
        confidence: 0.75,
        timeframe: 'Next few days',
        recommendations: [
          'Schedule regular stress-relief activities',
          'Practice preventive relaxation techniques',
          'Identify stress triggers early'
        ]
      });
    }

    // Emotional predictions based on video analysis
    if (video && video.facialExpression.sadness > 0.4) {
      insights.push({
        category: 'emotional',
        insight: 'Emotional processing period may continue for a few days',
        confidence: 0.68,
        timeframe: 'This week',
        recommendations: [
          'Allow time for emotional processing',
          'Engage in supportive activities',
          'Consider reaching out to trusted friends'
        ]
      });
    }

    // Decision-making predictions
    const decisionWords = TextAnalyzer.countKeywords(allText, ['decision', 'choice', 'unsure']);
    if (decisionWords > 1) {
      insights.push({
        category: 'decision',
        insight: 'Decision confidence will improve with structured analysis',
        confidence: 0.72,
        timeframe: 'Within a week',
        recommendations: [
          'Use values-based decision framework',
          'Gather input from trusted advisors',
          'Set a decision deadline to avoid prolonged uncertainty'
        ]
      });
    }

    // Growth predictions
    const growthWords = TextAnalyzer.countKeywords(allText, ['learn', 'grow', 'improve', 'develop']);
    if (growthWords > 2) {
      insights.push({
        category: 'growth',
        insight: 'Strong growth mindset indicates accelerated personal development',
        confidence: 0.81,
        timeframe: 'Next few weeks',
        recommendations: [
          'Set specific, measurable growth goals',
          'Track progress regularly',
          'Celebrate small wins along the way'
        ]
      });
    }

    // Audio-based predictions
    if (audio && audio.clarity > 0.8) {
      insights.push({
        category: 'behavioral',
        insight: 'Clear communication style suggests effective problem-solving ahead',
        confidence: 0.77,
        timeframe: 'Ongoing',
        recommendations: [
          'Continue using your communication strengths',
          'Practice active listening',
          'Share insights with others'
        ]
      });
    }

    return insights.length > 0 ? insights : [{
      category: 'growth',
      insight: 'Building self-awareness through ongoing reflection',
      confidence: 0.65,
      timeframe: 'Continuous',
      recommendations: [
        'Continue engaging in thoughtful self-reflection',
        'Notice patterns in your thoughts and behaviors',
        'Stay open to new insights about yourself'
      ]
    }];
  };

  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'behavioral': return <Target className="w-4 h-4" />;
      case 'emotional': return <Brain className="w-4 h-4" />;
      case 'decision': return <CheckCircle className="w-4 h-4" />;
      case 'growth': return <TrendingUp className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'behavioral': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'emotional': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'decision': return 'text-green-600 bg-green-50 border-green-200';
      case 'growth': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-orange-600';
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

      {!insights.length && !isAnalyzing && (
        <div className="text-center py-8 text-gray-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Predictive insights will appear as you interact with the AI...</p>
          <p className="text-xs opacity-75 mt-1">
            Behavioral patterns, emotional trends, and growth predictions
          </p>
        </div>
      )}

      {insights.length > 0 && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({insights.length})
            </button>
            {['behavioral', 'emotional', 'decision', 'growth'].map(category => {
              const count = insights.filter(i => i.category === category).length;
              return count > 0 ? (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors capitalize ${
                    selectedCategory === category
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category} ({count})
                </button>
              ) : null;
            })}
          </div>

          {/* Insights */}
          <AnimatePresence>
            {filteredInsights.map((insight, index) => (
              <motion.div
                key={`${insight.category}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${getCategoryColor(insight.category)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getCategoryIcon(insight.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="capitalize font-medium text-sm">
                        {insight.category} Prediction
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                          {Math.round(insight.confidence * 100)}% confidence
                        </span>
                        <span className="text-xs text-gray-500">
                          {insight.timeframe}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm mb-3">{insight.insight}</p>
                    
                    <div className="space-y-1">
                      <h4 className="text-xs font-medium text-gray-700">Recommendations:</h4>
                      <ul className="space-y-1">
                        {insight.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-xs flex items-center gap-2">
                            <div className="w-1 h-1 bg-current rounded-full opacity-60"></div>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {insights.length > 0 && (
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <div className="flex items-center gap-2 text-indigo-700 text-sm">
            <Brain className="w-4 h-4" />
            <span className="font-medium">Predictive Intelligence Active</span>
          </div>
          <p className="text-xs text-indigo-600 mt-1">
            These insights are generated from real conversation patterns, emotional analysis,
            and behavioral data to help predict and prepare for future challenges and opportunities.
          </p>
        </div>
      )}
    </div>
  );
}