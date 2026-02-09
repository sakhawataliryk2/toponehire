-- ============================================
-- CREATE RESUMES TABLE - RUN THIS IN SUPABASE SQL EDITOR
-- ============================================
-- Copy and paste this entire file into Supabase SQL Editor and click Run
-- ============================================

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

-- Verify table was created
SELECT 'Resumes table created successfully!' as message;
