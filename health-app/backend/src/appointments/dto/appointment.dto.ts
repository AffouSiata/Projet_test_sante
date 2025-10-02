import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { uuidSchema } from '../../common/dto/base.dto';

export const createAppointmentSchema = z.object({
  doctorId: uuidSchema,
  dateTime: z.string().datetime({ offset: true }),
  duration: z.number().int().min(15).max(120).default(30),
  reason: z.string().min(5, 'Please provide a reason for the appointment').optional(),
});

export const updateAppointmentSchema = z.object({
  dateTime: z.string().datetime({ offset: true }).optional(),
  duration: z.number().int().min(15).max(120).optional(),
  reason: z.string().min(5).optional(),
  notes: z.string().optional(),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
});

export const getAvailableSlotsSchema = z.object({
  doctorId: uuidSchema,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export class CreateAppointmentDto extends createZodDto(createAppointmentSchema) {}
export class UpdateAppointmentDto extends createZodDto(updateAppointmentSchema) {}
export class GetAvailableSlotsDto extends createZodDto(getAvailableSlotsSchema) {}