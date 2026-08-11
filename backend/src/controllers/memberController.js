import { apiSuccess } from '../utils/response.js';
import * as memberService from '../services/memberService.js';
import { updateProfileSchema, updateBankDetailsSchema } from '../validators/memberValidator.js';

export async function getProfileHandler(req, res, next) {
  try {
    const profile = await memberService.getMemberProfile(req.user.id);
    return apiSuccess(res, 'Member profile retrieved', profile);
  } catch (err) {
    next(err);
  }
}

export async function updateProfileHandler(req, res, next) {
  try {
    const validated = updateProfileSchema.parse(req.body);
    const updated = await memberService.updateMemberProfile(req.user.id, validated);
    return apiSuccess(res, 'Profile updated successfully', updated);
  } catch (err) {
    next(err);
  }
}

export async function getBankDetailsHandler(req, res, next) {
  try {
    const bank = await memberService.getMemberBankDetails(req.user.id);
    return apiSuccess(res, 'Bank details retrieved', bank);
  } catch (err) {
    next(err);
  }
}

export async function updateBankDetailsHandler(req, res, next) {
  try {
    const validated = updateBankDetailsSchema.parse(req.body);
    const ipAddress = req.ip || req.socket.remoteAddress;

    const updated = await memberService.updateMemberBankDetails(req.user.id, validated, ipAddress);
    return apiSuccess(res, 'Bank details updated successfully', updated);
  } catch (err) {
    next(err);
  }
}

export async function getDashboardHandler(req, res, next) {
  try {
    const metrics = await memberService.getMemberDashboard(req.user.id);
    return apiSuccess(res, 'Dashboard metrics retrieved', metrics);
  } catch (err) {
    next(err);
  }
}

export async function getReferralsHandler(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';

    const referrals = await memberService.getMemberReferrals(req.user.id, { page, limit, search });
    return apiSuccess(res, 'Direct referrals list retrieved', referrals.items, 200, referrals.pagination);
  } catch (err) {
    next(err);
  }
}

export async function getNetworkTreeHandler(req, res, next) {
  try {
    const tree = await memberService.getMemberNetworkTree(req.user.id);
    return apiSuccess(res, 'Downline network tree retrieved', tree);
  } catch (err) {
    next(err);
  }
}

export async function getEarningsHandler(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const type = req.query.type || '';

    const earnings = await memberService.getMemberEarnings(req.user.id, { page, limit, type });
    return apiSuccess(res, 'Commission earnings ledger retrieved', earnings.items, 200, earnings.pagination);
  } catch (err) {
    next(err);
  }
}

export async function getNotificationsHandler(req, res, next) {
  try {
    const notifications = await memberService.getMemberNotifications(req.user.id);
    return apiSuccess(res, 'Member notifications retrieved', notifications);
  } catch (err) {
    next(err);
  }
}

export async function markNotificationReadHandler(req, res, next) {
  try {
    const { id } = req.params;
    await memberService.markNotificationRead(req.user.id, id);
    return apiSuccess(res, 'Notification marked as read');
  } catch (err) {
    next(err);
  }
}

export async function changePasswordHandler(req, res, next) {
  try {
    const { currentPassword, newPassword, type } = req.body;
    await memberService.changeMemberPassword(req.user.id, { currentPassword, newPassword, type });
    return apiSuccess(res, 'Password changed successfully');
  } catch (err) {
    next(err);
  }
}

