import { logger } from '../utils/logger';
import { ErrorHandler } from '../utils/error';
import { Profiler } from '../utils/performance';

export abstract class BaseService {
  protected abstract serviceName: string;

  protected async initializeWithProfiling<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T | undefined> {
    return await Profiler.profileAsync(
      `${this.serviceName}-${context}`,
      async () => {
        try {
          return await operation();
        } catch (error) {
          ErrorHandler.handle(error, `${this.serviceName} ${context}`);
          return undefined;
        }
      }
    );
  }

  protected logInfo(message: string, data?: unknown): void {
    logger.info(`[${this.serviceName}] ${message}`, data);
  }

  protected logError(error: unknown, context?: string): void {
    ErrorHandler.handle(error, `[${this.serviceName}] ${context || ''}`);
  }
}