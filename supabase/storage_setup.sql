-- 1. Create a bucket for village assets (Public bucket)
INSERT INTO storage.buckets (id, name, public)
VALUES ('village-assets', 'village-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Clear existing policies to avoid "already exists" error
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admins can list and view objects" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update and delete files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete files" ON storage.objects;

-- 3. Allow only authenticated users (Admins) to SELECT/list files
CREATE POLICY "Admins can list and view objects"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'village-assets' );

-- 4. Allow authenticated users (Admins) to upload files
CREATE POLICY "Admins can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'village-assets' );

-- 5. Allow admins to update files
CREATE POLICY "Admins can update and delete files"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'village-assets' );

-- 6. Allow admins to delete files
CREATE POLICY "Admins can delete files"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'village-assets' );
