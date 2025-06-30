import * as toxicity from '@tensorflow-models/toxicity';

class ToxicityModel {
  private static instance: ToxicityModel;
  private model: any = null;

  private constructor() {}

  static getInstance(): ToxicityModel {
    if (!ToxicityModel.instance) {
      ToxicityModel.instance = new ToxicityModel();
    }
    return ToxicityModel.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      this.model = await toxicity.load(0.7);
      return true;
    } catch (error) {
      console.error('Failed to initialize toxicity model:', error);
      return false;
    }
  }

  async analyze(text: string) {
    if (!this.model) {
      throw new Error('Toxicity model not initialized');
    }
    return await this.model.classify(text);
  }
}

export const toxicityModel = ToxicityModel.getInstance();