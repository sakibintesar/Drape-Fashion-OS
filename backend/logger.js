const { createLogger, format, transports } = require('winston');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';

const logger = createLogger({
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'drape-api' },
  transports: [
    // Console output
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length > 1 ? ' ' + JSON.stringify(meta) : '';
          return `${timestamp} [${level}]: ${message}${metaStr}`;
        })
      )
    }),
    // Error log file
    new transports.File({
      filename: path.join(__dirname, 'logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Combined log file
    new transports.File({
      filename: path.join(__dirname, 'logs', 'combined.log'),
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});

module.exports = logger;
