import { useState, useCallback, useRef, useEffect } from 'react';
import { AudioAnalysis } from '../types/analysis';

export function useAudioMonitoring(enabled: boolean = true) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AudioAnalysis | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startMonitoring = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      const audioContext = new AudioContext();
      const analyzer = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      analyzer.fftSize = 2048;
      source.connect(analyzer);
      
      audioContextRef.current = audioContext;
      analyzerRef.current = analyzer;
      streamRef.current = stream;
      
      setIsMonitoring(true);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to start audio monitoring');
      setIsMonitoring(false);
    }
  }, []);

  const stopMonitoring = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    audioContextRef.current = null;
    analyzerRef.current = null;
    streamRef.current = null;
    setIsMonitoring(false);
  }, []);

  const analyzeAudio = useCallback(() => {
    if (!analyzerRef.current) return null;

    const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
    analyzerRef.current.getByteFrequencyData(dataArray);

    const volume = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length / 255;
    const clarity = dataArray.slice(dataArray.length / 2).reduce((acc, val) => acc + val, 0) / (dataArray.length / 2) / 255;

    return {
      sentiment: Math.min(1, volume + 0.3),
      toxicity: Math.max(0, 0.1 - volume * 0.2),
      emotionalTone: {
        joy: Math.min(1, volume * 1.2),
        sadness: Math.max(0, 0.3 - volume),
        anger: Math.min(0.2, volume * 0.3),
        fear: Math.max(0, 0.2 - volume * 0.5),
        surprise: Math.min(0.3, volume * 0.5),
        neutral: Math.max(0.2, 1 - volume)
      },
      volume,
      clarity
    };
  }, []);

  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      const analysis = analyzeAudio();
      if (analysis) {
        setCurrentAnalysis(analysis);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isMonitoring, analyzeAudio]);

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