import React, { useState } from 'react';
import { TrendingUp, Sparkles, Brain, Infinity } from 'lucide-react';
import { TabNavigation } from '../navigation/TabNavigation';
import { PredictiveInsights } from '../PredictiveInsights';
import { MultidimensionalInsights } from '../MultidimensionalInsights';
import { HolisticLifeDashboard } from '../HolisticLifeDashboard';
import { QuantumConsciousnessPanel } from '../QuantumConsciousnessPanel';
import type { VideoAnalysis, AudioAnalysis } from '../../types/analysis';

interface InsightsSectionProps {
  videoAnalysis: VideoAnalysis | null;
  audioAnalysis: AudioAnalysis | null;
}

export function InsightsSection({ videoAnalysis, audioAnalysis }: InsightsSectionProps) {
  const [activeTab, setActiveTab] = useState('predictive');

  const tabs = [
    {
      id: 'predictive',
      label: 'Predictions',
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: 'multidimensional',
      label: 'Consciousness',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'holistic',
      label: 'Life Analysis',
      icon: <Brain className="w-4 h-4" />,
    },
    {
      id: 'quantum',
      label: 'Quantum Field',
      icon: <Infinity className="w-4 h-4" />,
    }
  ];

  return (
    <div className="space-y-6">
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="underline"
      />

      {activeTab === 'predictive' && (
        <PredictiveInsights 
          videoAnalysis={videoAnalysis}
          audioAnalysis={audioAnalysis}
        />
      )}

      {activeTab === 'multidimensional' && (
        <MultidimensionalInsights 
          videoAnalysis={videoAnalysis}
          audioAnalysis={audioAnalysis}
        />
      )}

      {activeTab === 'holistic' && (
        <HolisticLifeDashboard 
          videoAnalysis={videoAnalysis}
          audioAnalysis={audioAnalysis}
        />
      )}

      {activeTab === 'quantum' && (
        <QuantumConsciousnessPanel 
          videoAnalysis={videoAnalysis}
          audioAnalysis={audioAnalysis}
        />
      )}
    </div>
  );
}