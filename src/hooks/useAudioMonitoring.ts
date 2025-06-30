import { useState, useEffect, useCallback } from 'react';
import { AudioAnalysis } from '../types/analysis';
import { 
  initializeAudioMonitoring, 
  stopAudioMonitoring, 
  analyzeAudioSegment 
} from '../utils/audioMonitoring';

export function useAudioMonitoring(enabled: boolean = true) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AudioAnalysis | null>(null);

  const startMonitoring = useCallback(async () => {
    try {
      const initialized = await initializeAudioMonitoring();
      if (!initialized) {
        throw new Error('Failed to initialize audio monitoring');
      }
      setIsMonitoring(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start audio monitoring');
      setIsMonitoring(false);
    }
  }, []);

  const stopMonitoring = useCallback(() => {
    stopAudioMonitoring();
    setIsMonitoring(false);
  }, []);

  useEffect(() => {
    if (enabled && !isMonitoring) {
      startMonitoring();
    }
    return () => {
      stopMonitoring();
    };
  }, [enabled, isMonitoring, startMonitoring, stopMonitoring]);

  useEffect(() => {
    if (!isMonitoring) return;

    let animationFrameId: number;
    
    async function analyze() {
      const analysis = await analyzeAudioSegment();
      if (analysis) {
        setCurrentAnalysis(analysis);
      }
      animationFrameId = requestAnimationFrame(analyze);
    }

    analyze();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isMonitoring]);

  return {
    isMonitoring,
    error,
    currentAnalysis,
    startMonitoring,
    stopMonitoring
  };
}