-- CreateTable: job_alerts for admin job alerts management
CREATE TABLE IF NOT EXISTS "job_alerts" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "keywords" TEXT,
    "location" TEXT,
    "frequency" TEXT NOT NULL DEFAULT 'Daily',
    "lastSentAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_alerts_pkey" PRIMARY KEY ("id")
);
