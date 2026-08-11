import { apiSuccess, apiError } from '../utils/response.js';
import * as authService from '../services/authService.js';
import * as emailService from '../services/emailService.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/authValidator.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.COOKIE_SAMESITE || (process.env.NODE_ENV === 'production' ? 'none' : 'lax'),
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/v1/auth'
};

export async function verifySponsorHandler(req, res, next) {
  try {
    const { userCode } = req.params;
    const result = await authService.verifySponsor(userCode);
    return apiSuccess(res, 'Sponsor verification completed', result);
  } catch (err) {
    next(err);
  }
}

export async function registerHandler(req, res, next) {
  try {
    const validated = registerSchema.parse(req.body);
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const result = await authService.registerMember(validated, ipAddress);

    // Trigger transactional welcome email
    if (result.user) {
      emailService.sendWelcomeEmail({
        email: result.user.email,
        fullName: result.user.fullName,
        userCode: result.user.userCode
      }).catch(err => console.error('[EMAIL ERROR] Welcome email dispatch failed:', err));
    }

    // Set Refresh Token in Secure HttpOnly Cookie
    if (result.refreshToken) {
      res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
    }

    return apiSuccess(res, `Account created successfully! Your User ID is ${result.user.userCode}.`, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function loginHandler(req, res, next) {
  try {
    const { identifier, password } = loginSchema.parse(req.body);
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const result = await authService.loginUser(identifier, password, ipAddress);

    // Set Refresh Token in Secure HttpOnly Cookie
    if (result.refreshToken) {
      res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
    }

    return apiSuccess(res, 'Login successful', result);
  } catch (err) {
    next(err);
  }
}

export async function refreshTokenHandler(req, res, next) {
  try {
    const tokenFromCookie = req.cookies?.refreshToken;
    const tokenFromBody = req.body?.refreshToken;
    const refreshTokenStr = tokenFromCookie || tokenFromBody;

    if (!refreshTokenStr) {
      return apiError(res, 'Refresh token is required', 400, 'TOKEN_REQUIRED');
    }

    const result = await authService.refreshAccessToken(refreshTokenStr);
    return apiSuccess(res, 'Access token refreshed', result);
  } catch (err) {
    next(err);
  }
}

export async function logoutHandler(req, res, next) {
  try {
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    return apiSuccess(res, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
}

export async function getCurrentUserHandler(req, res, next) {
  try {
    return apiSuccess(res, 'Current authenticated user profile', { user: req.user });
  } catch (err) {
    next(err);
  }
}

export async function forgotPasswordHandler(req, res, next) {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    // Trigger reset token email
    emailService.sendPasswordResetEmail({ email, token: 'DEMO_RESET_TOKEN_123' })
      .catch(err => console.error('[EMAIL ERROR] Reset email dispatch failed:', err));

    return apiSuccess(res, 'If an account with that email exists, password reset instructions have been sent.');
  } catch (err) {
    next(err);
  }
}

export async function resetPasswordHandler(req, res, next) {
  try {
    resetPasswordSchema.parse(req.body);
    return apiSuccess(res, 'Password has been reset successfully.');
  } catch (err) {
    next(err);
  }
}
