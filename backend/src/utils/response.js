/**
 * Standardized API Success Response
 */
export function apiSuccess(res, message, data = null, statusCode = 200, meta = null) {
  const payload = {
    success: true,
    message
  };

  if (data !== null) {
    payload.data = data;
  }

  if (meta !== null) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
}

/**
 * Standardized API Error Response
 */
export function apiError(res, message, statusCode = 400, errorCode = 'BAD_REQUEST', errors = null) {
  const payload = {
    success: false,
    message,
    errorCode
  };

  if (errors !== null) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
}
