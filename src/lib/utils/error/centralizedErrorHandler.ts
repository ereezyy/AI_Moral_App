import { logger } from '../logger';

export interface ErrorContext {
  operation: string;
  component?: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface ErrorHandlingConfig {
  logLevel: 'error' | 'warn' | 'info';
  shouldThrow: boolean;
  fallbackValue?: unknown;
  retryAttempts?: number;
}

export class CentralizedErrorHandler {
  private static defaultConfig: ErrorHandlingConfig = {
    logLevel: 'error',
    shouldThrow: false,
    retryAttempts: 0
  };

  static async handleAsync<T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    config: Partial<ErrorHandlingConfig> = {}
  ): Promise<T | undefined> {
    const finalConfig = { ...this.defaultConfig, ...config };
    let lastError: Error;

    for (let attempt = 0; attempt <= (finalConfig.retryAttempts || 0); attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === (finalConfig.retryAttempts || 0)) {
          this.logError(lastError, context, finalConfig.logLevel);
          
          if (finalConfig.shouldThrow) {
            throw lastError;
          }
          
          return finalConfig.fallbackValue as T;
        }
        
        // Brief delay before retry
        await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
      }
    }
  }

  static handleSync<T>(
    operation: () => T,
    context: ErrorContext,
    config: Partial<ErrorHandlingConfig> = {}
  ): T | undefined {
    const finalConfig = { ...this.defaultConfig, ...config };

    try {
      return operation();
    } catch (error) {
      this.logError(error as Error, context, finalConfig.logLevel);
      
      if (finalConfig.shouldThrow) {
        throw error;
      }
      
      return finalConfig.fallbackValue as T;
    }
  }

  private static logError(error: Error, context: ErrorContext, level: 'error' | 'warn' | 'info'): void {
    const errorData = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now()
    };

    switch (level) {
      case 'error':
        logger.error(`[${context.component || 'Unknown'}] ${context.operation} failed`, errorData);
        break;
      case 'warn':
        logger.warn(`[${context.component || 'Unknown'}] ${context.operation} warning`, errorData);
        break;
      case 'info':
        logger.info(`[${context.component || 'Unknown'}] ${context.operation} info`, errorData);
        break;
    }
  }

  static createBoundary<T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    fallback: T
  ): () => Promise<T> {
    return async () => {
      return await this.handleAsync(
        operation,
        context,
        { fallbackValue: fallback }
      ) || fallback;
    };
  }
}