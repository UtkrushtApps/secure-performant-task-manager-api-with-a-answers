// src/middleware/errorHandler.js
const logger = require('./logger');
module.exports = (err, req, res, next) => {
  logger.error(err.stack || err);
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Server Error' });
};
