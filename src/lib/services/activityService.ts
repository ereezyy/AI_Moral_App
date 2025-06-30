import { BaseService } from './baseService';
import type { Activity } from '../types';

export class ActivityService extends BaseService {
  protected serviceName = 'ActivityService';

  async trackActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<Activity> {
    try {
      const newActivity: Activity = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        ...activity,
      };

      if (navigator.geolocation) {
        const position = await this.getCurrentPosition();
        if (position) {
          newActivity.location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        }
      }

      return newActivity;
    } catch (error) {
      this.logError(error, 'Failed to track activity');
      throw error;
    }
  }

  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
}

export const activityService = new ActivityService();