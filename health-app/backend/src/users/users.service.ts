import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto, UpdateDoctorProfileDto, UpdateAdminProfileDto } from '../auth/dto/auth.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        patientProfile: true,
        doctorProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }

  async updatePatientProfile(userId: string, updateDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== Role.PATIENT) {
      throw new ForbiddenException('Only patients can update patient profiles');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: updateDto.firstName,
        lastName: updateDto.lastName,
        phone: updateDto.phone,
        patientProfile: {
          upsert: {
            create: {
              dateOfBirth: updateDto.dateOfBirth ? new Date(updateDto.dateOfBirth) : undefined,
              address: updateDto.address,
              allergies: updateDto.allergies,
              bloodType: updateDto.bloodType,
              medicalHistory: updateDto.medicalHistory,
            },
            update: {
              dateOfBirth: updateDto.dateOfBirth ? new Date(updateDto.dateOfBirth) : undefined,
              address: updateDto.address,
              allergies: updateDto.allergies,
              bloodType: updateDto.bloodType,
              medicalHistory: updateDto.medicalHistory,
            },
          },
        },
      },
      include: { patientProfile: true },
    });

    const { password, ...result } = updatedUser;
    return result;
  }

  async updateDoctorProfile(userId: string, updateDto: UpdateDoctorProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { doctorProfile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== Role.DOCTOR) {
      throw new ForbiddenException('Only doctors can update doctor profiles');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: updateDto.firstName,
        lastName: updateDto.lastName,
        phone: updateDto.phone,
        doctorProfile: {
          upsert: {
            create: {
              specialization: user.doctorProfile?.specialization || '',
              licenseNumber: user.doctorProfile?.licenseNumber || '',
              bio: updateDto.bio,
              yearsOfExperience: updateDto.yearsOfExperience,
              consultationFee: updateDto.consultationFee,
            },
            update: {
              bio: updateDto.bio,
              yearsOfExperience: updateDto.yearsOfExperience,
              consultationFee: updateDto.consultationFee,
            },
          },
        },
      },
      include: { doctorProfile: true },
    });

    const { password, ...result } = updatedUser;
    return result;
  }

  async updateAdminProfile(userId: string, updateDto: UpdateAdminProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can update admin profiles');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: updateDto.firstName,
        lastName: updateDto.lastName,
        phone: updateDto.phone,
      },
    });

    const { password, ...result } = updatedUser;
    return result;
  }

  async deleteProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'Profile deleted successfully' };
  }

  async getAllDoctors() {
    const doctors = await this.prisma.user.findMany({
      where: { role: Role.DOCTOR },
      include: {
        doctorProfile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return doctors.map(doctor => {
      const { password, ...result } = doctor;
      return result;
    });
  }

  async getDoctorById(doctorId: string) {
    const doctor = await this.prisma.user.findFirst({
      where: {
        id: doctorId,
        role: Role.DOCTOR,
      },
      include: {
        doctorProfile: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const { password, ...result } = doctor;
    return result;
  }
}