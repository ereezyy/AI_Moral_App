import { Activity, MoralEvent } from '../types';

export async function trackActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<Activity> {
  const newActivity: Activity = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    ...activity,
  };

  if (navigator.geolocation) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      newActivity.location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch (error) {
      console.warn('Location tracking failed:', error);
    }
  }

  return newActivity;
}