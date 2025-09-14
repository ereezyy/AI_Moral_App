import { logger } from '../logger';

export class ErrorHandler {
  static handle(error: unknown, context?: string): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const contextMessage = context ? `${context}: ${errorMessage}` : errorMessage;
    
    logger.error(contextMessage, {
      error,
      context,
      timestamp: Date.now()
    });
  }

  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    context: string,
    fallback?: T
  ): Promise<T | undefined> {
    try {
      return await operation();
    } catch (error) {
      this.handle(error, context);
      return fallback;
    }
  }

  static createErrorBoundary<T>(
    operation: () => Promise<T>,
    errorHandler: (error: unknown) => void
  ): () => Promise<T | undefined> {
    return async () => {
      try {
        return await operation();
      } catch (error) {
        errorHandler(error);
        return undefined;
      }
    };
  }

  static isNetworkError(error: unknown): boolean {
    return error instanceof Error && (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('connection')
    );
  }

  static isValidationError(error: unknown): boolean {
    return error instanceof Error && error.message.includes('validation');
  }

  static getErrorType(error: unknown): 'network' | 'validation' | 'permission' | 'unknown' {
    if (this.isNetworkError(error)) return 'network';
    if (this.isValidationError(error)) return 'validation';
    if (error instanceof Error && error.message.includes('permission')) return 'permission';
    return 'unknown';
  }
}