const winston = require('winston');
require('winston-mongodb');
const { db, debug } = require('../../settings');

const { createLogger, format, transports } = winston;
const { combine, timestamp, prettyPrint } = format;

const logger = createLogger({
  format: combine(timestamp(), prettyPrint()),
  transports: [
    new transports.MongoDB({
      db: db.connectString,
      tryReconnect: true
    })
  ]
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (debug) {
  logger.add(
    new transports.Console({
      format: winston.format.simple()
    })
  );
}

module.exports = logger;
