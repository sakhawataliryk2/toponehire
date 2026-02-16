-- CreateTable: saved_jobs for job seeker saved jobs feature.
-- If "prisma migrate dev" fails (e.g. shadow DB issues), run: npm run prisma:push
CREATE TABLE IF NOT EXISTS "saved_jobs" (
    "id" TEXT NOT NULL,
    "jobSeekerId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_jobs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "saved_jobs_jobSeekerId_jobId_key" ON "saved_jobs"("jobSeekerId", "jobId");
