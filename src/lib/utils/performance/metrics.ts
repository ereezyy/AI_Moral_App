import { logger } from '../logger';

interface MetricSample {
  value: number;
  timestamp: number;
}

export class PerformanceMetrics {
  private static metrics = new Map<string, MetricSample[]>();
  private static readonly maxSamples = 100;
  private static readonly cleanupInterval = 60000; // 1 minute

  static {
    if (typeof window !== 'undefined') {
      setInterval(() => this.cleanup(), this.cleanupInterval);
    }
  }

  static recordMetric(name: string, value: number): void {
    const samples = this.metrics.get(name) || [];
    samples.push({
      value,
      timestamp: Date.now()
    });
    
    if (samples.length > this.maxSamples) {
      samples.shift();
    }
    
    this.metrics.set(name, samples);
    logger.debug(`Performance metric: ${name}`, { value });
  }

  static getMetricStats(name: string, timeWindow?: number): {
    average: number;
    min: number;
    max: number;
    count: number;
  } | null {
    const samples = this.metrics.get(name);
    if (!samples || samples.length === 0) return null;

    const now = Date.now();
    const relevantSamples = timeWindow
      ? samples.filter(s => now - s.timestamp <= timeWindow)
      : samples;

    if (relevantSamples.length === 0) return null;

    const values = relevantSamples.map(s => s.value);
    return {
      average: values.reduce((a, b) => a + b) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length
    };
  }

  private static cleanup(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const [name, samples] of this.metrics.entries()) {
      const filteredSamples = samples.filter(s => now - s.timestamp <= maxAge);
      if (filteredSamples.length === 0) {
        this.metrics.delete(name);
      } else if (filteredSamples.length !== samples.length) {
        this.metrics.set(name, filteredSamples);
      }
    }
  }

  static clearMetrics(): void {
    this.metrics.clear();
  }
}