import { z } from 'zod';

export const updateUserStatusSchema = z.object({
  status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED'], {
    errorMap: () => ({ message: 'Status must be PENDING, ACTIVE, or SUSPENDED' })
  })
});

export const processPayoutSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'PROCESSING', 'PAID', 'CANCELLED']),
  transactionRef: z.string().optional(),
  adminNotes: z.string().optional()
});

export const productSchema = z.object({
  categoryId: z.string().uuid('Valid category ID required'),
  name: z.string().min(2, 'Product name is required'),
  shortDescription: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be greater than zero'),
  stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
  isFeatured: z.boolean().optional().default(false),
  displayOrder: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true)
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  description: z.string().optional(),
  displayOrder: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true)
});

export const updateEnquirySchema = z.object({
  status: z.enum(['NEW', 'IN_PROGRESS', 'RESOLVED']),
  adminNotes: z.string().optional()
});

export const cmsPageSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  metaDescription: z.string().optional()
});
