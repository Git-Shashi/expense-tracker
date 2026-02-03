import { ApiError } from '../utils/api-error.js';

/**
 * Global error handling middleware
 * Must be registered last in middleware chain
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // If error is not an instance of ApiError, convert it
  if (!(error instanceof ApiError)) {
    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const message = 'Validation failed';
      const errors = Object.values(error.errors).map((e) => ({
        field: e.path,
        message: e.message
      }));
      error = ApiError.badRequest(message, errors);
    }
    // Mongoose cast error (invalid ObjectId)
    else if (error.name === 'CastError') {
      const message = `Invalid ${error.path}: ${error.value}`;
      error = ApiError.badRequest(message);
    }
    // Mongoose duplicate key error
    else if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message = `Duplicate value for field: ${field}`;
      error = ApiError.conflict(message);
    }
    // Generic error
    else {
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal Server Error';
      error = new ApiError(statusCode, message);
    }
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack,
      errors: error.errors
    });
  }

  // Send error response
  const response = {
    success: false,
    message: error.message,
    ...(error.errors?.length > 0 && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  };

  res.status(error.statusCode).json(response);
};

/**
 * 404 Not Found handler for undefined routes
 */
export const notFoundHandler = (req, res, next) => {
  const error = ApiError.notFound(`Route not found: ${req.originalUrl}`);
  next(error);
};
