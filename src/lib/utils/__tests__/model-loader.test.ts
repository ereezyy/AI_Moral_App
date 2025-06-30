import { describe, it, expect, vi } from 'vitest';
import { ModelLoader } from '../model-loader';

describe('Model Loader Utils', () => {
  it('should load model only once', async () => {
    const loader = vi.fn().mockResolvedValue(undefined);
    
    await Promise.all([
      ModelLoader.loadModel('test-model', loader),
      ModelLoader.loadModel('test-model', loader)
    ]);

    expect(loader).toHaveBeenCalledTimes(1);
    expect(ModelLoader.isModelLoaded('test-model')).toBe(true);
  });
});