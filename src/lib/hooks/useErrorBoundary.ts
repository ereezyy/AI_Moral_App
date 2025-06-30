import { useCallback, useState } from 'react';
import { logger } from '../utils/logger';

export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((error: Error) => {
    logger.error('Error boundary caught error:', { error });
    setError(error);
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    resetError
  };
}