-- ============================================
-- Supabase Storage Bucket and Policy Setup
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- This creates a storage bucket for employer logos

-- Step 1: Create the storage bucket for logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'logos',
  'logos',
  true, -- Public bucket (logos can be accessed via URL)
  5242880, -- 5MB file size limit (in bytes)
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Create policy to allow authenticated users to upload logos
CREATE POLICY "Allow authenticated users to upload logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'logos' AND
  (storage.foldername(name))[1] = 'logos'
);

-- Step 3: Create policy to allow public read access to logos
CREATE POLICY "Allow public read access to logos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'logos');

-- Step 4: Create policy to allow users to update their own logos
CREATE POLICY "Allow users to update their own logos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'logos' AND
  (storage.foldername(name))[1] = 'logos'
)
WITH CHECK (
  bucket_id = 'logos' AND
  (storage.foldername(name))[1] = 'logos'
);

-- Step 5: Create policy to allow users to delete their own logos
CREATE POLICY "Allow users to delete their own logos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'logos' AND
  (storage.foldername(name))[1] = 'logos'
);

-- ============================================
-- Alternative: More restrictive policies
-- ============================================
-- If you want to restrict uploads to only authenticated users
-- and ensure users can only manage their own files:

-- Drop existing policies if you want to recreate them
-- DROP POLICY IF EXISTS "Allow authenticated users to upload logos" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow public read access to logos" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow users to update their own logos" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow users to delete their own logos" ON storage.objects;

-- More restrictive upload policy (only authenticated users)
-- CREATE POLICY "Authenticated users can upload logos"
-- ON storage.objects
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   bucket_id = 'logos' AND
--   (storage.foldername(name))[1] = 'logos' AND
--   auth.uid()::text = (storage.foldername(name))[2] -- User ID in folder path
-- );

-- ============================================
-- Verify the bucket was created
-- ============================================
-- Run this query to verify:
-- SELECT * FROM storage.buckets WHERE id = 'logos';

-- ============================================
-- Get your Supabase Storage URL
-- ============================================
-- Your storage URL will be:
-- https://[YOUR-PROJECT-REF].supabase.co/storage/v1/object/public/logos/[filename]
-- 
-- Example:
-- https://spjqigsauxtsozponpww.supabase.co/storage/v1/object/public/logos/logos/1234567890-abc123.jpg
