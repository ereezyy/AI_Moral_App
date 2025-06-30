export class PerformanceMonitor {
  private static timers: Map<string, number> = new Map();

  static startTimer(label: string): void {
    this.timers.set(label, performance.now());
  }

  static endTimer(label: string): number | undefined {
    const start = this.timers.get(label);
    if (start === undefined) return undefined;

    const duration = performance.now() - start;
    this.timers.delete(label);
    return duration;
  }

  static async measureAsync<T>(
    label: string,
    operation: () => Promise<T>
  ): Promise<T> {
    this.startTimer(label);
    try {
      return await operation();
    } finally {
      const duration = this.endTimer(label);
      if (duration !== undefined) {
        console.debug(`${label} took ${duration.toFixed(2)}ms`);
      }
    }
  }
}