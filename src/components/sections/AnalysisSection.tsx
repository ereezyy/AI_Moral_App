import React, { useState, useCallback } from 'react';
import { Video, Mic, Brain } from 'lucide-react';
import { VideoAnalyzer } from '../VideoAnalyzer';
import { AudioMonitor } from '../AudioMonitor';
import { TabNavigation } from '../navigation/TabNavigation';
import type { VideoAnalysis, AudioAnalysis } from '../../types/analysis';

interface AnalysisSectionProps {
  onVideoAnalysis: (analysis: VideoAnalysis) => void;
  onAudioAnalysis: (analysis: AudioAnalysis) => void;
}

export function AnalysisSection({ onVideoAnalysis, onAudioAnalysis }: AnalysisSectionProps) {
  const [activeTab, setActiveTab] = useState('video');

  const tabs = [
    {
      id: 'video',
      label: 'Camera View',
      icon: <Video className="w-4 h-4" />,
    },
    {
      id: 'audio',
      label: 'Voice Monitor',
      icon: <Mic className="w-4 h-4" />,
    },
    {
      id: 'combined',
      label: 'Full View',
      icon: <Brain className="w-4 h-4" />,
    }
  ];

  return (
    <div className="space-y-6">
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="pills"
      />

      {activeTab === 'video' && (
        <VideoAnalyzer onAnalysis={onVideoAnalysis} />
      )}

      {activeTab === 'audio' && (
        <AudioMonitor onAnalysis={onAudioAnalysis} />
      )}

      {activeTab === 'combined' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VideoAnalyzer onAnalysis={onVideoAnalysis} />
          <AudioMonitor onAnalysis={onAudioAnalysis} />
        </div>
      )}
    </div>
  );
}