import { BaseService } from './baseService';
import { videoModel } from '../models';
import type { VideoAnalysis } from '../types';

export class VideoService extends BaseService {
  protected serviceName = 'VideoService';
  private stream: MediaStream | null = null;

  async initialize(): Promise<boolean> {
    try {
      await videoModel.initialize();
      return true;
    } catch (error) {
      this.logError(error, 'initialization failed');
      return false;
    }
  }

  async startStream(): Promise<MediaStream> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      return this.stream;
    } catch (error) {
      this.logError(error, 'failed to start stream');
      throw error;
    }
  }

  async analyzeFrame(videoElement: HTMLVideoElement): Promise<VideoAnalysis | null> {
    try {
      return await videoModel.analyzeFrame(videoElement);
    } catch (error) {
      this.logError(error, 'frame analysis failed');
      return null;
    }
  }

  cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}

export const videoService = new VideoService();