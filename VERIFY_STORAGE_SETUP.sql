-- ============================================
-- Verify Storage Bucket and Policies Setup
-- ============================================
-- Run these queries to verify everything is set up correctly

-- 1. Check if the logos bucket exists
SELECT * FROM storage.buckets WHERE id = 'logos';

-- 2. Check all policies for the logos bucket
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects' 
  AND policyname LIKE '%logo%'
ORDER BY policyname;

-- 3. List all storage buckets
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets;

-- 4. Check if policies are correctly applied
SELECT 
  p.policyname,
  p.cmd as operation,
  p.roles,
  CASE 
    WHEN p.cmd = 'INSERT' THEN
      CASE 
        WHEN p.with_check LIKE '%logos%' THEN '✓ Bucket check present'
        ELSE '✗ Missing bucket check'
      END
    ELSE
      CASE 
        WHEN p.qual LIKE '%logos%' OR p.with_check LIKE '%logos%' THEN '✓ Bucket check present'
        ELSE '✗ Missing bucket check'
      END
  END as bucket_check
FROM pg_policies p
WHERE p.tablename = 'objects' 
  AND p.policyname LIKE '%logo%';

-- Expected Results:
-- 1. Should return 1 row with bucket 'logos' (public: true, file_size_limit: 5242880)
-- 2. Should return 4 policies:
--    - Allow authenticated users to upload logos (INSERT)
--    - Allow public read access to logos (SELECT)
--    - Allow users to update their own logos (UPDATE)
--    - Allow users to delete their own logos (DELETE)
-- 3. Should show the logos bucket in the list
-- 4. All policies should have bucket check present
