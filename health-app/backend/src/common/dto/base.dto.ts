import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const emailSchema = z.string().email('Invalid email format');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const phoneSchema = z
  .string()
  .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Phone number must contain only digits and optionally start with +')
  .min(10, 'Phone number must be at least 10 digits')
  .max(17, 'Phone number must be at most 17 characters')
  .or(z.literal(''))
  .optional()
  .nullable()
  .transform(val => val === '' ? undefined : val);

export const uuidSchema = z.string().uuid('Invalid UUID');

export const dateSchema = z.string().datetime({ offset: true });

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export class PaginationDto extends createZodDto(paginationSchema) {}