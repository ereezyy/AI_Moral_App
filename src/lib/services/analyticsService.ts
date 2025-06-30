import { BaseService } from './baseService';
import type { Activity, MoralEvent } from '../types';

export class AnalyticsService extends BaseService {
  protected serviceName = 'AnalyticsService';

  calculateWeeklyEthicalScore(moralEvents: MoralEvent[]): number {
    if (moralEvents.length === 0) return 0;

    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentEvents = moralEvents.filter(event => event.timestamp >= weekAgo);

    return recentEvents.reduce((acc, event) => acc + event.analysis.ethicalScore, 0) / recentEvents.length;
  }

  calculateConsistencyStreak(activities: Activity[]): number {
    if (activities.length === 0) return 0;

    let streak = 0;
    const sortedActivities = [...activities].sort((a, b) => b.timestamp - a.timestamp);
    const today = new Date().setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedActivities.length; i++) {
      const activityDate = new Date(sortedActivities[i].timestamp).setHours(0, 0, 0, 0);
      const daysDiff = (today - activityDate) / (24 * 60 * 60 * 1000);

      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  getTotalMoralDecisions(moralEvents: MoralEvent[]): number {
    return moralEvents.length;
  }
}

export const analyticsService = new AnalyticsService();