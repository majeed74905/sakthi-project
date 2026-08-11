import { z } from 'zod';

export const enquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address format'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters')
});
