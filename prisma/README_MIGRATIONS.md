# Prisma migrations and schema sync

## If `prisma migrate dev` fails (shadow DB / migration history)

When you see errors like **"Migration failed to apply cleanly to the shadow database"** or **"The underlying table for model X does not exist"**, you can sync the schema without using the migration history:

```bash
npm run prisma:push
# or
npx prisma db push
```

This will:

- Create any **missing tables** (e.g. `saved_jobs`) and update columns to match `prisma/schema.prisma`.
- **Not** use the migrations folder or shadow DB, so it avoids migration history issues.

Use this for local/dev when migrations are broken. For production, fix migration history or run the SQL in `migrations/20260215000000_add_saved_jobs/migration.sql` manually if you only need the `saved_jobs` table.

After pushing, run:

```bash
npx prisma generate
```

so the Prisma client matches the schema.
