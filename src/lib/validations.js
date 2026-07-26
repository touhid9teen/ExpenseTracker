import { z } from 'zod';
import { CATEGORIES } from '../data/expenseData';

// ─── Auth ────────────────────────────────────────────────

const username = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(50, 'Username must be at most 50 characters')
  .trim();

const email = z
  .string()
  .email('Please provide a valid email address')
  .max(255)
  .trim()
  .transform((v) => v.toLowerCase());

const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number');

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required').trim(),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  username,
  email,
  password,
});

export const securityQuestionSchema = z.object({
  securityQuestion: z.string().min(1, 'Question is required').trim(),
  securityAnswer: z.string().min(1, 'Answer is required'),
});

export const recoverRequestSchema = z.object({
  email: z.string().email('Please provide a valid email address').trim().transform((v) => v.toLowerCase()),
});

export const recoverVerifySchema = z.object({
  email: z.string().email('Please provide a valid email address').trim().transform((v) => v.toLowerCase()),
  token: z.string().length(6, 'Reset code must be exactly 6 characters'),
  newPassword: password,
});

// ─── Expenses ────────────────────────────────────────────

const categorySchema = z
  .string()
  .refine((val) => CATEGORIES.includes(val), {
    message: `Category must be one of: ${CATEGORIES.join(', ')}`,
  });

const amountSchema = z
  .union([z.number().positive('Amount must be positive'), z.string().regex(/^\d+(\.\d{1,2})?$/)])
  .transform((val) => (typeof val === 'string' ? parseFloat(val) : val))
  .pipe(z.number().positive('Amount must be positive').finite('Amount must be a finite number'));

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

const descriptionSchema = z
  .string()
  .min(1, 'Description is required')
  .max(500, 'Description must be at most 500 characters')
  .trim();

export const createExpenseSchema = z.object({
  id: z.string().min(1),
  description: descriptionSchema,
  amount: amountSchema,
  date: dateSchema,
  category: categorySchema,
});

export const updateExpenseSchema = z.object({
  description: descriptionSchema,
  amount: amountSchema,
  date: dateSchema,
  category: categorySchema,
});
