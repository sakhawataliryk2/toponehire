import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const email = 'admin@toponehire.com';
  const password = 'admin123';

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const admin = await prisma.admin.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    console.log('Admin user created successfully:');
    console.log('Username:', admin.username);
    console.log('Email:', admin.email);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
