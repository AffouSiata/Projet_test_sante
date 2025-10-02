import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async createAppointment(patientId: string, createDto: CreateAppointmentDto) {
    // Check if doctor exists
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: createDto.doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Check if patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { userId: patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    const appointmentDateTime = new Date(createDto.dateTime);
    const appointmentEndTime = new Date(appointmentDateTime.getTime() + createDto.duration * 60000);

    // Check for appointment collisions
    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        doctorId: createDto.doctorId,
        status: {
          in: ['SCHEDULED', 'CONFIRMED'],
        },
        OR: [
          {
            dateTime: {
              gte: appointmentDateTime,
              lt: appointmentEndTime,
            },
          },
          {
            AND: [
              {
                dateTime: {
                  lte: appointmentDateTime,
                },
              },
              {
                dateTime: {
                  gte: new Date(appointmentDateTime.getTime() - 120 * 60000), // Max 2 hours before
                },
              },
            ],
          },
        ],
      },
    });

    // Check for actual time overlap
    const hasCollision = existingAppointments.some(appointment => {
      const existingEnd = new Date(appointment.dateTime.getTime() + appointment.duration * 60000);
      return (
        (appointmentDateTime < existingEnd && appointmentEndTime > appointment.dateTime)
      );
    });

    if (hasCollision) {
      throw new ConflictException('This time slot is already booked');
    }

    // Check if appointment is in the past
    if (appointmentDateTime < new Date()) {
      throw new ConflictException('Cannot book appointments in the past');
    }

    const appointment = await this.prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: createDto.doctorId,
        dateTime: appointmentDateTime,
        duration: createDto.duration,
        reason: createDto.reason,
        status: 'SCHEDULED',
      },
      include: {
        doctor: {
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
    });

    return appointment;
  }

  async getPatientAppointments(patientId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId: patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    const appointments = await this.prisma.appointment.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: {
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
        dateTime: 'asc',
      },
    });

    return appointments;
  }

  async getDoctorAppointments(doctorId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId: doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    const appointments = await this.prisma.appointment.findMany({
      where: { doctorId: doctor.id },
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
    });

    return appointments;
  }

  async getAppointmentById(appointmentId: string, userId: string, userRole: Role) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        doctor: {
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
        patient: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Check authorization
    if (userRole === Role.PATIENT && appointment.patient.user.id !== userId) {
      throw new ForbiddenException('You can only view your own appointments');
    }

    if (userRole === Role.DOCTOR && appointment.doctor.userId !== userId) {
      throw new ForbiddenException('You can only view appointments for your patients');
    }

    return appointment;
  }

  async updateAppointment(
    appointmentId: string,
    userId: string,
    userRole: Role,
    updateDto: UpdateAppointmentDto,
  ) {
    const appointment = await this.getAppointmentById(appointmentId, userId, userRole);

    if (updateDto.dateTime) {
      const newDateTime = new Date(updateDto.dateTime);
      const newEndTime = new Date(newDateTime.getTime() + (updateDto.duration || appointment.duration) * 60000);

      // Check for collisions with new time
      const existingAppointments = await this.prisma.appointment.findMany({
        where: {
          id: { not: appointmentId },
          doctorId: appointment.doctorId,
          status: {
            in: ['SCHEDULED', 'CONFIRMED'],
          },
        },
      });

      const hasCollision = existingAppointments.some(existing => {
        const existingEnd = new Date(existing.dateTime.getTime() + existing.duration * 60000);
        return (newDateTime < existingEnd && newEndTime > existing.dateTime);
      });

      if (hasCollision) {
        throw new ConflictException('This time slot is already booked');
      }
    }

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        dateTime: updateDto.dateTime ? new Date(updateDto.dateTime) : undefined,
        duration: updateDto.duration,
        reason: updateDto.reason,
        notes: updateDto.notes,
        status: updateDto.status,
      },
      include: {
        doctor: {
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
    });

    return updatedAppointment;
  }

  async cancelAppointment(appointmentId: string, userId: string, userRole: Role) {
    await this.getAppointmentById(appointmentId, userId, userRole);

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'CANCELLED',
      },
    });

    return updatedAppointment;
  }

  async getAvailableSlots(doctorId: string, date: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const startDate = new Date(`${date}T00:00:00`);
    const endDate = new Date(`${date}T23:59:59`);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        dateTime: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          in: ['SCHEDULED', 'CONFIRMED'],
        },
      },
      orderBy: {
        dateTime: 'asc',
      },
    });

    // Generate available time slots (9 AM to 5 PM, 30-minute intervals)
    const slots: Array<{ time: string; available: boolean }> = [];
    const workStart = 9; // 9 AM
    const workEnd = 17; // 5 PM
    const slotDuration = 30; // minutes

    for (let hour = workStart; hour < workEnd; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const slotTime = new Date(`${date}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`);
        const slotEndTime = new Date(slotTime.getTime() + slotDuration * 60000);

        // Check if slot is available
        const isAvailable = !appointments.some(appointment => {
          const appointmentEnd = new Date(appointment.dateTime.getTime() + appointment.duration * 60000);
          return (slotTime < appointmentEnd && slotEndTime > appointment.dateTime);
        });

        if (isAvailable && slotTime > new Date()) {
          slots.push({
            time: slotTime.toISOString(),
            available: true,
          });
        }
      }
    }

    return slots;
  }
}