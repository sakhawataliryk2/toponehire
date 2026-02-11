import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@toponehire.com',
      password: hashedPassword,
    },
  });

  console.log('Admin user created:', admin);

  // Default Job Seeker product (free, assigned on registration)
  let freeResume = await prisma.product.findFirst({
    where: { type: 'JOB_SEEKER', name: 'Free Resume Posting' },
  });
  if (!freeResume) {
    freeResume = await prisma.product.create({
      data: {
        type: 'JOB_SEEKER',
        name: 'Free Resume Posting',
        description: 'Assigned to job seeker upon registration.',
        price: 0,
        billingInterval: 'MONTHLY',
        firstMonthFree: false,
        postResumes: true,
        jobAccess: true,
        assignedOnRegistration: true,
        active: true,
      },
    });
    console.log('Job Seeker product created:', freeResume.name);
  }

  // Default payment method
  let stripe = await prisma.paymentMethod.findFirst({
    where: { name: 'Stripe' },
  });
  if (!stripe) {
    stripe = await prisma.paymentMethod.create({
      data: { name: 'Stripe', isActive: true },
    });
    console.log('Payment method created:', stripe.name);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
