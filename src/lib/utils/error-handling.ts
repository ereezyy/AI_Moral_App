import { BaseService } from '../services/baseService';

export class ErrorHandler {
  static handleServiceError(service: BaseService, error: unknown, context?: string): void {
    console.error(
      `[${service.constructor.name}]${context ? ` ${context}:` : ''}`,
      error instanceof Error ? error.message : error
    );
  }

  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    errorMessage: string,
    fallback?: T
  ): Promise<T | undefined> {
    try {
      return await operation();
    } catch (error) {
      console.error(`${errorMessage}:`, error);
      return fallback;
    }
  }
}

export function createErrorBoundary<T>(
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