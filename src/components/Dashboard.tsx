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
import { analyzeMoralContext } from '../utils/analysis/moral-analysis';

export function Dashboard() {
  const { activities, stats, dailyGoals } = useStore();
  const [videoAnalysis, setVideoAnalysis] = useState<VideoAnalysis | null>(null);
  const [moralAnalysis, setMoralAnalysis] = useState<MoralAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVideoAnalysis = useCallback((analysis: VideoAnalysis) => {
    setVideoAnalysis(analysis);
  }, []);

  const handleSituationSubmit = async (response: string) => {
    if (!videoAnalysis) return;
    
    setIsProcessing(true);
    
    try {
      const analysis = await analyzeMoralContext(
        response,
        videoAnalysis
      );
      
      setMoralAnalysis(analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {isProcessing && (
            <div className="bg-indigo-50 p-4 rounded-lg flex items-center gap-2">
              <AlertCircle className="text-indigo-600 animate-pulse" />
              <span>Processing moral analysis...</span>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-semibold">Daily Goals</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(dailyGoals).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="capitalize">{key.replace('_', ' ')}</span>
                  <span>{value} minutes</span>
                </div>
              ))}
            </div>
          </div>

          <VideoAnalyzer onAnalysis={handleVideoAnalysis} />
          <AudioMonitor />
          <ActivityTracker activities={activities} />
        </div>

        <div className="space-y-6">
          <MoralDilemma 
            dilemma={{
              question: "Real-time Situation Analysis",
              context: "Share your current situation for AI-powered moral guidance",
              considerations: [
                "Real-time facial expression analysis",
                "Environmental context detection",
                "Historical pattern recognition",
                "Multi-factor ethical evaluation"
              ]
            }}
            onSubmit={handleSituationSubmit}
          />

          {moralAnalysis && (
            <MoralInsights analysis={moralAnalysis} />
          )}

          <PerformanceMetrics stats={stats} />
          <RealtimeAlerts />
        </div>
      </div>
    </div>
  );
}