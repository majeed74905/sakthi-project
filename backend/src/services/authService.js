import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../config/jwt.js';
import { generateUserCode } from '../utils/userCodeGenerator.js';
import { createAuditLog } from '../utils/auditLog.js';

/**
 * Verify Sponsor ID against database
 */
export async function verifySponsor(userCode) {
  if (!userCode || typeof userCode !== 'string') {
    return { valid: false };
  }

  const sponsor = await prisma.user.findFirst({
    where: {
      userCode: userCode.trim(),
      status: 'ACTIVE'
    },
    select: {
      id: true,
      userCode: true,
      fullName: true
    }
  });

  if (!sponsor) {
    return { valid: false };
  }

  return {
    valid: true,
    userCode: sponsor.userCode,
    sponsorName: sponsor.fullName
  };
}

/**
 * Register a new member atomically using Prisma transaction
 */
export async function registerMember(data, ipAddress) {
  const { sponsorId, fullName, email, mobile, loginPassword, transactionPassword, bankDetails } = data;

  // 1. Verify Sponsor exists and is active
  const sponsor = await prisma.user.findFirst({
    where: {
      userCode: sponsorId.trim(),
      status: 'ACTIVE'
    }
  });

  if (!sponsor) {
    const error = new Error('Invalid or inactive Sponsor ID provided');
    error.statusCode = 400;
    error.errorCode = 'INVALID_SPONSOR';
    throw error;
  }

  // 2. Prevent self-sponsorship (redundant for new user, but safety check)
  if (sponsor.email.toLowerCase() === email.toLowerCase() || sponsor.phone === mobile) {
    const error = new Error('Self sponsorship is not allowed');
    error.statusCode = 400;
    error.errorCode = 'SELF_SPONSOR_FORBIDDEN';
    throw error;
  }

  // 3. Check Email & Phone uniqueness
  const existingEmail = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existingEmail) {
    const error = new Error('An account with this email address already exists');
    error.statusCode = 409;
    error.errorCode = 'EMAIL_EXISTS';
    throw error;
  }

  const existingPhone = await prisma.user.findUnique({ where: { phone: mobile } });
  if (existingPhone) {
    const error = new Error('An account with this contact mobile number already exists');
    error.statusCode = 409;
    error.errorCode = 'MOBILE_EXISTS';
    throw error;
  }

  // 4. Hash passwords using bcrypt (cost factor 10)
  const passwordHash = await bcrypt.hash(loginPassword, 10);
  const transactionPasswordHash = await bcrypt.hash(transactionPassword, 10);

  // 5. Execute Atomic Registration via Prisma Transaction
  const newUser = await prisma.$transaction(async (tx) => {
    // Generate unique User Code MSM...
    const newUserCode = await generateUserCode(tx);

    // Create User record
    const user = await tx.user.create({
      data: {
        userCode: newUserCode,
        fullName,
        email: email.toLowerCase(),
        phone: mobile,
        passwordHash,
        transactionPasswordHash,
        role: 'MEMBER',
        status: 'ACTIVE',
        sponsorId: sponsor.id,
        bankDetails: {
          create: {
            accountName: bankDetails.accountName,
            accountNumber: bankDetails.accountNumber,
            ifscCode: bankDetails.ifsc.toUpperCase(),
            bankName: bankDetails.bankName,
            branchName: bankDetails.branchName,
            isVerified: false
          }
        }
      }
    });

    // Create Referral entry
    await tx.referral.create({
      data: {
        sponsorCode: sponsor.userCode,
        referredUserCode: newUserCode,
        status: 'ACTIVE',
        eligibilityStatus: 'QUALIFIED'
      }
    });

    return user;
  });

  // Log registration audit trail
  await createAuditLog({
    userId: newUser.id,
    action: 'MEMBER_REGISTERED',
    entityType: 'User',
    entityId: newUser.id,
    description: `New member ${newUser.userCode} registered under Sponsor ${sponsor.userCode}`,
    ipAddress
  });

  // Issue Access & Refresh Tokens
  const accessToken = generateAccessToken({ userId: newUser.id, role: newUser.role, userCode: newUser.userCode });
  const refreshToken = generateRefreshToken({ userId: newUser.id });

  return {
    user: {
      id: newUser.id,
      userCode: newUser.userCode,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      status: newUser.status,
      sponsorCode: sponsor.userCode
    },
    accessToken,
    refreshToken
  };
}

/**
 * Authenticate user via User Code / Email / Mobile + Password
 */
export async function loginUser(identifier, password, ipAddress) {
  const trimmed = identifier.trim();

  // Search user by userCode, email, or phone
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { userCode: trimmed.toUpperCase() },
        { email: trimmed.toLowerCase() },
        { phone: trimmed }
      ]
    }
  });

  if (!user) {
    const error = new Error('Invalid credentials provided');
    error.statusCode = 401;
    error.errorCode = 'INVALID_CREDENTIALS';
    throw error;
  }

  if (user.status === 'SUSPENDED') {
    const error = new Error('Your account has been suspended. Please contact support.');
    error.statusCode = 403;
    error.errorCode = 'ACCOUNT_SUSPENDED';
    throw error;
  }

  // Validate bcrypt password hash
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error('Invalid credentials provided');
    error.statusCode = 401;
    error.errorCode = 'INVALID_CREDENTIALS';
    throw error;
  }

  await createAuditLog({
    userId: user.id,
    action: 'USER_LOGIN',
    entityType: 'User',
    entityId: user.id,
    description: `User ${user.userCode} logged in successfully`,
    ipAddress
  });

  const accessToken = generateAccessToken({ userId: user.id, role: user.role, userCode: user.userCode });
  const refreshToken = generateRefreshToken({ userId: user.id });

  return {
    user: {
      id: user.id,
      userCode: user.userCode,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    },
    accessToken,
    refreshToken
  };
}

/**
 * Issue new access token using valid refresh token
 */
export async function refreshAccessToken(refreshTokenStr) {
  const decoded = verifyRefreshToken(refreshTokenStr);
  if (!decoded || !decoded.userId) {
    const error = new Error('Invalid or expired refresh token');
    error.statusCode = 401;
    error.errorCode = 'INVALID_REFRESH_TOKEN';
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, userCode: true, role: true, status: true }
  });

  if (!user || user.status === 'SUSPENDED') {
    const error = new Error('User account not active');
    error.statusCode = 401;
    error.errorCode = 'UNAUTHORIZED';
    throw error;
  }

  const accessToken = generateAccessToken({ userId: user.id, role: user.role, userCode: user.userCode });
  return { accessToken };
}
