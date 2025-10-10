class AudioModel {
  private static instance: AudioModel;
  private recognizer: any = null;

  private constructor() {}

  static getInstance(): AudioModel {
    if (!AudioModel.instance) {
      AudioModel.instance = new AudioModel();
    }
    return AudioModel.instance;
  }

  async initialize(): Promise<boolean> {
    console.warn('Audio model unavailable - TensorFlow removed');
    return false;
  }

  async startListening(onResult: (result: { scores: Float32Array }) => void) {
    console.warn('Audio listening unavailable - TensorFlow removed');
  }

  async stopListening() {
    console.warn('Audio model unavailable - TensorFlow removed');
  }
}

export const audioModel = AudioModel.getInstance();