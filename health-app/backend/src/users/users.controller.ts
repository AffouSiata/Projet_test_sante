import { Controller, Get, Put, Delete, Body, UseGuards, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateProfileDto, UpdateDoctorProfileDto, UpdateAdminProfileDto } from '../auth/dto/auth.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user) {
    return this.usersService.getProfile(user.id);
  }

  @Put('profile/patient')
  @UseGuards(RolesGuard)
  @Roles(Role.PATIENT)
  async updatePatientProfile(
    @CurrentUser() user,
    @Body(ZodValidationPipe) updateDto: UpdateProfileDto,
  ) {
    return this.usersService.updatePatientProfile(user.id, updateDto);
  }

  @Put('profile/doctor')
  @UseGuards(RolesGuard)
  @Roles(Role.DOCTOR)
  async updateDoctorProfile(
    @CurrentUser() user,
    @Body(ZodValidationPipe) updateDto: UpdateDoctorProfileDto,
  ) {
    return this.usersService.updateDoctorProfile(user.id, updateDto);
  }

  @Put('profile/admin')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async updateAdminProfile(
    @CurrentUser() user,
    @Body(ZodValidationPipe) updateDto: UpdateAdminProfileDto,
  ) {
    return this.usersService.updateAdminProfile(user.id, updateDto);
  }

  @Delete('profile')
  async deleteProfile(@CurrentUser() user) {
    return this.usersService.deleteProfile(user.id);
  }

  @Get('doctors')
  async getAllDoctors() {
    return this.usersService.getAllDoctors();
  }

  @Get('doctors/:id')
  async getDoctorById(@Param('id') id: string) {
    return this.usersService.getDoctorById(id);
  }
}