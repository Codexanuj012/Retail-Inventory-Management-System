const logger = require('../config/logger');
const { errorResponse } = require('../utils/response');

/**
 * 404 Route Not Found Middleware
 */
const notFoundHandler = (req, res, next) => {
  return errorResponse(res, 404, `Route not found: ${req.originalUrl}`);
};

/**
 * Global Error Handling Middleware
 */
const globalErrorHandler = (err, req, res, next) => {
  logger.error(`Unhandled Error on ${req.method} ${req.originalUrl}:`, err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred on the server';
  const errors = err.errors || null;

  return errorResponse(res, statusCode, message, errors);
};

module.exports = {
  notFoundHandler,
  globalErrorHandler
};