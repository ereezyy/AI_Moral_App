import * as speechCommands from '@tensorflow-models/speech-commands';
import type { AudioAnalysis, EmotionalState } from '../types/analysis';

interface AudioContext {
  audioContext: AudioContext | null;
  analyzer: AnalyserNode | null;
  mediaStream: MediaStream | null;
  speechRecognizer: speechCommands.SpeechCommandRecognizer | null;
}

const audioState: AudioContext = {
  audioContext: null,
  analyzer: null,
  mediaStream: null,
  speechRecognizer: null
};

export async function initializeAudioAnalysis(): Promise<boolean> {
  try {
    // Initialize audio context
    audioState.audioContext = new AudioContext();
    
    // Request microphone access
    audioState.mediaStream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 16000
      }
    });
    
    // Set up audio analyzer
    const source = audioState.audioContext.createMediaStreamSource(audioState.mediaStream);
    audioState.analyzer = audioState.audioContext.createAnalyser();
    audioState.analyzer.fftSize = 2048;
    audioState.analyzer.minDecibels = -90;
    audioState.analyzer.maxDecibels = -10;
    source.connect(audioState.analyzer);
    
    // Initialize speech command recognizer for audio pattern analysis
    try {
      audioState.speechRecognizer = speechCommands.create('BROWSER_FFT');
      await audioState.speechRecognizer.ensureModelLoaded();
      console.log('Speech command recognizer loaded');
    } catch (error) {
      console.warn('Speech command recognizer failed to load:', error);
    }
    
    console.log('Audio analysis initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize audio analysis:', error);
    return false;
  }
}

export function stopAudioAnalysis(): void {
  if (audioState.mediaStream) {
    audioState.mediaStream.getTracks().forEach(track => track.stop());
  }
  if (audioState.audioContext) {
    audioState.audioContext.close();
  }
  audioState.audioContext = null;
  audioState.analyzer = null;
  audioState.mediaStream = null;
  audioState.speechRecognizer = null;
}

export async function analyzeAudioSegment(): Promise<AudioAnalysis | null> {
  if (!audioState.analyzer || !audioState.audioContext) return null;

  // Get frequency and time domain data
  const frequencyData = new Uint8Array(audioState.analyzer.frequencyBinCount);
  const timeDomainData = new Uint8Array(audioState.analyzer.frequencyBinCount);
  
  audioState.analyzer.getByteFrequencyData(frequencyData);
  audioState.analyzer.getByteTimeDomainData(timeDomainData);

  // Calculate audio features
  const volume = calculateVolume(frequencyData);
  const clarity = calculateClarity(frequencyData);
  const pitch = calculatePitch(frequencyData, audioState.audioContext.sampleRate);
  const spectralCentroid = calculateSpectralCentroid(frequencyData);
  
  // Analyze emotional tone from audio features
  const emotionalTone = analyzeEmotionalTone({
    volume,
    clarity,
    pitch,
    spectralCentroid,
    frequencyData,
    timeDomainData
  });

  // Calculate sentiment based on audio patterns
  const sentiment = calculateSentiment({
    volume,
    clarity,
    pitch,
    spectralCentroid,
    emotionalTone
  });

  // Detect potential toxicity indicators (aggressive speech patterns)
  const toxicity = detectToxicityIndicators({
    volume,
    pitch,
    spectralCentroid,
    timeDomainData
  });

  return {
    sentiment,
    toxicity,
    emotionalTone,
    volume,
    clarity
  };
}

function calculateVolume(frequencyData: Uint8Array): number {
  const sum = frequencyData.reduce((acc, val) => acc + val, 0);
  return Math.min(1, sum / (frequencyData.length * 255));
}

function calculateClarity(frequencyData: Uint8Array): number {
  // High frequency content indicates speech clarity
  const highFreqStart = Math.floor(frequencyData.length * 0.6);
  const highFreqSum = frequencyData.slice(highFreqStart).reduce((acc, val) => acc + val, 0);
  const totalSum = frequencyData.reduce((acc, val) => acc + val, 0);
  
  return totalSum > 0 ? highFreqSum / totalSum : 0;
}

function calculatePitch(frequencyData: Uint8Array, sampleRate: number): number {
  // Find dominant frequency (simplified pitch detection)
  let maxIndex = 0;
  let maxValue = 0;
  
  for (let i = 1; i < frequencyData.length / 4; i++) {
    if (frequencyData[i] > maxValue) {
      maxValue = frequencyData[i];
      maxIndex = i;
    }
  }
  
  // Convert bin to frequency
  const frequency = maxIndex * sampleRate / (2 * frequencyData.length);
  
  // Normalize to 0-1 range (assuming human speech range 85-255 Hz fundamental)
  return Math.min(1, Math.max(0, (frequency - 85) / (255 - 85)));
}

function calculateSpectralCentroid(frequencyData: Uint8Array): number {
  let weightedSum = 0;
  let magnitudeSum = 0;
  
  for (let i = 0; i < frequencyData.length; i++) {
    weightedSum += i * frequencyData[i];
    magnitudeSum += frequencyData[i];
  }
  
  return magnitudeSum > 0 ? weightedSum / magnitudeSum / frequencyData.length : 0;
}

interface AudioFeatures {
  volume: number;
  clarity: number;
  pitch: number;
  spectralCentroid: number;
  frequencyData: Uint8Array;
  timeDomainData: Uint8Array;
}

function analyzeEmotionalTone(features: AudioFeatures): EmotionalState {
  const { volume, clarity, pitch, spectralCentroid } = features;
  
  // Emotional analysis based on acoustic features
  // Higher pitch often indicates excitement, stress, or happiness
  // Lower pitch might indicate sadness or calmness
  // Volume changes can indicate emotional intensity
  // Spectral characteristics help distinguish emotions
  
  const joy = Math.min(1, Math.max(0, 
    pitch * 0.4 + volume * 0.3 + clarity * 0.3
  ));
  
  const sadness = Math.min(1, Math.max(0, 
    (1 - pitch) * 0.4 + (1 - volume) * 0.4 + (1 - clarity) * 0.2
  ));
  
  const anger = Math.min(1, Math.max(0,
    volume * 0.5 + pitch * 0.3 + (1 - clarity) * 0.2
  ));
  
  const fear = Math.min(1, Math.max(0,
    pitch * 0.4 + volume * 0.3 + spectralCentroid * 0.3
  ));
  
  const surprise = Math.min(1, Math.max(0,
    pitch * 0.5 + volume * 0.3 + clarity * 0.2
  ));
  
  // Neutral is inverse of other emotions
  const totalEmotions = joy + sadness + anger + fear + surprise;
  const neutral = Math.max(0.1, 1 - totalEmotions);
  
  return {
    joy,
    sadness,
    anger,
    fear,
    surprise,
    neutral
  };
}

interface SentimentFeatures {
  volume: number;
  clarity: number;
  pitch: number;
  spectralCentroid: number;
  emotionalTone: EmotionalState;
}

function calculateSentiment(features: SentimentFeatures): number {
  const { volume, clarity, pitch, emotionalTone } = features;
  
  // Positive sentiment indicators
  const positiveIndicators = emotionalTone.joy * 0.5 + 
                           emotionalTone.surprise * 0.2 + 
                           clarity * 0.2 + 
                           (pitch > 0.3 && pitch < 0.8 ? 0.1 : 0);
  
  // Negative sentiment indicators
  const negativeIndicators = emotionalTone.sadness * 0.4 + 
                           emotionalTone.anger * 0.4 + 
                           emotionalTone.fear * 0.2;
  
  // Calculate overall sentiment (0 = negative, 1 = positive)
  return Math.max(0, Math.min(1, 0.5 + positiveIndicators - negativeIndicators));
}

function detectToxicityIndicators(features: {
  volume: number;
  pitch: number;
  spectralCentroid: number;
  timeDomainData: Uint8Array;
}): number {
  const { volume, pitch, spectralCentroid, timeDomainData } = features;
  
  // Calculate speech intensity variability (aggressive speech often has high variability)
  let variability = 0;
  for (let i = 1; i < timeDomainData.length; i++) {
    variability += Math.abs(timeDomainData[i] - timeDomainData[i - 1]);
  }
  variability /= timeDomainData.length;
  variability /= 255; // Normalize
  
  // Toxicity indicators: high volume + high pitch + high variability
  const toxicityScore = Math.min(1, Math.max(0,
    volume * 0.3 + 
    (pitch > 0.7 ? pitch * 0.4 : 0) + 
    variability * 0.3
  ));
  
  return toxicityScore;
}

// Get real-time audio analysis
export function getAudioAnalysisStream(
  onAnalysis: (analysis: AudioAnalysis) => void,
  intervalMs: number = 500
): { start: () => void; stop: () => void } {
  let intervalId: number | null = null;
  
  const start = () => {
    if (intervalId) return;
    
    intervalId = window.setInterval(async () => {
      const analysis = await analyzeAudioSegment();
      if (analysis) {
        onAnalysis(analysis);
      }
    }, intervalMs);
  };
  
  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
  
  return { start, stop };
}

// Check if audio analysis is ready
export function isAudioAnalysisReady(): boolean {
  return audioState.audioContext !== null && 
         audioState.analyzer !== null && 
         audioState.mediaStream !== null;
}