import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits').optional()
});

export const updateBankDetailsSchema = z.object({
  accountName: z.string().min(2, 'Account holder name is required'),
  accountNumber: z.string().min(6, 'Account number must be at least 6 digits'),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/i, 'Invalid IFSC code format'),
  bankName: z.string().min(2, 'Bank name is required'),
  branchName: z.string().min(2, 'Branch name is required'),
  transactionPassword: z.string().min(1, 'Transaction password is required to update bank details')
});

export const payoutRequestSchema = z.object({
  amount: z.number({ invalid_type_error: 'Payout amount must be a number' }).positive('Payout amount must be greater than zero'),
  transactionPassword: z.string().min(1, 'Transaction password is required')
});
