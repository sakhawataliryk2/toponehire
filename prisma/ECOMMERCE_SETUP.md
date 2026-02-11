# eCommerce setup (Prisma generate & migrate)

## EPERM fix: Prisma now uses a custom output folder

The Prisma client is generated to **`generated/prisma`** (not `node_modules/.prisma/client`). So **`prisma generate` no longer needs to overwrite a locked file** — you can run it even while the dev server is running.

Just run:

```bash
npm run ecommerce:setup
```

(or `npx prisma generate` then `npx prisma migrate deploy` then `npx prisma db seed`).

---

## If you still see `EPERM` (old setup)

**The Next.js dev server was using the Prisma client** in `node_modules`, so Windows locked that file. With the custom output above, this should no longer happen.

## Fix: run Prisma with the dev server stopped

1. **Stop the dev server first**  
   - Find the terminal where you ran `npm run dev` (you’ll see “next dev” or “Local: http://localhost:3000”).
   - Click that terminal, then press **Ctrl+C**.
   - Wait until the process exits and you get the command prompt back.
2. **Do not start the dev server again** until step 3 is done.

2. **Generate the Prisma client and apply migrations**  
   In the same (or a new) terminal, from the project root:

   ```bash
   npx prisma generate
   npx prisma migrate deploy
   npx prisma db seed
   ```

3. **Start the dev server again**

   ```bash
   npm run dev
   ```

## Optional: use Prisma to create the migration from schema

The eCommerce migration is already in `prisma/migrations/20260210000000_ecommerce/`.  
To have Prisma **create** migrations from `schema.prisma` in the future:

1. Stop the dev server (Ctrl+C).
2. Run:

   ```bash
   npx prisma migrate dev --name your_migration_name
   ```

   This will:
   - Compare `schema.prisma` to the database
   - Create a new migration file
   - Apply it
   - Run `prisma generate`

3. Start the dev server again: `npm run dev`.

## One-time eCommerce setup (after first deploy or new clone)

**Important:** If `npm run dev` is running in any terminal, stop it with **Ctrl+C** in that terminal first. Otherwise `prisma generate` will fail with EPERM.

From project root, with **no** dev server running:

```bash
npm run ecommerce:setup
```

This runs `prisma generate`, `prisma migrate deploy`, and `prisma db seed`.  
Or run them separately:

```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

Then start the app with `npm run dev`.

---

## Error P3005: "The database schema is not empty"

Your database already has tables from earlier migrations, but Prisma’s migration history wasn’t fully recorded. You need to **baseline** (mark existing migrations as applied), then deploy the ecommerce migration.

**One-time fix:** Run these in order (project root):

```bash
npx prisma migrate resolve --applied "init_admin"
npx prisma migrate resolve --applied "20240204000000_init_admin"
npx prisma migrate resolve --applied "20240205000000_add_resume_table"
npx prisma migrate resolve --applied "20260209205150_add_resume_table"
npx prisma migrate deploy
npx prisma db seed
```

If a migration is already recorded, you’ll see "already recorded as applied" — that’s fine. Then run `migrate deploy` and `db seed`.

Or run the script (outside Cursor if you prefer):  
`scripts\prisma-baseline-existing.cmd`

## Still getting EPERM? Run the setup **outside Cursor**

If Cursor or another process is still locking the file:

1. **Close Cursor completely** (File → Exit).
2. In **File Explorer** go to `D:\aviation\toponehire.com\scripts` and **double-click `ecommerce-setup-outside-ide.cmd`**.
   - Or open **Command Prompt** (Win+R → type `cmd` → Enter), then run:
     ```cmd
     cd /d D:\aviation\toponehire.com
     scripts\ecommerce-setup-outside-ide.cmd
     ```
3. When it finishes, reopen Cursor and run `npm run dev`.
