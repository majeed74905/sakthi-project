import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';
import { maskAccountNumber } from '../utils/maskData.js';
import { createAuditLog } from '../utils/auditLog.js';

/**
 * Get authenticated member profile
 */
export async function getMemberProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      userCode: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      sponsorId: true,
      sponsor: {
        select: {
          userCode: true,
          fullName: true
        }
      },
      createdAt: true
    }
  });

  if (!user) {
    const error = new Error('Member profile not found');
    error.statusCode = 404;
    error.errorCode = 'NOT_FOUND';
    throw error;
  }

  return user;
}

/**
 * Update member personal profile
 */
export async function updateMemberProfile(userId, updates) {
  const allowedUpdates = {};
  if (updates.fullName) allowedUpdates.fullName = updates.fullName.trim();
  if (updates.phone) allowedUpdates.phone = updates.phone.trim();
  if (updates.email) allowedUpdates.email = updates.email.trim().toLowerCase();

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: allowedUpdates,
    select: {
      id: true,
      userCode: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      updatedAt: true
    }
  });

  return updatedUser;
}

/**
 * Get member bank account details with account number masked for privacy
 */
export async function getMemberBankDetails(userId) {
  const bank = await prisma.userBankDetails.findUnique({
    where: { userId }
  });

  if (!bank) {
    return null;
  }

  return {
    id: bank.id,
    accountName: bank.accountName,
    accountNumberMasked: maskAccountNumber(bank.accountNumber),
    ifscCode: bank.ifscCode,
    bankName: bank.bankName,
    branchName: bank.branchName,
    isVerified: bank.isVerified,
    updatedAt: bank.updatedAt
  };
}

/**
 * Update member bank account details (Requires Transaction Password validation)
 */
export async function updateMemberBankDetails(userId, data, ipAddress) {
  const { accountName, accountNumber, ifscCode, bankName, branchName, transactionPassword } = data;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, userCode: true, transactionPasswordHash: true }
  });

  if (!user) {
    const error = new Error('Member not found');
    error.statusCode = 404;
    error.errorCode = 'NOT_FOUND';
    throw error;
  }

  // Validate Transaction Password
  const isMatch = await bcrypt.compare(transactionPassword, user.transactionPasswordHash);
  if (!isMatch) {
    const error = new Error('Invalid transaction password provided');
    error.statusCode = 400;
    error.errorCode = 'INVALID_TRANSACTION_PASSWORD';
    throw error;
  }

  const updatedBank = await prisma.userBankDetails.upsert({
    where: { userId },
    update: {
      accountName,
      accountNumber,
      ifscCode: ifscCode.toUpperCase(),
      bankName,
      branchName,
      isVerified: false
    },
    create: {
      userId,
      accountName,
      accountNumber,
      ifscCode: ifscCode.toUpperCase(),
      bankName,
      branchName,
      isVerified: false
    }
  });

  await createAuditLog({
    userId,
    action: 'BANK_DETAILS_UPDATED',
    entityType: 'UserBankDetails',
    entityId: updatedBank.id,
    description: `Member ${user.userCode} updated bank details`,
    ipAddress
  });

  return {
    id: updatedBank.id,
    accountName: updatedBank.accountName,
    accountNumberMasked: maskAccountNumber(updatedBank.accountNumber),
    ifscCode: updatedBank.ifscCode,
    bankName: updatedBank.bankName,
    branchName: updatedBank.branchName,
    isVerified: updatedBank.isVerified,
    updatedAt: updatedBank.updatedAt
  };
}

/**
 * Calculate real member metrics directly from DB ledger
 */
export async function getMemberDashboard(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, userCode: true, fullName: true }
  });

  if (!user) {
    const error = new Error('Member not found');
    error.statusCode = 404;
    error.errorCode = 'NOT_FOUND';
    throw error;
  }

  // 1. Calculate Total Commissions from Ledger
  const commissionAggregate = await prisma.commission.aggregate({
    where: { userId, status: 'APPROVED' },
    _sum: { amount: true }
  });
  const totalEarnings = Number(commissionAggregate._sum.amount) || 0;

  // 2. Calculate Payout Request Summaries
  const paidPayoutsAggregate = await prisma.payoutRequest.aggregate({
    where: { userId, status: 'PAID' },
    _sum: { amount: true }
  });
  const totalPaidPayouts = Number(paidPayoutsAggregate._sum.amount) || 0;

  const pendingPayoutsAggregate = await prisma.payoutRequest.aggregate({
    where: { userId, status: { in: ['PENDING', 'PROCESSING', 'APPROVED'] } },
    _sum: { amount: true }
  });
  const pendingPayouts = Number(pendingPayoutsAggregate._sum.amount) || 0;

  // Available balance formula
  const walletBalance = Math.max(0, totalEarnings - totalPaidPayouts - pendingPayouts);

  // 3. Count Direct Referrals
  const directReferralsCount = await prisma.user.count({
    where: { sponsorId: userId }
  });

  // 4. Count Downline Team Size
  const teamSize = await getTeamSize(userId);

  // 5. Build Referral Link
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const referralLink = `${clientUrl}/register?sponsor=${user.userCode}`;

  // 6. Recent Direct Referrals
  const recentReferrals = await prisma.user.findMany({
    where: { sponsorId: userId },
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      userCode: true,
      fullName: true,
      status: true,
      createdAt: true
    }
  });

  // 7. Recent Earnings
  const recentEarnings = await prisma.commission.findMany({
    where: { userId },
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      amount: true,
      type: true,
      status: true,
      createdAt: true,
      sourceUser: {
        select: {
          userCode: true,
          fullName: true
        }
      }
    }
  });

  return {
    userCode: user.userCode,
    fullName: user.fullName,
    referralLink,
    walletBalance,
    totalEarnings,
    totalPaidPayouts,
    pendingPayouts,
    directReferralsCount,
    totalTeamSize: teamSize,
    recentReferrals,
    recentEarnings
  };
}

/**
 * Fetch member's direct referrals list with pagination
 */
export async function getMemberReferrals(userId, { page = 1, limit = 10, search = '' }) {
  const skip = (page - 1) * limit;
  const where = {
    sponsorId: userId,
    ...(search
      ? {
          OR: [
            { userCode: { contains: search } },
            { fullName: { contains: search } },
            { email: { contains: search } }
          ]
        }
      : {})
  };

  const [total, items] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userCode: true,
        fullName: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true
      }
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

/**
 * Safe downline network tree generator (Max Depth = 3 to avoid excessive DB load)
 */
export async function getMemberNetworkTree(userId, currentDepth = 1, maxDepth = 3) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      userCode: true,
      fullName: true,
      status: true,
      createdAt: true
    }
  });

  if (!user) return null;

  if (currentDepth >= maxDepth) {
    return { ...user, children: [] };
  }

  const directChildren = await prisma.user.findMany({
    where: { sponsorId: userId },
    select: { id: true }
  });

  const childrenNodes = await Promise.all(
    directChildren.map((child) => getMemberNetworkTree(child.id, currentDepth + 1, maxDepth))
  );

  return {
    ...user,
    children: childrenNodes.filter(Boolean)
  };
}

/**
 * Helper to compute downline team size recursively
 */
async function getTeamSize(userId) {
  const directChildren = await prisma.user.findMany({
    where: { sponsorId: userId },
    select: { id: true }
  });

  let size = directChildren.length;
  for (const child of directChildren) {
    size += await getTeamSize(child.id);
  }
  return size;
}

/**
 * Fetch member's commission earnings ledger
 */
export async function getMemberEarnings(userId, { page = 1, limit = 10, type = '' }) {
  const skip = (page - 1) * limit;
  const where = {
    userId,
    ...(type ? { type } : {})
  };

  const [total, items] = await Promise.all([
    prisma.commission.count({ where }),
    prisma.commission.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        amount: true,
        type: true,
        status: true,
        createdAt: true,
        sourceUser: {
          select: {
            userCode: true,
            fullName: true
          }
        }
      }
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

/**
 * Fetch member notifications
 */
export async function getMemberNotifications(userId) {
  return await prisma.notification.findMany({
    where: {
      OR: [{ userId: null }, { userId }]
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  });
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(userId, notificationId) {
  return await prisma.notification.updateMany({
    where: { id: notificationId, OR: [{ userId: null }, { userId }] },
    data: { isRead: true }
  });
}

/**
 * Change member Login or Transaction password
 */
export async function changeMemberPassword(userId, { currentPassword, newPassword, type = 'LOGIN' }) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, passwordHash: true, transactionPasswordHash: true }
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.errorCode = 'NOT_FOUND';
    throw error;
  }

  const targetHash = type === 'TRANSACTION' ? user.transactionPasswordHash : user.passwordHash;
  const isMatch = await bcrypt.compare(currentPassword, targetHash);

  if (!isMatch) {
    const error = new Error(`Current ${type.toLowerCase()} password provided is incorrect`);
    error.statusCode = 400;
    error.errorCode = 'INVALID_PASSWORD';
    throw error;
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  const dataToUpdate = type === 'TRANSACTION' 
    ? { transactionPasswordHash: newHash }
    : { passwordHash: newHash };

  await prisma.user.update({
    where: { id: userId },
    data: dataToUpdate
  });

  return { success: true };
}

