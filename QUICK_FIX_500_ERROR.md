# 🚨 QUICK FIX: 500 Error on Resume Creation

## The Problem
The error occurs because the `resumes` table doesn't exist in your database yet.

## ⚡ FASTEST FIX (2 minutes)

### Step 1: Open Supabase
1. Go to https://supabase.com
2. Open your project
3. Click **SQL Editor** (left sidebar)

### Step 2: Copy & Paste This SQL
Click **New Query**, then paste this entire block:

```sql
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

ALTER TABLE "resumes" ADD CONSTRAINT "resumes_jobSeekerId_fkey" 
FOREIGN KEY ("jobSeekerId") REFERENCES "job_seekers"("id") 
ON DELETE CASCADE ON UPDATE CASCADE;
```

### Step 3: Run It
Click **Run** button (or press `Ctrl+Enter`)

### Step 4: Restart Server
1. Stop your dev server (press `Ctrl+C` in terminal)
2. Run: `npm run dev`

## ✅ Done!
The error should be fixed. Try creating a resume again.

---

## Alternative: If You Get "Table Already Exists" Error

If the table exists but is missing columns, run this instead:

```sql
ALTER TABLE "resumes" ADD COLUMN IF NOT EXISTS "views" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "resumes" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'Active';
```
