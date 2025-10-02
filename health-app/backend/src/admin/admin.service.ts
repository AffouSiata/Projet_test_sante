import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CreateDoctorDto } from '../auth/dto/auth.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async createDoctor(createDoctorDto: CreateDoctorDto) {
    return this.authService.createDoctor(createDoctorDto);
  }

  async updateDoctor(doctorId: string, updateData: Partial<CreateDoctorDto>) {
    const doctor = await this.prisma.user.findFirst({
      where: {
        id: doctorId,
        role: Role.DOCTOR,
      },
      include: { doctorProfile: true },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const updatedDoctor = await this.prisma.user.update({
      where: { id: doctorId },
      data: {
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        phone: updateData.phone,
        doctorProfile: {
          update: {
            specialization: updateData.specialization,
            bio: updateData.bio,
            yearsOfExperience: updateData.yearsOfExperience,
            consultationFee: updateData.consultationFee,
          },
        },
      },
      include: { doctorProfile: true },
    });

    const { password, ...result } = updatedDoctor;
    return result;
  }

  async deleteDoctor(doctorId: string) {
    const doctor = await this.prisma.user.findFirst({
      where: {
        id: doctorId,
        role: Role.DOCTOR,
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    await this.prisma.user.delete({
      where: { id: doctorId },
    });

    return { message: 'Doctor deleted successfully' };
  }

  async getAllDoctors() {
    const doctors = await this.prisma.user.findMany({
      where: { role: Role.DOCTOR },
      include: {
        doctorProfile: {
          include: {
            appointments: {
              include: {
                patient: {
                  include: {
                    user: {
                      select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                      },
                    },
                  },
                },
              },
              orderBy: {
                dateTime: 'desc',
              },
            },
          },
        },
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

  async getDoctorAppointments(doctorId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
      include: {
        appointments: {
          include: {
            patient: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
          orderBy: {
            dateTime: 'asc',
          },
        },
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor.appointments;
  }

  async getStatistics() {
    const [totalPatients, totalDoctors, totalAppointments] = await Promise.all([
      this.prisma.user.count({ where: { role: Role.PATIENT } }),
      this.prisma.user.count({ where: { role: Role.DOCTOR } }),
      this.prisma.appointment.count(),
    ]);

    const recentAppointments = await this.prisma.appointment.findMany({
      take: 10,
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      totalPatients,
      totalDoctors,
      totalAppointments,
      recentAppointments,
    };
  }
}