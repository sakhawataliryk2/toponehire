# Resume Table Migration Instructions

## Quick Setup

### Step 1: Run the Database Migration

You have three options to create the `resumes` table:

#### Option A: Using Supabase SQL Editor (Recommended)
1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `prisma/migrations/20260209205150_add_resume_table/migration.sql`
5. Paste into the SQL editor
6. Click **Run** or press `Ctrl+Enter`

#### Option B: Using Prisma Migrate
```bash
npx prisma migrate deploy
```

#### Option C: Using psql command line
```bash
psql $DATABASE_URL -f prisma/migrations/20260209205150_add_resume_table/migration.sql
```

### Step 2: Generate Prisma Client
After running the migration, generate the Prisma client:
```bash
npx prisma generate
```

**Note**: If you get a file lock error, stop your dev server first, then run the command.

### Step 3: Verify the Migration
Check that the table was created:
```sql
SELECT * FROM resumes LIMIT 1;
```

## What Gets Created

The migration creates:
- `resumes` table with all required fields
- Foreign key relationship to `job_seekers` table
- Proper indexes and constraints

## Testing

After migration:
1. Start your dev server: `npm run dev`
2. Log in as a job seeker
3. Navigate to "Create/Post Your Resume" in the header
4. Fill out the form and submit
5. Check Supabase dashboard to verify data was saved

## Troubleshooting

### Error: Table already exists
If you see "relation already exists", the table was already created. You can skip the migration.

### Error: Foreign key constraint fails
Make sure the `job_seekers` table exists. If not, run the job seekers migration first.

### Error: Permission denied
Make sure your database user has CREATE TABLE permissions.

## Next Steps

Once the migration is complete:
- ✅ Resume creation page is ready at `/add-listing?listing_type_id=Resume`
- ✅ API routes are configured
- ✅ File upload is configured for Supabase Storage
- ✅ All form fields are functional

You're all set! 🎉
