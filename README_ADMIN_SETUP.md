# Admin Panel Setup Guide

## Prisma & Database Setup

### 1. Environment Variables

The `.env` file has been configured with Supabase connection strings:
- `DATABASE_URL`: Connection pooling URL
- `DIRECT_URL`: Direct connection URL for migrations

### 2. Database Migration

Run the migration to create the admin table:

```bash
# Generate Prisma Client
npm run prisma:generate

# Create the admin table (if not exists)
# You can run the SQL directly in Supabase SQL Editor or use:
npx prisma migrate deploy
```

Or manually run this SQL in Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS "admins" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("id")
);
```

### 3. Create Default Admin User

Run the script to create the default admin user:

```bash
npm run create-admin
```

Default credentials:
- **Username**: `admin`
- **Email**: `admin@toponehire.com`
- **Password**: `admin123`

### 4. Start Development Server

```bash
npm run dev
```

### 5. Access Admin Panel

- Login: http://localhost:3000/admin/login
- Dashboard: http://localhost:3000/admin/dashboard

## Admin Routes

- `/admin/login` - Admin login page
- `/admin/dashboard` - Admin dashboard
- `/admin/job-board` - Job board management
- `/admin/reports` - Reports
- `/admin/listing-fields` - Listing fields management
- `/admin/settings` - Settings

## API Routes

- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/create-admin` - Create new admin user

## Database Schema

The `Admin` model includes:
- `id` (String, Primary Key)
- `username` (String, Unique)
- `email` (String, Unique)
- `password` (String, Hashed)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
