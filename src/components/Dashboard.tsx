import React, { useState, useCallback } from 'react';
import { Activity as ActivityIcon, Brain, Target, AlertCircle, Heart } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ActivityTracker } from './ActivityTracker';
import { LifePartnerInterface } from './LifePartnerInterface';
import { VideoAnalyzer } from './VideoAnalyzer';
import { AudioMonitor } from './AudioMonitor';
import { PerformanceMetrics } from './PerformanceMetrics';
import { RealtimeAlerts } from './RealtimeAlerts';
import { VideoAnalysis, AudioAnalysis } from '../types/analysis';

export function Dashboard() {
  const { activities, stats, dailyGoals } = useStore();
  const [videoAnalysis, setVideoAnalysis] = useState<VideoAnalysis | null>(null);
  const [audioAnalysis, setAudioAnalysis] = useState<AudioAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVideoAnalysis = useCallback((analysis: VideoAnalysis) => {
    setVideoAnalysis(analysis);
  }, []);

  const handleAudioAnalysis = useCallback((analysis: AudioAnalysis) => {
    setAudioAnalysis(analysis);
  }, []);

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
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow-lg p-6 border border-indigo-100">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-indigo-800">Life Goals</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(dailyGoals).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-white/60 rounded-lg border border-indigo-100">
                  <span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-indigo-600 font-semibold">{value} minutes</span>
                </div>
              ))}
            </div>
          </div>

          <VideoAnalyzer onAnalysis={handleVideoAnalysis} />
          <AudioMonitor onAnalysis={handleAudioAnalysis} />
          <ActivityTracker activities={activities} />
        </div>

        <div className="space-y-6">
          <LifePartnerInterface 
            videoAnalysis={videoAnalysis}
            audioAnalysis={audioAnalysis}
          />

          <PerformanceMetrics stats={stats} />
          <RealtimeAlerts />
        </div>
      </div>
    </div>
  );
}