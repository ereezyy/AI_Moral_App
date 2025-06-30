import { describe, it, expect, vi } from 'vitest';
import { PerformanceMonitor } from '../performance';

describe('Performance Utils', () => {
  it('should measure async operation duration', async () => {
    const operation = async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
      return 'result';
    };

    const result = await PerformanceMonitor.measureAsync(
      'test-operation',
      operation
    );

    expect(result).toBe('result');
  });
});