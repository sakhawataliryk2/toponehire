# Resume Creation System Setup

## Overview
The resume creation system allows job seekers to create and manage their resumes with work experience and education details.

## Database Migration

### Option 1: Run SQL directly in Supabase
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `prisma/migrations/20240205000000_add_resume_table/migration.sql`
4. Execute the SQL

### Option 2: Use Prisma Migrate
```bash
npx prisma migrate deploy
```

### Option 3: Manual SQL Execution
The SQL file is located at: `prisma/migrations/20240205000000_add_resume_table/migration.sql`

## Features Implemented

### 1. Resume Creation Page
- **Route**: `/add-listing?listing_type_id=Resume`
- **Access**: Only accessible when logged in as a job seeker
- **Features**:
  - Upload resume file (PDF/DOC/DOCX)
  - Desired Job Title
  - Job Type selection
  - Categories selection
  - Personal Summary (Rich Text Editor)
  - Location and Phone
  - "Let Employers Find My Resume" checkbox
  - Multiple Work Experience entries (with Add/Remove)
  - Multiple Education entries (with Add/Remove)

### 2. API Routes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes?jobSeekerId=xxx` - Get all resumes for a job seeker
- `GET /api/resumes/[id]` - Get single resume
- `PUT /api/resumes/[id]` - Update resume
- `DELETE /api/resumes/[id]` - Delete resume

### 3. Database Schema
The `resumes` table includes:
- Basic information (desiredJobTitle, jobType, categories, personalSummary, location, phone)
- Resume file URL (stored in Supabase Storage)
- Work Experience (stored as JSON)
- Education (stored as JSON)
- Foreign key relationship to `job_seekers` table

## Usage

1. **For Job Seekers**:
   - Log in as a job seeker
   - Click "Create/Post Your Resume" in the header
   - Fill out the form
   - Upload resume file (optional)
   - Add work experience and education entries
   - Click "POST" to save

2. **File Upload**:
   - Resume files are uploaded to Supabase Storage in the `resumes` folder
   - Supported formats: PDF, DOC, DOCX

## File Upload Setup (Optional)

To enable resume file uploads to Supabase Storage:

1. Install Supabase client:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Add environment variables to `.env`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Create a `resumes` bucket in Supabase Storage:
   - Go to Storage in Supabase dashboard
   - Create a new bucket named `resumes`
   - Set it to public or configure RLS policies

4. Update `app/api/upload/route.ts` to use Supabase client (see TODO comment in the file)

## Next Steps

After running the migration:
1. Restart your development server if needed
2. Test the resume creation flow
3. Verify data is being saved correctly in the database
4. (Optional) Set up file uploads if you want resume file storage

## Troubleshooting

If you encounter issues:
1. Make sure the migration has been run successfully
2. Check that the `job_seekers` table exists
3. Verify Supabase Storage bucket is configured for resume uploads
4. Check browser console for any errors
