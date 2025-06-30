import { logger } from '../logger';

export class LazyLoader {
  private static loadedModules = new Map<string, any>();
  private static loadingPromises = new Map<string, Promise<any>>();

  static async load<T>(
    moduleId: string,
    loader: () => Promise<T>,
    options: {
      timeout?: number;
      retries?: number;
    } = {}
  ): Promise<T> {
    if (this.loadedModules.has(moduleId)) {
      return this.loadedModules.get(moduleId);
    }

    let loadingPromise = this.loadingPromises.get(moduleId);
    if (!loadingPromise) {
      loadingPromise = this.loadWithRetry(moduleId, loader, options);
      this.loadingPromises.set(moduleId, loadingPromise);
    }

    return loadingPromise;
  }

  private static async loadWithRetry<T>(
    moduleId: string,
    loader: () => Promise<T>,
    { timeout = 30000, retries = 3 }: { timeout?: number; retries?: number }
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const module = await Promise.race([
          loader(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Loading timeout')), timeout)
          )
        ]);

        this.loadedModules.set(moduleId, module);
        this.loadingPromises.delete(moduleId);
        return module;
      } catch (error) {
        lastError = error as Error;
        logger.warn(`Failed to load module ${moduleId}, attempt ${attempt}/${retries}`, { error });
      }
    }

    throw lastError || new Error(`Failed to load module ${moduleId}`);
  }

  static isLoaded(moduleId: string): boolean {
    return this.loadedModules.has(moduleId);
  }

  static clear(moduleId?: string): void {
    if (moduleId) {
      this.loadedModules.delete(moduleId);
      this.loadingPromises.delete(moduleId);
    } else {
      this.loadedModules.clear();
      this.loadingPromises.clear();
    }
  }
}