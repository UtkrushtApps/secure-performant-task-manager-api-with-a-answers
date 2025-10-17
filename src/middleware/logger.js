// src/middleware/logger.js
const { createLogger, transports, format } = require('winston');
const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ level, timestamp, message, ...extra }) => {
      return `[${timestamp}] ${level}: ${message} ${Object.keys(extra).length ? JSON.stringify(extra) : ''}`;
    })
  ),
  transports: [new transports.Console()]
});
logger.stream = {
  write: (message) => logger.info(message.trim())
};
module.exports = logger;
