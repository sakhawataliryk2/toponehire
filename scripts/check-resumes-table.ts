import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkResumesTable() {
  try {
    // Try to query the resumes table
    const count = await prisma.resume.count();
    console.log('✅ Resumes table exists! Current count:', count);
    return true;
  } catch (error: any) {
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      console.error('❌ Resumes table does NOT exist!');
      console.error('Error:', error.message);
      console.log('\n📋 Please run this SQL in Supabase SQL Editor:');
      console.log('===========================================');
      console.log(`
-- CreateTable
CREATE TABLE IF NOT EXISTS "resumes" (
    "id" TEXT NOT NULL,
    "jobSeekerId" TEXT NOT NULL,
    "resumeFileUrl" TEXT,
    "desiredJobTitle" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "categories" TEXT NOT NULL,
    "personalSummary" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "letEmployersFind" BOOLEAN NOT NULL DEFAULT true,
    "workExperience" TEXT,
    "education" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_jobSeekerId_fkey" FOREIGN KEY ("jobSeekerId") REFERENCES "job_seekers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      `);
      console.log('===========================================');
      return false;
    } else {
      console.error('❌ Unexpected error:', error);
      return false;
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkResumesTable();
