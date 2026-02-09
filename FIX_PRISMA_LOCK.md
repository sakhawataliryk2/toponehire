# Fix Prisma File Lock Error

## The Error
```
EPERM: operation not permitted, rename '...query_engine-windows.dll.node'
```

This happens because the dev server (or another process) has the Prisma client file locked.

## Solution

### Option 1: Stop All Node Processes (Recommended)

1. **Find and stop the dev server:**
   - Look for the terminal running `npm run dev`
   - Press `Ctrl+C` to stop it
   - Wait 5-10 seconds

2. **Kill any remaining Node processes:**
   ```powershell
   Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
   ```

3. **Now regenerate Prisma:**
   ```powershell
   npx prisma generate
   ```

### Option 2: Delete the Locked File Manually

1. **Stop the dev server** (Ctrl+C)

2. **Delete the Prisma client folder:**
   ```powershell
   Remove-Item -Path "node_modules\.prisma" -Recurse -Force -ErrorAction SilentlyContinue
   ```

3. **Regenerate:**
   ```powershell
   npx prisma generate
   ```

### Option 3: Restart Your Computer
If nothing else works, restart your computer, then run:
```powershell
npx prisma generate
```

## After Regenerating

1. **Make sure the database table exists** (run SQL from `FIX_500_ERROR_NOW.sql` in Supabase)
2. **Restart dev server:**
   ```powershell
   npm run dev
   ```

## Quick Command (Copy & Paste)

```powershell
# Stop all Node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Wait a moment
Start-Sleep -Seconds 2

# Regenerate Prisma
npx prisma generate
```
