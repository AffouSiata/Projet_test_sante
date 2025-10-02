import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateDoctorDto } from '../auth/dto/auth.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('doctors')
  async createDoctor(@Body(ZodValidationPipe) createDoctorDto: CreateDoctorDto) {
    return this.adminService.createDoctor(createDoctorDto);
  }

  @Put('doctors/:id')
  async updateDoctor(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateDoctorDto>,
  ) {
    return this.adminService.updateDoctor(id, updateData);
  }

  @Delete('doctors/:id')
  async deleteDoctor(@Param('id') id: string) {
    return this.adminService.deleteDoctor(id);
  }

  @Get('doctors')
  async getAllDoctors() {
    return this.adminService.getAllDoctors();
  }

  @Get('doctors/:id/appointments')
  async getDoctorAppointments(@Param('id') id: string) {
    return this.adminService.getDoctorAppointments(id);
  }

  @Get('statistics')
  async getStatistics() {
    return this.adminService.getStatistics();
  }
}