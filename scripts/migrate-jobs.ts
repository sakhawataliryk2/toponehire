import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrate() {
  try {
    // Create the jobs table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "jobs" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "employer" TEXT NOT NULL,
        "product" TEXT,
        "jobDescription" TEXT NOT NULL,
        "jobType" TEXT NOT NULL,
        "categories" TEXT NOT NULL,
        "location" TEXT NOT NULL DEFAULT 'Onsite',
        "salaryFrom" TEXT,
        "salaryTo" TEXT,
        "salaryFrequency" TEXT DEFAULT 'yearly',
        "howToApply" TEXT NOT NULL DEFAULT 'email',
        "applyValue" TEXT,
        "featured" BOOLEAN NOT NULL DEFAULT false,
        "status" TEXT NOT NULL DEFAULT 'Active',
        "views" INTEGER NOT NULL DEFAULT 0,
        "applications" INTEGER NOT NULL DEFAULT 0,
        "postedBy" TEXT NOT NULL DEFAULT 'Admin',
        "postingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "expirationDate" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
      );
    `);

    console.log('✅ Jobs table created successfully!');
  } catch (error) {
    console.error('❌ Error creating jobs table:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
