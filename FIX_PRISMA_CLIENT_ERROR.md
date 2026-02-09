# Fix: "Cannot read properties of undefined (reading 'create')" Error

## The Problem
The Prisma client hasn't been regenerated after adding the Resume model. The dev server has the old client cached.

## Solution (3 steps)

### Step 1: Stop Your Dev Server
1. Go to the terminal where `npm run dev` is running
2. Press `Ctrl+C` to stop it
3. Wait for it to fully stop

### Step 2: Regenerate Prisma Client
Run this command:
```bash
npx prisma generate
```

### Step 3: Restart Dev Server
```bash
npm run dev
```

## Also Make Sure Database Table Exists

If you still get errors, make sure the `resumes` table exists:

1. Go to Supabase SQL Editor
2. Run the SQL from `FIX_500_ERROR_NOW.sql` or `CREATE_RESUMES_TABLE.sql`
3. Restart the dev server again

## That's It!
After regenerating Prisma client, the error should be fixed.
