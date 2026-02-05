# Registration Setup Guide

## Overview
This guide explains how to set up employer and job seeker registration with database storage and logo uploads.

## Database Tables

### 1. Run Migrations

Create the database tables by running:

```bash
npm run migrate:users
```

Or manually run the SQL in Supabase SQL Editor (see `scripts/migrate-employers-jobseekers.ts` for the SQL).

### 2. Database Schema

#### Employers Table
- `id` (Primary Key)
- `email` (Unique)
- `fullName`
- `phone`
- `location`
- `password` (Hashed)
- `companyName`
- `website`
- `logoUrl` (URL to uploaded logo)
- `companyDescription` (Rich text)
- `createdAt`, `updatedAt`

#### Job Seekers Table
- `id` (Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `firstName`
- `lastName`
- `phone` (Optional)
- `location` (Optional)
- `createdAt`, `updatedAt`

## Supabase Storage Setup

### Step 1: Create Storage Bucket

Run the SQL in `supabase-storage-setup.sql` in your Supabase SQL Editor:

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `supabase-storage-setup.sql`
3. Click "Run"

This will:
- Create a `logos` bucket
- Set up policies for public read access
- Allow authenticated users to upload logos
- Set file size limit to 5MB
- Allow only image file types (JPEG, PNG, GIF, WebP)

### Step 2: Get Your Storage URL

Your Supabase Storage URL format:
```
https://[YOUR-PROJECT-REF].supabase.co/storage/v1/object/public/logos/[filename]
```

Example:
```
https://spjqigsauxtsozponpww.supabase.co/storage/v1/object/public/logos/logos/1234567890-abc123.jpg
```

## API Routes

### Employer Registration
- **POST** `/api/employers/register`
- **Body**: `{ email, fullName, phone, location, password, companyName, website, logoUrl, companyDescription }`
- **Response**: `{ success: true, employer: {...} }`

### Job Seeker Registration
- **POST** `/api/job-seekers/register`
- **Body**: `{ email, password, firstName, lastName, phone?, location? }`
- **Response**: `{ success: true, jobSeeker: {...} }`

### Logo Upload
- **POST** `/api/upload/logo`
- **Body**: FormData with `file` field
- **Response**: `{ success: true, url: "...", fileName: "..." }`

## Frontend Forms

### Employer Registration (`/registration/employer`)
- Collects all employer information
- Uploads logo to Supabase Storage
- Saves employer data to database
- Shows loading state during submission
- Displays error messages if registration fails

### Job Seeker Registration (`/registration/job-seeker`)
- Collects job seeker information
- Saves job seeker data to database
- Shows loading state during submission
- Displays error messages if registration fails

## Next Steps

1. **Install Supabase Client** (if not already installed):
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Update Upload Route** (`app/api/upload/logo/route.ts`):
   - Configure Supabase client with your project URL and anon key
   - Implement actual file upload to Supabase Storage

3. **Add Environment Variables** (`.env`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Test Registration**:
   - Try registering an employer with logo upload
   - Try registering a job seeker
   - Verify data appears in Supabase tables

## Security Notes

- Passwords are hashed using bcrypt before storage
- Email addresses are unique (prevents duplicate accounts)
- File uploads are validated (type and size)
- Storage policies control access to uploaded files
