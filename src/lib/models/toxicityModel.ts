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
    console.warn('Toxicity model unavailable - TensorFlow removed');
    return false;
  }

  async analyze(text: string) {
    console.warn('Toxicity analysis unavailable - TensorFlow removed');
    return [];
  }
}

export const toxicityModel = ToxicityModel.getInstance();