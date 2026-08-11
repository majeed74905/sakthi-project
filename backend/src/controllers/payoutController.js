import { apiSuccess } from '../utils/response.js';
import * as payoutService from '../services/payoutService.js';
import { payoutRequestSchema } from '../validators/memberValidator.js';

export async function createPayoutRequestHandler(req, res, next) {
  try {
    const { amount, transactionPassword } = payoutRequestSchema.parse(req.body);
    const ipAddress = req.ip || req.socket.remoteAddress;

    const payout = await payoutService.createPayoutRequest(req.user.id, amount, transactionPassword, ipAddress);
    return apiSuccess(res, 'Payout request submitted successfully and is currently under admin review.', payout, 201);
  } catch (err) {
    next(err);
  }
}

export async function getMemberPayoutsHandler(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const payouts = await payoutService.getMemberPayouts(req.user.id, { page, limit });
    return apiSuccess(res, 'Payout requests history retrieved', payouts.items, 200, payouts.pagination);
  } catch (err) {
    next(err);
  }
}
