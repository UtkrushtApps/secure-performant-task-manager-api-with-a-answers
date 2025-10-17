// src/utils/error.js
const logger = require('../middleware/logger');
exports.handleControllerError = (e, res, next) => {
  logger.error(e.stack || e.toString());
  if (e.status && e.message) {
    res.status(e.status).json({ error: e.message });
  } else {
    next(e); // delegate to centralized error handler
  }
};
