export class ModelLoader {
  private static loadedModels = new Set<string>();
  private static loadingPromises = new Map<string, Promise<void>>();

  static async loadModel(
    modelId: string,
    loader: () => Promise<void>
  ): Promise<void> {
    if (this.loadedModels.has(modelId)) {
      return;
    }

    let loadingPromise = this.loadingPromises.get(modelId);
    if (!loadingPromise) {
      loadingPromise = loader().then(() => {
        this.loadedModels.add(modelId);
        this.loadingPromises.delete(modelId);
      });
      this.loadingPromises.set(modelId, loadingPromise);
    }

    return loadingPromise;
  }

  static isModelLoaded(modelId: string): boolean {
    return this.loadedModels.has(modelId);
  }

  static async ensureModelLoaded(
    modelId: string,
    loader: () => Promise<void>
  ): Promise<void> {
    if (!this.isModelLoaded(modelId)) {
      await this.loadModel(modelId, loader);
    }
  }
}