import { apiError } from '../utils/response.js';
import { sanitizeLogData } from '../utils/maskData.js';

export function errorHandler(err, req, res, next) {
  const isProduction = process.env.NODE_ENV === 'production';

  console.error('❌ Server Error:', {
    message: err.message,
    path: req.originalUrl,
    method: req.method,
    body: sanitizeLogData(req.body),
    stack: isProduction ? undefined : err.stack
  });

  if (err.name === 'ZodError' || err.name === 'ValidationError') {
    const errorDetails = err.issues || err.errors || [];
    return apiError(res, 'Validation error: ' + (errorDetails[0]?.message || err.message), 400, 'VALIDATION_ERROR', errorDetails);
  }

  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    return apiError(res, 'Authentication token invalid or expired', 401, 'UNAUTHORIZED');
  }

  const statusCode = err.statusCode || 500;
  const message = isProduction && statusCode === 500 ? 'An unexpected server error occurred.' : err.message;

  return apiError(res, message, statusCode, err.errorCode || 'INTERNAL_SERVER_ERROR');
}
