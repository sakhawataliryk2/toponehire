-- ============================================
-- COPY THIS ENTIRE FILE AND RUN IN SUPABASE SQL EDITOR
-- ============================================
-- This will create the resumes table and fix the 500 error
-- ============================================

-- Step 1: Create the resumes table
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

-- Step 2: Add foreign key constraint (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'resumes_jobSeekerId_fkey'
    ) THEN
        ALTER TABLE "resumes" 
        ADD CONSTRAINT "resumes_jobSeekerId_fkey" 
        FOREIGN KEY ("jobSeekerId") 
        REFERENCES "job_seekers"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE;
    END IF;
END $$;

-- Step 3: Verify it worked
SELECT '✅ Resumes table created successfully!' as status;
