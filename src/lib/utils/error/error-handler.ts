import { logger } from '../logger';

export class ErrorHandler {
  static handle(error: unknown, context?: string): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(context ? `${context}: ${errorMessage}` : errorMessage, {
      error,
      context
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
}