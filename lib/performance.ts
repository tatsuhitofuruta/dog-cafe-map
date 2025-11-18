import { logger } from './logger'

/**
 * Performance monitoring utilities
 */

interface PerformanceMetric {
  name: string
  duration: number
  timestamp: number
}

class PerformanceMonitor {
  private metrics: Map<string, number> = new Map()

  /**
   * Start measuring performance for a given operation
   */
  start(name: string): void {
    this.metrics.set(name, performance.now())
  }

  /**
   * End measuring and log the performance metric
   */
  end(name: string, context?: Record<string, unknown>): void {
    const startTime = this.metrics.get(name)
    if (!startTime) {
      logger.warn(`Performance metric "${name}" was not started`, context)
      return
    }

    const duration = performance.now() - startTime
    this.metrics.delete(name)

    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
    }

    // Log slow operations (> 1 second)
    if (duration > 1000) {
      logger.warn(`Slow operation detected: ${name}`, {
        ...context,
        duration: `${duration.toFixed(2)}ms`,
      })
    } else {
      logger.debug(`Performance: ${name}`, {
        ...context,
        duration: `${duration.toFixed(2)}ms`,
      })
    }

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to monitoring service (e.g., Datadog, New Relic)
      // Example: datadogClient.timing(metric.name, metric.duration)
    }
  }

  /**
   * Measure an async operation
   */
  async measure<T>(
    name: string,
    fn: () => Promise<T>,
    context?: Record<string, unknown>
  ): Promise<T> {
    this.start(name)
    try {
      const result = await fn()
      this.end(name, context)
      return result
    } catch (error) {
      this.end(name, { ...context, error: true })
      throw error
    }
  }
}

export const performanceMonitor = new PerformanceMonitor()
