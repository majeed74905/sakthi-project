import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';
import { maskAccountNumber } from '../utils/maskData.js';
import { createAuditLog } from '../utils/auditLog.js';

/**
 * Submit Payout Request with transaction password validation and balance checks
 */
export async function createPayoutRequest(userId, amount, transactionPassword, ipAddress) {
  if (amount <= 0) {
    const error = new Error('Payout request amount must be greater than zero');
    error.statusCode = 400;
    error.errorCode = 'INVALID_AMOUNT';
    throw error;
  }

  // 1. Fetch user & verified bank details
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      userCode: true,
      status: true,
      transactionPasswordHash: true,
      bankDetails: true
    }
  });

  if (!user) {
    const error = new Error('Member not found');
    error.statusCode = 404;
    error.errorCode = 'NOT_FOUND';
    throw error;
  }

  if (user.status !== 'ACTIVE') {
    const error = new Error('Only active members may submit payout requests');
    error.statusCode = 403;
    error.errorCode = 'ACCOUNT_INACTIVE';
    throw error;
  }

  if (!user.bankDetails) {
    const error = new Error('Please add your bank account details before requesting a payout');
    error.statusCode = 400;
    error.errorCode = 'BANK_DETAILS_MISSING';
    throw error;
  }

  // 2. Validate Transaction Password
  const isMatch = await bcrypt.compare(transactionPassword, user.transactionPasswordHash);
  if (!isMatch) {
    const error = new Error('Invalid transaction password provided');
    error.statusCode = 400;
    error.errorCode = 'INVALID_TRANSACTION_PASSWORD';
    throw error;
  }

  // 3. Execute Balance Check & Payout Request inside Prisma Transaction to prevent race conditions
  const payoutRequest = await prisma.$transaction(async (tx) => {
    // Total Earnings
    const commAgg = await tx.commission.aggregate({
      where: { userId, status: 'APPROVED' },
      _sum: { amount: true }
    });
    const totalEarnings = Number(commAgg._sum.amount) || 0;

    // Paid Payouts
    const paidAgg = await tx.payoutRequest.aggregate({
      where: { userId, status: 'PAID' },
      _sum: { amount: true }
    });
    const totalPaid = Number(paidAgg._sum.amount) || 0;

    // Pending Payouts
    const pendingAgg = await tx.payoutRequest.aggregate({
      where: { userId, status: { in: ['PENDING', 'PROCESSING', 'APPROVED'] } },
      _sum: { amount: true }
    });
    const totalPending = Number(pendingAgg._sum.amount) || 0;

    const availableBalance = Math.max(0, totalEarnings - totalPaid - totalPending);

    if (amount > availableBalance) {
      const error = new Error(`Requested amount ₹${amount} exceeds your available balance of ₹${availableBalance.toFixed(2)}`);
      error.statusCode = 400;
      error.errorCode = 'INSUFFICIENT_BALANCE';
      throw error;
    }

    // Snapshot Bank Details safely (Masked account number stored in snapshot for audit safety)
    const bankSnapshot = {
      accountName: user.bankDetails.accountName,
      accountNumberMasked: maskAccountNumber(user.bankDetails.accountNumber),
      ifscCode: user.bankDetails.ifscCode,
      bankName: user.bankDetails.bankName,
      branchName: user.bankDetails.branchName
    };

    return await tx.payoutRequest.create({
      data: {
        userId,
        amount,
        bankSnapshot,
        status: 'PENDING',
        transactionPasswordVerified: true
      }
    });
  });

  await createAuditLog({
    userId,
    action: 'PAYOUT_REQUESTED',
    entityType: 'PayoutRequest',
    entityId: payoutRequest.id,
    description: `Member ${user.userCode} requested payout of ₹${amount}`,
    ipAddress
  });

  return payoutRequest;
}

/**
 * Get member's payout requests history
 */
export async function getMemberPayouts(userId, { page = 1, limit = 10 }) {
  const skip = (page - 1) * limit;

  const [total, items] = await Promise.all([
    prisma.payoutRequest.count({ where: { userId } }),
    prisma.payoutRequest.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}
