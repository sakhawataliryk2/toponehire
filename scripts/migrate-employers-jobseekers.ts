import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrate() {
  try {
    // Create the employers table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "employers" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "fullName" TEXT NOT NULL,
        "phone" TEXT NOT NULL,
        "location" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "companyName" TEXT NOT NULL,
        "website" TEXT NOT NULL,
        "logoUrl" TEXT,
        "companyDescription" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "employers_pkey" PRIMARY KEY ("id")
      );
    `);

    // Create unique index on email
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "employers_email_key" ON "employers"("email");
    `);

    // Create the job_seekers table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "job_seekers" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        "phone" TEXT,
        "location" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "job_seekers_pkey" PRIMARY KEY ("id")
      );
    `);

    // Create unique index on email
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "job_seekers_email_key" ON "job_seekers"("email");
    `);

    console.log('✅ Employers and Job Seekers tables created successfully!');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
