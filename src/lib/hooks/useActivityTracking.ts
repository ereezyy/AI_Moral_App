import { useState, useCallback } from 'react';
import { Activity } from '../types';
import { trackActivity } from '../utils/tracking';

export function useActivityTracking() {
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const track = useCallback(async (
    activity: Omit<Activity, 'id' | 'timestamp'>
  ): Promise<Activity | null> => {
    setError(null);
    try {
      const trackedActivity = await trackActivity(activity);
      setIsTracking(true);
      return trackedActivity;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to track activity');
      return null;
    } finally {
      setIsTracking(false);
    }
  }, []);

  return {
    isTracking,
    error,
    track
  };
}