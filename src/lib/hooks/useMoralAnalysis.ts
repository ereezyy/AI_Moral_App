import { useState, useCallback } from 'react';
import { moralService } from '../services';
import type { MoralAnalysis, AudioAnalysis, VideoAnalysis, SituationalContext } from '../types';

export function useMoralAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeSituation = useCallback(async (
    audioAnalysis: AudioAnalysis,
    videoAnalysis: VideoAnalysis,
    situationalContext: SituationalContext,
    userInput: string
  ): Promise<MoralAnalysis | null> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const analysis = await moralService.analyzeMoralContext(
        audioAnalysis,
        videoAnalysis,
        situationalContext,
        userInput
      );
      return analysis;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    isAnalyzing,
    error,
    analyzeSituation
  };
}