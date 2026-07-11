// Logger Interface Contract
// Tomorrow, this will adapt to Sentry, Logtail, or Datadog.

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LoggerAdapter {
  log(level: LogLevel, message: string, context?: Record<string, any>): void;
}

// Basic Console Adapter for now
class ConsoleLogger implements LoggerAdapter {
  log(level: LogLevel, message: string, context?: Record<string, any>) {
    const timestamp = new Date().toISOString();
    const payload = context ? JSON.stringify(context) : '';
    
    switch (level) {
      case 'info':
        console.info(`[INFO] ${timestamp}: ${message} ${payload}`);
        break;
      case 'warn':
        console.warn(`[WARN] ${timestamp}: ${message} ${payload}`);
        break;
      case 'error':
        console.error(`[ERROR] ${timestamp}: ${message} ${payload}`);
        break;
      case 'debug':
        if (process.env.NODE_ENV === 'development') {
          console.debug(`[DEBUG] ${timestamp}: ${message} ${payload}`);
        }
        break;
    }
  }
}

export const logger = new ConsoleLogger();
