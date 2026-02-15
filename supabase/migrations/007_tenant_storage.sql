-- =====================================================
-- MIGRATION: Tenant Storage Bucket
-- Creates storage bucket for tenant assets (logos, etc.)
-- =====================================================

-- Create the tenant-assets bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tenant-assets',
  'tenant-assets',
  true,  -- Public bucket so logos can be displayed
  2097152,  -- 2MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for tenant-assets bucket
-- Allow authenticated users to upload to their tenant folder
CREATE POLICY "Authenticated users can upload tenant assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'tenant-assets'
);

-- Allow authenticated users to update their tenant assets
CREATE POLICY "Authenticated users can update tenant assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'tenant-assets');

-- Allow public read access to tenant assets
CREATE POLICY "Public read access for tenant assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'tenant-assets');

-- Allow authenticated users to delete their tenant assets
CREATE POLICY "Authenticated users can delete tenant assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'tenant-assets');
