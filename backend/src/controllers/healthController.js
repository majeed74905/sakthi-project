import { apiSuccess } from '../utils/response.js';

export function checkHealth(req, res) {
  return apiSuccess(res, 'API is running', {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
}
