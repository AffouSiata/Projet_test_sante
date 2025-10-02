import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { Role } from '@prisma/client';
import { emailSchema, passwordSchema, phoneSchema } from '../../common/dto/base.dto';

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: phoneSchema,
  dateOfBirth: z.string().datetime({ offset: true }).optional(),
  address: z.string().optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const createDoctorSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: phoneSchema,
  specialization: z.string().min(2, 'Specialization is required'),
  licenseNumber: z.string().min(5, 'License number is required'),
  bio: z.string().optional(),
  yearsOfExperience: z.number().int().min(0).optional(),
  consultationFee: z.number().min(0).optional(),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: phoneSchema,
  address: z.string().optional(),
  dateOfBirth: z.string().datetime({ offset: true }).optional(),
  allergies: z.string().optional(),
  bloodType: z.string().optional(),
  medicalHistory: z.string().optional(),
});

export const updateDoctorProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: phoneSchema,
  bio: z.string().optional(),
  yearsOfExperience: z.number().int().min(0).optional(),
  consultationFee: z.number().min(0).optional(),
  availability: z.any().optional(),
});

export const updateAdminProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: phoneSchema,
});

export class RegisterDto extends createZodDto(registerSchema) {}
export class LoginDto extends createZodDto(loginSchema) {}
export class CreateDoctorDto extends createZodDto(createDoctorSchema) {}
export class UpdateProfileDto extends createZodDto(updateProfileSchema) {}
export class UpdateDoctorProfileDto extends createZodDto(updateDoctorProfileSchema) {}
export class UpdateAdminProfileDto extends createZodDto(updateAdminProfileSchema) {}