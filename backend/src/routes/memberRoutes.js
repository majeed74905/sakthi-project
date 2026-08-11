import { Router } from 'express';
import {
  getProfileHandler,
  updateProfileHandler,
  getBankDetailsHandler,
  updateBankDetailsHandler,
  getDashboardHandler,
  getReferralsHandler,
  getNetworkTreeHandler,
  getEarningsHandler,
  getNotificationsHandler,
  markNotificationReadHandler,
  changePasswordHandler
} from '../controllers/memberController.js';
import { createPayoutRequestHandler, getMemberPayoutsHandler } from '../controllers/payoutController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Protect all member routes with authenticate & authorize
router.use(authenticate);
router.use(authorize('MEMBER', 'ADMIN', 'SUPER_ADMIN'));

const payoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many payout requests. Please wait before submitting another request.',
    errorCode: 'RATE_LIMIT_EXCEEDED'
  }
});

router.get('/profile', getProfileHandler);
router.put('/profile', updateProfileHandler);
router.get('/bank-details', getBankDetailsHandler);
router.put('/bank-details', updateBankDetailsHandler);
router.get('/dashboard', getDashboardHandler);
router.get('/referrals', getReferralsHandler);
router.get('/network-tree', getNetworkTreeHandler);
router.get('/earnings', getEarningsHandler);
router.post('/payout-request', payoutLimiter, createPayoutRequestHandler);
router.get('/payouts', getMemberPayoutsHandler);
router.get('/notifications', getNotificationsHandler);
router.put('/notifications/:id/read', markNotificationReadHandler);
router.put('/change-password', changePasswordHandler);

export default router;

