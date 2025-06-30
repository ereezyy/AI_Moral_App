import * as speechCommands from '@tensorflow-models/speech-commands';

class AudioModel {
  private static instance: AudioModel;
  private recognizer: speechCommands.SpeechCommandRecognizer | null = null;

  private constructor() {}

  static getInstance(): AudioModel {
    if (!AudioModel.instance) {
      AudioModel.instance = new AudioModel();
    }
    return AudioModel.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      this.recognizer = speechCommands.create('BROWSER_FFT');
      await this.recognizer.ensureModelLoaded();
      return true;
    } catch (error) {
      console.error('Failed to initialize audio model:', error);
      return false;
    }
  }

  async startListening(onResult: (result: { scores: Float32Array }) => void) {
    if (!this.recognizer) {
      throw new Error('Audio model not initialized');
    }

    await this.recognizer.listen(onResult, {
      includeSpectrogram: true,
      probabilityThreshold: 0.75
    });
  }

  async stopListening() {
    if (this.recognizer) {
      await this.recognizer.stopListening();
    }
  }
}

export const audioModel = AudioModel.getInstance();