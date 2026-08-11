import { verifyAccessToken } from '../config/jwt.js';
import { apiError } from '../utils/response.js';
import prisma from '../config/db.js';

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return apiError(res, 'Authentication token missing', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    if (!decoded || !decoded.userId) {
      return apiError(res, 'Invalid or expired access token', 401, 'INVALID_TOKEN');
    }

    // Verify user exists and is active in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        userCode: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        sponsorId: true
      }
    });

    if (!user) {
      return apiError(res, 'Authenticated user account no longer exists', 401, 'USER_NOT_FOUND');
    }

    if (user.status === 'SUSPENDED') {
      return apiError(res, 'Your account has been suspended. Please contact administrator.', 403, 'ACCOUNT_SUSPENDED');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return apiError(res, 'User not authenticated', 401, 'UNAUTHORIZED');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return apiError(res, `Access denied. Requires one of roles: ${allowedRoles.join(', ')}`, 403, 'FORBIDDEN');
    }

    next();
  };
}
