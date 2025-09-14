import { useState, useCallback, useRef, useEffect } from 'react';
import { AudioAnalysis, EmotionalState } from '../types';
import { ErrorHandler } from '../utils/error/errorHandler';

interface AudioMonitoringState {
  audioContext: AudioContext | null;
  analyzer: AnalyserNode | null;
  mediaStream: MediaStream | null;
}

export function useAudioMonitoring(
  onAnalysis?: (analysis: AudioAnalysis) => void, 
  enabled: boolean = true
) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AudioAnalysis | null>(null);
  const audioStateRef = useRef<AudioMonitoringState>({
    audioContext: null,
    analyzer: null,
    mediaStream: null
  });
  const analysisIntervalRef = useRef<number | null>(null);

  const initializeAudio = useCallback(async (): Promise<boolean> => {
    return await ErrorHandler.withErrorHandling(
      async () => {
        const audioContext = new AudioContext();
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 16000
          }
        });

        const source = audioContext.createMediaStreamSource(mediaStream);
        const analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 2048;
        analyzer.minDecibels = -90;
        analyzer.maxDecibels = -10;
        source.connect(analyzer);

        audioStateRef.current = {
          audioContext,
          analyzer,
          mediaStream
        };

        return true;
      },
      'Audio initialization',
      false
    ) || false;
  }, []);

  const analyzeAudioFrame = useCallback((): AudioAnalysis | null => {
    const { analyzer, audioContext } = audioStateRef.current;
    if (!analyzer || !audioContext) return null;

    const frequencyData = new Uint8Array(analyzer.frequencyBinCount);
    const timeDomainData = new Uint8Array(analyzer.frequencyBinCount);
    
    analyzer.getByteFrequencyData(frequencyData);
    analyzer.getByteTimeDomainData(timeDomainData);

    const volume = this.calculateVolume(frequencyData);
    const clarity = this.calculateClarity(frequencyData);
    const pitch = this.calculatePitch(frequencyData, audioContext.sampleRate);
    
    const emotionalTone = this.analyzeEmotionalTone(volume, clarity, pitch);
    const sentiment = this.calculateSentiment(volume, clarity, pitch, emotionalTone);
    const toxicity = this.detectToxicity(volume, pitch, timeDomainData);

    return {
      sentiment,
      toxicity,
      emotionalTone,
      volume,
      clarity
    };
  }, []);

  const calculateVolume = (frequencyData: Uint8Array): number => {
    const sum = frequencyData.reduce((acc, val) => acc + val, 0);
    return Math.min(1, sum / (frequencyData.length * 255));
  };

  const calculateClarity = (frequencyData: Uint8Array): number => {
    const highFreqStart = Math.floor(frequencyData.length * 0.6);
    const highFreqSum = frequencyData.slice(highFreqStart).reduce((acc, val) => acc + val, 0);
    const totalSum = frequencyData.reduce((acc, val) => acc + val, 0);
    return totalSum > 0 ? highFreqSum / totalSum : 0;
  };

  const calculatePitch = (frequencyData: Uint8Array, sampleRate: number): number => {
    let maxIndex = 0;
    let maxValue = 0;
    
    for (let i = 1; i < frequencyData.length / 4; i++) {
      if (frequencyData[i] > maxValue) {
        maxValue = frequencyData[i];
        maxIndex = i;
      }
    }
    
    const frequency = maxIndex * sampleRate / (2 * frequencyData.length);
    return Math.min(1, Math.max(0, (frequency - 85) / (255 - 85)));
  };

  const analyzeEmotionalTone = (volume: number, clarity: number, pitch: number): EmotionalState => {
    const joy = Math.min(1, Math.max(0, pitch * 0.4 + volume * 0.3 + clarity * 0.3));
    const sadness = Math.min(1, Math.max(0, (1 - pitch) * 0.4 + (1 - volume) * 0.4));
    const anger = Math.min(1, Math.max(0, volume * 0.5 + pitch * 0.3));
    const fear = Math.min(1, Math.max(0, pitch * 0.4 + volume * 0.3));
    const surprise = Math.min(1, Math.max(0, pitch * 0.5 + volume * 0.3));
    const totalEmotions = joy + sadness + anger + fear + surprise;
    const neutral = Math.max(0.1, 1 - totalEmotions);
    
    return { joy, sadness, anger, fear, surprise, neutral };
  };

  const calculateSentiment = (volume: number, clarity: number, pitch: number, emotional: EmotionalState): number => {
    const positiveIndicators = emotional.joy * 0.5 + emotional.surprise * 0.2 + clarity * 0.2;
    const negativeIndicators = emotional.sadness * 0.4 + emotional.anger * 0.4 + emotional.fear * 0.2;
    return Math.max(0, Math.min(1, 0.5 + positiveIndicators - negativeIndicators));
  };

  const detectToxicity = (volume: number, pitch: number, timeDomainData: Uint8Array): number => {
    let variability = 0;
    for (let i = 1; i < timeDomainData.length; i++) {
      variability += Math.abs(timeDomainData[i] - timeDomainData[i - 1]);
    }
    variability /= timeDomainData.length * 255;
    
    return Math.min(1, Math.max(0, volume * 0.3 + (pitch > 0.7 ? pitch * 0.4 : 0) + variability * 0.3));
  };

  const startMonitoring = useCallback(async () => {
    if (isMonitoring) return;
    
    try {
      const initialized = await initializeAudio();
      if (!initialized) {
        throw new Error('Failed to initialize audio analysis');
      }

      analysisIntervalRef.current = window.setInterval(() => {
        const analysis = analyzeAudioFrame();
        if (analysis) {
          setCurrentAnalysis(analysis);
          onAnalysis?.(analysis);
        }
      }, 300);
      
      setIsMonitoring(true);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to start audio monitoring');
      setIsMonitoring(false);
    }
  }, [initializeAudio, analyzeAudioFrame, onAnalysis]);

  const stopMonitoring = useCallback(() => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    
    const { mediaStream, audioContext } = audioStateRef.current;
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    if (audioContext) {
      audioContext.close();
    }
    
    audioStateRef.current = {
      audioContext: null,
      analyzer: null,
      mediaStream: null
    };
    
    setCurrentAnalysis(null);
    setIsMonitoring(false);
  }, []);

  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    isMonitoring,
    error,
    currentAnalysis,
    startMonitoring,
    stopMonitoring
  };
}