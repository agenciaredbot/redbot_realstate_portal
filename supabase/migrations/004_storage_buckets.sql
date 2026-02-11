-- =====================================================
-- MIGRATION: Storage Buckets for Property Images
-- =====================================================
-- Run this in Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. Create the property-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public can view property images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own property images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own property images" ON storage.objects;

-- 3. Create Storage Policies for property-images bucket

-- Allow anyone to view images (public bucket)
CREATE POLICY "Public can view property images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload property images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images');

-- Allow authenticated users to update images
CREATE POLICY "Users can update own property images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'property-images');

-- Allow authenticated users to delete images
CREATE POLICY "Users can delete own property images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'property-images');

-- =====================================================
-- VERIFICATION: Run this to check if bucket was created
-- =====================================================
-- SELECT * FROM storage.buckets WHERE id = 'property-images';
-- =====================================================
