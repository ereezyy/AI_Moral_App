import { z } from 'zod';
import { logger } from '../logger';

export class Validator {
  static validate<T>(schema: z.Schema<T>, data: unknown): T | null {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.error('Validation failed', {
          errors: error.errors,
          data
        });
      }
      return null;
    }
  }

  static validateAsync<T>(
    schema: z.Schema<T>,
    data: unknown
  ): Promise<T | null> {
    return Promise.resolve(this.validate(schema, data));
  }
}