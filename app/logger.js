const { createLogger, format, transports } = require('winston');
const { loggerLevel } = require('./config');

const logFormat = format.printf(({
  level,
  message,
  label,
  timestamp,
}) => `${timestamp} [${label}] ${level}: ${message}`);

const logger = createLogger({
  level: 'info',
  format: logFormat,
  defaultMeta: { service: 'user-service' },
});

if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  logger.add(new transports.Console({
    format: format.combine(
      format.label({ label: 'marketing-pages' }),
      format.timestamp({ format: 'D/M/YY HH:mm:ss' }),
      format.colorize(),
      logFormat,
    ),
  }));
} else {
  logger.add(
    new transports.File({
      filename: 'error.log',
      level: 'error',
      format: format.combine(
        format.label({ label: 'marketing-pages' }),
        format.timestamp({ format: 'D/M/YY HH:mm:ss' }),
        logFormat,
      ),
    }),
    new transports.File({
      filename: 'combined.log',
      format: format.combine(
        format.label({ label: 'marketing-pages' }),
        format.timestamp({ format: 'D/M/YY HH:mm:ss' }),
        logFormat,
      ),
    }),
  );
}

export default {
  info: (message) => {
    if (loggerLevel === 'info') {
      logger.log('info', message);
    }
  },
  warn: (message) => {
    if (loggerLevel === 'info' || loggerLevel === 'warn') {
      logger.log('warn', message);
    }
  },
  error: (message) => {
    if (loggerLevel !== 'off') {
      logger.log('error', message);
    }
  },
};
