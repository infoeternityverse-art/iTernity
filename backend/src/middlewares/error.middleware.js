import { ApiError } from '../utils/api-error.js';
import { sendError } from '../utils/api-response.js';
import { config } from '../config/index.js';

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (error, req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error.';
  const errors = error.errors || [];

  if (config.nodeEnv !== 'test' && (!error.isOperational || statusCode >= 500)) {
    console.error(error);
  }

  return sendError(res, {
    statusCode,
    message:
      config.nodeEnv === 'production' && statusCode === 500 ? 'Internal server error.' : message,
    errors,
  });
};
