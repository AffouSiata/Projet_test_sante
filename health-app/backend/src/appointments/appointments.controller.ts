import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateAppointmentDto, UpdateAppointmentDto, GetAvailableSlotsDto } from './dto/appointment.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import { Role } from '@prisma/client';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.PATIENT)
  async createAppointment(
    @CurrentUser() user,
    @Body(ZodValidationPipe) createDto: CreateAppointmentDto,
  ) {
    return this.appointmentsService.createAppointment(user.id, createDto);
  }

  @Get('patient')
  @UseGuards(RolesGuard)
  @Roles(Role.PATIENT)
  async getPatientAppointments(@CurrentUser() user) {
    return this.appointmentsService.getPatientAppointments(user.id);
  }

  @Get('doctor')
  @UseGuards(RolesGuard)
  @Roles(Role.DOCTOR)
  async getDoctorAppointments(@CurrentUser() user) {
    return this.appointmentsService.getDoctorAppointments(user.id);
  }

  @Get('available-slots')
  async getAvailableSlots(@Query(ZodValidationPipe) query: GetAvailableSlotsDto) {
    return this.appointmentsService.getAvailableSlots(query.doctorId, query.date);
  }

  @Get(':id')
  async getAppointmentById(@Param('id') id: string, @CurrentUser() user) {
    return this.appointmentsService.getAppointmentById(id, user.id, user.role);
  }

  @Put(':id')
  async updateAppointment(
    @Param('id') id: string,
    @CurrentUser() user,
    @Body(ZodValidationPipe) updateDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.updateAppointment(id, user.id, user.role, updateDto);
  }

  @Delete(':id')
  async cancelAppointment(@Param('id') id: string, @CurrentUser() user) {
    return this.appointmentsService.cancelAppointment(id, user.id, user.role);
  }
}