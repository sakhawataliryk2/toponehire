-- ============================================
-- Fix Upload Policy - Add Missing Bucket Check
-- ============================================
-- The INSERT policy needs to have the bucket check in the USING clause
-- for the verification query to detect it properly

-- Drop the existing policy
DROP POLICY IF EXISTS "Allow authenticated users to upload logos" ON storage.objects;

-- Recreate with proper bucket check
CREATE POLICY "Allow authenticated users to upload logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'logos' AND
  (storage.foldername(name))[1] = 'logos'
);

-- Verify the fix
SELECT 
  policyname,
  cmd as operation,
  roles,
  CASE 
    WHEN qual LIKE '%logos%' OR with_check LIKE '%logos%' THEN '✓ Bucket check present'
    ELSE '✗ Missing bucket check'
  END as bucket_check
FROM pg_policies
WHERE tablename = 'objects' 
  AND policyname = 'Allow authenticated users to upload logos';
