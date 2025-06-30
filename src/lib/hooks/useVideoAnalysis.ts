import { useState, useCallback, useEffect } from 'react';
import { videoService } from '../services';
import type { VideoAnalysis } from '../types';

export function useVideoAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startAnalysis = useCallback(async () => {
    try {
      const mediaStream = await videoService.startStream();
      setStream(mediaStream);
      setIsAnalyzing(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start video analysis');
      setIsAnalyzing(false);
    }
  }, []);

  const stopAnalysis = useCallback(() => {
    videoService.cleanup();
    setStream(null);
    setIsAnalyzing(false);
  }, []);

  useEffect(() => {
    return () => {
      stopAnalysis();
    };
  }, [stopAnalysis]);

  const analyzeFrame = useCallback(async (
    videoElement: HTMLVideoElement
  ): Promise<VideoAnalysis | null> => {
    if (!isAnalyzing) return null;
    return videoService.analyzeFrame(videoElement);
  }, [isAnalyzing]);

  return {
    isAnalyzing,
    error,
    stream,
    startAnalysis,
    stopAnalysis,
    analyzeFrame
  };
}