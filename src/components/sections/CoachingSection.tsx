import React from 'react';
import { MessageSquare } from 'lucide-react';
import { LifePartnerInterface } from '../LifePartnerInterface';
import { AdvancedCoachingPanel } from '../AdvancedCoachingPanel';
import type { VideoAnalysis, AudioAnalysis } from '../../types/analysis';

interface CoachingSectionProps {
  videoAnalysis: VideoAnalysis | null;
  audioAnalysis: AudioAnalysis | null;
}

export function CoachingSection({ videoAnalysis, audioAnalysis }: CoachingSectionProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2">
        <LifePartnerInterface 
          videoAnalysis={videoAnalysis}
          audioAnalysis={audioAnalysis}
        />
      </div>
      <div>
        <AdvancedCoachingPanel />
      </div>
    </div>
  );
}