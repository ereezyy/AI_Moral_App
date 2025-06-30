import { describe, it, expect, vi } from 'vitest';
import { ErrorHandler, createErrorBoundary } from '../error-handling';

describe('Error Handling Utils', () => {
  describe('ErrorHandler', () => {
    it('should handle errors with context', async () => {
      const result = await ErrorHandler.withErrorHandling(
        async () => { throw new Error('Test error'); },
        'Operation failed',
        'fallback'
      );
      expect(result).toBe('fallback');
    });
  });

  describe('createErrorBoundary', () => {
    it('should catch and handle errors', async () => {
      const errorHandler = vi.fn();
      const boundOperation = createErrorBoundary(
        async () => { throw new Error('Test error'); },
        errorHandler
      );

      const result = await boundOperation();
      expect(result).toBeUndefined();
      expect(errorHandler).toHaveBeenCalled();
    });
  });
});