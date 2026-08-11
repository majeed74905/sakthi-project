import { z } from 'zod';

export const registerSchema = z.object({
  sponsorId: z.string().min(1, 'Sponsor ID is required'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address format'),
  mobile: z.string().regex(/^\d{10}$/, 'Mobile number must be exactly 10 numerical digits'),
  loginPassword: z.string().min(6, 'Login password must be at least 6 characters'),
  transactionPassword: z.string().min(6, 'Transaction password must be at least 6 characters'),
  bankDetails: z.object({
    accountName: z.string().min(2, 'Account holder name is required'),
    accountNumber: z.string().min(6, 'Account number must be at least 6 characters'),
    ifsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/i, 'Invalid IFSC code format (e.g. SBIN0001234)'),
    bankName: z.string().min(2, 'Bank name is required'),
    branchName: z.string().min(2, 'Branch name is required')
  })
});

export const loginSchema = z.object({
  identifier: z.string().min(1, 'User Code, Email, or Mobile number is required'),
  password: z.string().min(1, 'Password is required')
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address format')
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters')
});
