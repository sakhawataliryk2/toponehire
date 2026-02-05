-- ============================================
-- Create Employers and Job Seekers Tables
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- This creates the tables for storing employer and job seeker registration data

-- Step 1: Create the employers table
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
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "employers_pkey" PRIMARY KEY ("id")
);

-- Step 2: Create unique index on email for employers
CREATE UNIQUE INDEX IF NOT EXISTS "employers_email_key" ON "employers"("email");

-- Step 3: Create the job_seekers table
CREATE TABLE IF NOT EXISTS "job_seekers" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "phone" TEXT,
  "location" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "job_seekers_pkey" PRIMARY KEY ("id")
);

-- Step 4: Create unique index on email for job_seekers
CREATE UNIQUE INDEX IF NOT EXISTS "job_seekers_email_key" ON "job_seekers"("email");

-- Step 5: Create function to automatically update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Create triggers to auto-update updatedAt
DROP TRIGGER IF EXISTS update_employers_updated_at ON "employers";
CREATE TRIGGER update_employers_updated_at
  BEFORE UPDATE ON "employers"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_job_seekers_updated_at ON "job_seekers";
CREATE TRIGGER update_job_seekers_updated_at
  BEFORE UPDATE ON "job_seekers"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Verify tables were created
-- ============================================
-- Run these queries to verify:

-- Check if employers table exists
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'employers'
ORDER BY ordinal_position;

-- Check if job_seekers table exists
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'job_seekers'
ORDER BY ordinal_position;

-- Check indexes
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('employers', 'job_seekers');
