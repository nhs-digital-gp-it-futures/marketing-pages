import { createLogger, format, transports } from 'winston';
import { loggerLevel } from './config';

const {
  combine,
  timestamp,
  label,
  printf,
  colorize,
} = format;
const logFormat = printf(info => `${info.timestamp} [${info.level}] ${info.label} | message: ${info.message} ${info.message.stack ? `: ${info.message.stack}` : ''}`);

const logger = createLogger({
  format: combine(
    label({ label: 'marketing-pages' }),
    timestamp(),
    colorize(),
    logFormat,
  ),
  transports: [
    new transports.Console({
      level: loggerLevel,
      colourize: (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV),
    }),
  ],
});

export default logger;
