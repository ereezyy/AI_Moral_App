import React, { useState } from 'react';
import { User, Activity, BarChart3, Brain } from 'lucide-react';
import { TabNavigation } from '../navigation/TabNavigation';
import { PsychologicalProfile } from '../PsychologicalProfile';
import { ActivityTracker } from '../ActivityTracker';
import { PerformanceMetrics } from '../PerformanceMetrics';
import { useStore } from '../../store/useStore';
import type { VideoAnalysis, AudioAnalysis } from '../../types/analysis';

interface ProfileSectionProps {
  videoAnalysis: VideoAnalysis | null;
  audioAnalysis: AudioAnalysis | null;
}

export function ProfileSection({ videoAnalysis, audioAnalysis }: ProfileSectionProps) {
  const [activeTab, setActiveTab] = useState('psychological');
  const { activities, stats } = useStore();

  const tabs = [
    {
      id: 'psychological',
      label: 'Psychology',
      icon: <Brain className="w-4 h-4" />,
    },
    {
      id: 'activity',
      label: 'Activities',
      icon: <Activity className="w-4 h-4" />,
      badge: activities.length || undefined
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: <BarChart3 className="w-4 h-4" />,
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

      {activeTab === 'psychological' && (
        <PsychologicalProfile 
          videoAnalysis={videoAnalysis}
          audioAnalysis={audioAnalysis}
        />
      )}

      {activeTab === 'activity' && (
        <ActivityTracker activities={activities} />
      )}

      {activeTab === 'performance' && (
        <PerformanceMetrics stats={stats} />
      )}
    </div>
  );
}