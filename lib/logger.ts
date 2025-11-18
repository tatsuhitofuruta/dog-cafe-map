type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, unknown>
  error?: Error
}

class Logger {
  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry
    const contextStr = context ? ` ${JSON.stringify(context)}` : ''
    const errorStr = error ? ` ${error.stack || error.message}` : ''
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}${errorStr}`
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    }

    const formatted = this.formatLog(entry)

    // Console output
    switch (level) {
      case 'error':
        console.error(formatted)
        break
      case 'warn':
        console.warn(formatted)
        break
      case 'debug':
        if (process.env.NODE_ENV === 'development') {
          console.debug(formatted)
        }
        break
      default:
        console.log(formatted)
    }

    // In production, send to monitoring service (e.g., Sentry, Datadog)
    if (process.env.NODE_ENV === 'production' && level === 'error') {
      // TODO: Integrate with monitoring service
      // Example: Sentry.captureException(error, { extra: context })
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context)
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context)
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log('error', message, context, error)
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log('debug', message, context)
  }
}

export const logger = new Logger()
