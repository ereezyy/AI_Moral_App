import { useState, useCallback, useRef, useEffect } from 'react';
import { AudioAnalysis } from '../types/analysis';
import { initializeAudioAnalysis, analyzeAudioSegment, stopAudioAnalysis, getAudioAnalysisStream, isAudioAnalysisReady } from '../utils/audioAnalysis';

export function useAudioMonitoring(onAnalysis?: (analysis: AudioAnalysis) => void, enabled: boolean = true) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AudioAnalysis | null>(null);
  const streamControlRef = useRef<{ start: () => void; stop: () => void } | null>(null);

  const startMonitoring = useCallback(async () => {
    if (isMonitoring) return;
    
    try {
      const initialized = await initializeAudioAnalysis();
      if (!initialized) {
        throw new Error('Failed to initialize audio analysis');
      }

      // Set up analysis stream
      streamControlRef.current = getAudioAnalysisStream((analysis) => {
        setCurrentAnalysis(analysis);
        onAnalysis?.(analysis);
      }, 300); // Analyze every 300ms
      
      streamControlRef.current.start();
      setIsMonitoring(true);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to start audio monitoring');
      setIsMonitoring(false);
    }
  }, []);

  const stopMonitoring = useCallback(() => {
    if (streamControlRef.current) {
      streamControlRef.current.stop();
      streamControlRef.current = null;
    }
    
    stopAudioAnalysis();
    setCurrentAnalysis(null);
    setIsMonitoring(false);
  }, []);

  useEffect(() => {
    return () => {
      stopMonitoring();
    }
  }, [stopMonitoring]);

  return {
    isMonitoring,
    error,
    currentAnalysis,
    startMonitoring,
    stopMonitoring
  };
}