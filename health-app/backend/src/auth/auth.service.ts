import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto, CreateDoctorDto } from './dto/auth.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    console.log('Found user:', user); // Log the user to see if it's found

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        phone: registerDto.phone,
        role: Role.PATIENT,
        patientProfile: {
          create: {
            dateOfBirth: registerDto.dateOfBirth ? new Date(registerDto.dateOfBirth) : null,
            address: registerDto.address,
          },
        },
      },
      include: {
        patientProfile: true,
      },
    });

    const { password, ...result } = user;
    return this.login(result);
  }

  async createDoctor(createDoctorDto: CreateDoctorDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createDoctorDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const existingLicense = await this.prisma.doctor.findUnique({
      where: { licenseNumber: createDoctorDto.licenseNumber },
    });

    if (existingLicense) {
      throw new ConflictException('License number already exists');
    }

    const hashedPassword = await bcrypt.hash(createDoctorDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: createDoctorDto.email,
        password: hashedPassword,
        firstName: createDoctorDto.firstName,
        lastName: createDoctorDto.lastName,
        phone: createDoctorDto.phone,
        role: Role.DOCTOR,
        doctorProfile: {
          create: {
            specialization: createDoctorDto.specialization,
            licenseNumber: createDoctorDto.licenseNumber,
            bio: createDoctorDto.bio,
            yearsOfExperience: createDoctorDto.yearsOfExperience,
            consultationFee: createDoctorDto.consultationFee,
          },
        },
      },
      include: {
        doctorProfile: true,
      },
    });

    const { password, ...result } = user;
    return result;
  }

  async createAdmin(email: string, password: string, firstName: string, lastName: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Admin already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: Role.ADMIN,
      },
    });

    const { password: _, ...result } = admin;
    return result;
  }
}