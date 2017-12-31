const winston = require('winston');

const { format } = winston;

const config = require('./config');

const logger = winston.createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    new winston.transports.File({
      filename: `${config.folders.log}/error.log`,
      level: 'error'
    }),
    new winston.transports.File({
      filename: `${config.folders.log}/warn.log`,
      level: 'warn'
    }),
    new winston.transports.File({
      filename: `${config.folders.log}/combined.log`
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: `${config.folders.log}/exceptions.log`
    })
  ]
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (config.debug) {
  logger.add(
    new winston.transports.Console({
      format: format.simple()
    })
  );
}

module.exports = logger;
