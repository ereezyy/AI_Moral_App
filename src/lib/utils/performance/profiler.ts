import { logger } from '../logger';
import { PerformanceMetrics } from './metrics';

export class Profiler {
  private static activeProfiles = new Map<string, {
    startTime: number;
    marks: Map<string, number>;
  }>();

  static startProfile(name: string): void {
    this.activeProfiles.set(name, {
      startTime: performance.now(),
      marks: new Map()
    });
  }

  static mark(profileName: string, markName: string): void {
    const profile = this.activeProfiles.get(profileName);
    if (profile) {
      profile.marks.set(markName, performance.now() - profile.startTime);
    }
  }

  static endProfile(name: string): {
    duration: number;
    marks: Record<string, number>;
  } | null {
    const profile = this.activeProfiles.get(name);
    if (!profile) {
      logger.warn(`No active profile found for: ${name}`);
      return null;
    }

    const duration = performance.now() - profile.startTime;
    this.activeProfiles.delete(name);
    
    PerformanceMetrics.recordMetric(`${name}_duration`, duration);

    const marks: Record<string, number> = {};
    profile.marks.forEach((time, mark) => {
      marks[mark] = time;
      PerformanceMetrics.recordMetric(`${name}_${mark}`, time);
    });

    return { duration, marks };
  }

  static async profileAsync<T>(
    name: string,
    operation: () => Promise<T>,
    options: {
      marks?: string[];
      timeout?: number;
    } = {}
  ): Promise<T> {
    this.startProfile(name);
    
    const { timeout } = options;
    try {
      const result = await (timeout
        ? Promise.race([
            operation(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Operation timeout')), timeout)
            )
          ])
        : operation());

      if (options.marks) {
        options.marks.forEach(mark => this.mark(name, mark));
      }

      return result;
    } finally {
      this.endProfile(name);
    }
  }
}