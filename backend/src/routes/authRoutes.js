import { Router } from 'express';
import {
  verifySponsorHandler,
  registerHandler,
  loginHandler,
  refreshTokenHandler,
  logoutHandler,
  getCurrentUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Strict rate limiters for sensitive auth operations
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
    errorCode: 'RATE_LIMIT_EXCEEDED'
  }
});

router.get('/verify-sponsor/:userCode', verifySponsorHandler);
router.post('/register', authLimiter, registerHandler);
router.post('/login', authLimiter, loginHandler);
router.post('/refresh', refreshTokenHandler);
router.post('/logout', logoutHandler);
router.get('/me', authenticate, getCurrentUserHandler);
router.post('/forgot-password', authLimiter, forgotPasswordHandler);
router.post('/reset-password', authLimiter, resetPasswordHandler);

export default router;
