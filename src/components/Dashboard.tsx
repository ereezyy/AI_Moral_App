import React, { useState, useCallback } from 'react';
import { Activity as ActivityIcon, Brain, Target, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ActivityTracker } from './ActivityTracker';
import { MoralDilemma } from './MoralDilemma';
import { AIResponse } from './AIResponse';
import { VideoAnalyzer } from './VideoAnalyzer';
import { MoralInsights } from './MoralInsights';
import { AudioMonitor } from './AudioMonitor';
import { PerformanceMetrics } from './PerformanceMetrics';
import { RealtimeAlerts } from './RealtimeAlerts';
import { VideoAnalysis, MoralAnalysis } from '../types/analysis';

export function Dashboard() {
  const { activities, stats, dailyGoals } = useStore();
  const [videoAnalysis, setVideoAnalysis] = useState<VideoAnalysis | null>(null);
  const [moralAnalysis, setMoralAnalysis] = useState<MoralAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userInput, setUserInput] = useState('');

  const handleVideoAnalysis = useCallback((analysis: VideoAnalysis) => {
    setVideoAnalysis(analysis);
  }, []);

  const handleSituationSubmit = useCallback(async (response: string) => {
    setIsProcessing(true);
    setUserInput(response);
    
    try {
      // Simulate moral analysis with realistic data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const analysis: MoralAnalysis = {
        ethicalAlignment: Math.random() * 0.3 + 0.7, // 70-100%
        conflictingValues: response.toLowerCase().includes('difficult') 
          ? ['individual_autonomy_vs_social_harmony', 'immediate_vs_long_term_consequences']
          : ['emotional_reaction_vs_rational_judgment'],
        potentialConsequences: {
          shortTerm: ['immediate_social_dynamics', 'emotional_responses'],
          longTerm: ['relationship_development', 'personal_growth']
        },
        recommendedActions: [
          'Consider the impact on all stakeholders',
          'Evaluate long-term consequences',
          'Maintain transparency in decision-making',
          'Seek additional perspectives if needed'
        ],
        moralPrinciples: [
          { principle: 'autonomy', relevance: Math.random() * 0.3 + 0.7 },
          { principle: 'beneficence', relevance: Math.random() * 0.3 + 0.6 },
          { principle: 'justice', relevance: Math.random() * 0.3 + 0.5 },
          { principle: 'care', relevance: Math.random() * 0.3 + 0.8 }
        ]
      };
      
      setMoralAnalysis(analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
      setError('Failed to analyze situation. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const [error, setError] = useState<string | null>(null);
  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 p-4 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-semibold">Daily Goals</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(dailyGoals).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-indigo-600 font-semibold">{value} minutes</span>
                </div>
              ))}
            </div>
          </div>

          <VideoAnalyzer onAnalysis={handleVideoAnalysis} />
          <AudioMonitor />
          <ActivityTracker activities={activities} />
        </div>

        <div className="space-y-6">
          {isProcessing && (
            <div className="bg-indigo-50 p-4 rounded-lg flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
              <span>Processing moral analysis...</span>
            </div>
          )}

          <MoralDilemma 
            dilemma={{
              question: "Share Your Current Situation",
              context: "Describe any ethical dilemma or decision you're facing for personalized AI guidance",
              considerations: [
                "Real-time facial expression analysis",
                "Audio sentiment monitoring", 
                "Multi-principle ethical evaluation",
                "Personalized recommendations"
              ]
            }}
            onSubmit={handleSituationSubmit}
            isProcessing={isProcessing}
          />

          {moralAnalysis && (
            <div className="space-y-4">
              {userInput && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Your Situation:</h3>
                  <p className="text-blue-700">"{userInput}"</p>
                </div>
              )}
            <MoralInsights analysis={moralAnalysis} />
            </div>
          )}

          <PerformanceMetrics stats={stats} />
          <RealtimeAlerts />
        </div>
      </div>
    </div>
  );
}