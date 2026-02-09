# IMPORTANT: Run Database Migration

## The Error You're Seeing

The 500 error is happening because the `resumes` table doesn't exist in your database yet. You need to run the migration SQL.

## Quick Fix

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run the Migration SQL
Copy and paste this entire SQL into the editor:

```sql
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
```

### Step 3: Execute
Click **Run** or press `Ctrl+Enter` (or `Cmd+Enter` on Mac)

### Step 4: Verify
After running, you should see "Success. No rows returned" or similar.

### Step 5: Restart Dev Server
Stop your dev server (Ctrl+C) and restart it:
```bash
npm run dev
```

## Alternative: If Table Already Exists

If you get an error saying the table already exists, you can add the missing columns:

```sql
-- Add views column if it doesn't exist
ALTER TABLE "resumes" ADD COLUMN IF NOT EXISTS "views" INTEGER NOT NULL DEFAULT 0;

-- Add status column if it doesn't exist
ALTER TABLE "resumes" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'Active';
```

## After Migration

Once the migration is complete:
1. The API routes will work
2. You can create resumes
3. The "My Resumes" page will display your resumes

The error should be resolved! 🎉
