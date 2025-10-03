import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@health.com' },
    update: {},
    create: {
      email: 'admin@health.com',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Admin',
      role: Role.ADMIN,
    },
  });

  console.log('Admin created:', admin.email);

  // Create sample doctors
  const doctorPassword = await bcrypt.hash('Doctor@123', 10);

  const doctor1 = await prisma.user.upsert({
    where: { email: 'dr.smith@health.com' },
    update: {},
    create: {
      email: 'dr.smith@health.com',
      password: doctorPassword,
      firstName: 'John',
      lastName: 'Smith',
      phone: '+1234567890',
      role: Role.DOCTOR,
      doctorProfile: {
        create: {
          specialization: 'Cardiologist',
          licenseNumber: 'LIC001',
          bio: 'Experienced cardiologist with 10+ years of practice',
          yearsOfExperience: 10,
          consultationFee: 150,
        },
      },
    },
  });

  const doctor2 = await prisma.user.upsert({
    where: { email: 'dr.johnson@health.com' },
    update: {},
    create: {
      email: 'dr.johnson@health.com',
      password: doctorPassword,
      firstName: 'Emily',
      lastName: 'Johnson',
      phone: '+1234567891',
      role: Role.DOCTOR,
      doctorProfile: {
        create: {
          specialization: 'Dermatologist',
          licenseNumber: 'LIC002',
          bio: 'Specialist in skin care and cosmetic dermatology',
          yearsOfExperience: 8,
          consultationFee: 120,
        },
      },
    },
  });

  console.log('Doctors created:', doctor1.email, doctor2.email);

  // Create sample patient
  const patientPassword = await bcrypt.hash('Patient@123', 10);
  const patient = await prisma.user.upsert({
    where: { email: 'patient@example.com' },
    update: {},
    create: {
      email: 'patient@example.com',
      password: patientPassword,
      firstName: 'Jane',
      lastName: 'Doe',
      phone: '+1234567892',
      role: Role.PATIENT,
      patientProfile: {
        create: {
          dateOfBirth: new Date('1990-05-15'),
          address: '123 Main St, City, State 12345',
          bloodType: 'O+',
          allergies: 'None',
        },
      },
    },
  });

  console.log('Patient created:', patient.email);

  console.log('Database seeded successfully!');
  console.log('Login credentials:');
  console.log('Admin: admin@health.com / Admin@123');
  console.log('Doctor: dr.smith@health.com / Doctor@123');
  console.log('Patient: patient@example.com / Patient@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });