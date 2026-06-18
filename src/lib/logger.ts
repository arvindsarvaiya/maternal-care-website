/**
 * Structured Logger
 * 
 * Provides a consistent, JSON-structured logging interface that replaces
 * raw console.error calls throughout the application.
 * 
 * In production, logs are emitted as JSON for ingestion by log aggregators
 * (e.g., Vercel Logs, Datadog, Logtail). In development, logs are formatted
 * for readability.
 * 
 * Log levels follow syslog/RFC 5424 severity:
 *   0 = emergency, 1 = alert, 2 = critical, 3 = error
 *   4 = warning,  5 = notice,  6 = info,      7 = debug
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogData = Record<string, unknown>;

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: string;
    data?: LogData;
    error?: string;
    stack?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

/**
 * Minimum log level. In production, set LOG_LEVEL=warn or LOG_LEVEL=error
 * via environment variable to reduce noise.
 */
function getMinLevel(): LogLevel {
    const envLevel = process.env.LOG_LEVEL as LogLevel | undefined;
    if (envLevel && envLevel in LOG_LEVELS) return envLevel;
    return process.env.NODE_ENV === 'production' ? 'warn' : 'debug';
}

function shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[getMinLevel()];
}

function formatEntry(entry: LogEntry): string {
    if (process.env.NODE_ENV === 'production') {
        return JSON.stringify(entry);
    }
    // Development: human-readable format
    const prefix = `[${entry.timestamp}] ${entry.level.toUpperCase()}`;
    const ctx = entry.context ? ` [${entry.context}]` : '';
    const data = entry.data ? ` ${JSON.stringify(entry.data)}` : '';
    const err = entry.error ? `\n  Error: ${entry.error}` : '';
    const stack = entry.stack ? `\n  Stack: ${entry.stack}` : '';
    return `${prefix}${ctx} ${entry.message}${data}${err}${stack}`;
}

function log(level: LogLevel, message: string, context?: string, error?: Error, data?: LogData): void {
    if (!shouldLog(level)) return;

    const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...(context && { context }),
        ...(data && { data }),
        ...(error && { error: error.message, stack: error.stack }),
    };

    const formatted = formatEntry(entry);

    switch (level) {
        case 'error':
            console.error(formatted);
            break;
        case 'warn':
            console.warn(formatted);
            break;
        case 'info':
            console.info(formatted);
            break;
        case 'debug':
        default:
            console.debug(formatted);
            break;
    }
}

export const logger = {
    /** Debug-level messages (development only by default) */
    debug(message: string, context?: string, data?: LogData): void {
        log('debug', message, context, undefined, data);
    },

    /** Info-level messages (general operational info) */
    info(message: string, context?: string, data?: LogData): void {
        log('info', message, context, undefined, data);
    },

    /** Warning-level messages (potential issues) */
    warn(message: string, context?: string, data?: LogData): void {
        log('warn', message, context, undefined, data);
    },

    /** Error-level messages (actual errors) */
    error(message: string, context?: string, error?: Error, data?: LogData): void {
        log('error', message, context, error, data);
    },
};