import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['BUYER', 'SUPPLIER']),
  entityType: z.enum(['INDIVIDUAL', 'SMALL_BUSINESS', 'COMPANY'])
});

export const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});