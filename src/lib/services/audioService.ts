import { BaseService } from './baseService';
import { audioModel, sentimentModel } from '../models';
import type { AudioAnalysis } from '../types';

export class AudioService extends BaseService {
  protected serviceName = 'AudioService';
  private audioContext: AudioContext | null = null;
  private analyzer: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;

  async initialize(): Promise<boolean> {
    try {
      await this.initializeModels();
      await this.setupAudioContext();
      return true;
    } catch (error) {
      this.logError(error, 'initialization failed');
      return false;
    }
  }

  private async initializeModels(): Promise<void> {
    await audioModel.initialize();
    await sentimentModel.initialize();
  }

  private async setupAudioContext(): Promise<void> {
    this.audioContext = new AudioContext();
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    const source = this.audioContext.createMediaStreamSource(this.mediaStream);
    this.analyzer = this.audioContext.createAnalyser();
    this.analyzer.fftSize = 2048;
    source.connect(this.analyzer);
  }

  async analyze(): Promise<AudioAnalysis | null> {
    if (!this.analyzer) return null;

    const dataArray = new Uint8Array(this.analyzer.frequencyBinCount);
    this.analyzer.getByteFrequencyData(dataArray);

    const emotionalTone = await sentimentModel.analyzeEmotionalState(
      new Float32Array(dataArray)
    );

    return {
      sentiment: this.calculateSentiment(dataArray),
      toxicity: 0,
      emotionalTone,
      volume: this.calculateVolume(dataArray),
      clarity: this.calculateClarity(dataArray)
    };
  }

  cleanup(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.mediaStream = null;
    this.audioContext = null;
    this.analyzer = null;
  }

  private calculateVolume(dataArray: Uint8Array): number {
    const sum = dataArray.reduce((acc, val) => acc + val, 0);
    return sum / dataArray.length / 255;
  }

  private calculateClarity(dataArray: Uint8Array): number {
    const highFreqSum = dataArray.slice(dataArray.length / 2)
      .reduce((acc, val) => acc + val, 0);
    return highFreqSum / (dataArray.length / 2) / 255;
  }

  private calculateSentiment(dataArray: Uint8Array): number {
    return Math.random(); // Replace with actual sentiment analysis
  }
}

export const audioService = new AudioService();