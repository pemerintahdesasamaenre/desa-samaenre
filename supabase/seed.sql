-- Comprehensive Seed Data
-- This script provides a baseline of data for development and testing.

-- TRUNCATE all tables to ensure a clean slate.
-- Using CASCADE to automatically handle foreign key dependencies.
TRUNCATE public.posts, public.finances, public.staff_members, public.demographics, public.categories RESTART IDENTITY CASCADE;

-- 1. CATEGORIES
INSERT INTO public.categories (id, name, slug, type, description) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Berita Desa', 'berita-desa', 'post', 'Informasi dan berita terbaru seputar desa.'),
('b2c3d4e5-f6a7-8901-2345-67890abcdef0', 'Agenda Kegiatan', 'agenda-kegiatan', 'post', 'Jadwal dan informasi kegiatan yang akan datang.'),
('c3d4e5f6-a7b8-9012-3456-7890abcdef01', 'Populasi', 'populasi', 'demographic', 'Data kependudukan.'),
('d4e5f6a7-b8c9-0123-4567-890abcdef012', 'Pendidikan', 'pendidikan', 'demographic', 'Data tingkat pendidikan warga.'),
('e5f6a7b8-c9d0-1234-5678-90abcdef0123', 'Pekerjaan', 'pekerjaan', 'demographic', 'Data mata pencaharian warga.');

-- 2. VILLAGE INFO
-- Using UPSERT to initialize the singleton row for village info.
INSERT INTO public.village_info (id, name, vision, mission, history, contact_info, location) VALUES
(1, 'Desa Maju Jaya', 'Menjadi desa yang mandiri, sejahtera, dan berbudaya berlandaskan gotong royong.', '["Meningkatkan kualitas SDM", "Mengembangkan potensi ekonomi lokal", "Meningkatkan kualitas infrastruktur"]', 'Desa Maju Jaya didirikan pada tahun 1980 oleh para transmigran dari berbagai daerah...', '{"email": "kontak@majujaya.desa.id", "phone": "081234567890", "address": "Jl. Raya Desa No. 1, Kec. Sejahtera, Kab. Makmur", "maps_url": "https://maps.google.com"}', '{"lat": -6.200000, "lng": 106.816666}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  vision = EXCLUDED.vision,
  mission = EXCLUDED.mission,
  history = EXCLUDED.history,
  contact_info = EXCLUDED.contact_info,
  location = EXCLUDED.location,
  updated_at = NOW();

-- 3. STAFF MEMBERS
-- Create a hierarchical structure.
-- UUIDs are hardcoded to maintain relationships.
-- Top Level: Kepala Desa
INSERT INTO public.staff_members (id, name, position, order_index, parent_id) VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Ahmad Subarjo', 'Kepala Desa', 0, NULL);
-- Second Level: Sekretaris & Kepala Urusan, reporting to Kepala Desa
INSERT INTO public.staff_members (id, name, position, order_index, parent_id) VALUES 
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Siti Aminah', 'Sekretaris Desa', 1, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Budi Santoso', 'Kaur Pemerintahan', 2, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Dewi Lestari', 'Kaur Keuangan', 3, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
-- Third Level: Staff, reporting to Kaur
INSERT INTO public.staff_members (id, name, position, order_index, parent_id) VALUES 
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Eko Prasetyo', 'Staf Pelayanan', 0, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13');


-- 4. DEMOGRAPHICS
INSERT INTO public.demographics (category_id, label, value) VALUES
('c3d4e5f6-a7b8-9012-3456-7890abcdef01', 'Total Populasi', 2500),
('c3d4e5f6-a7b8-9012-3456-7890abcdef01', 'Laki-laki', 1200),
('c3d4e5f6-a7b8-9012-3456-7890abcdef01', 'Perempuan', 1300),
('d4e5f6a7-b8c9-0123-4567-890abcdef012', 'Lulusan SD', 800),
('d4e5f6a7-b8c9-0123-4567-890abcdef012', 'Lulusan SMP', 600),
('d4e5f6a7-b8c9-0123-4567-890abcdef012', 'Lulusan SMA', 500),
('e5f6a7b8-c9d0-1234-5678-90abcdef0123', 'Petani', 700),
('e5f6a7b8-c9d0-1234-5678-90abcdef0123', 'Wiraswasta', 300);

-- 5. POSTS
INSERT INTO public.posts (title, slug, content, category_id, type, status) VALUES
('Kerja Bakti Membersihkan Sungai', 'kerja-bakti-sungai', 'Warga Desa Maju Jaya akan mengadakan kerja bakti pembersihan sungai pada hari Minggu...', 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 'news', 'published'),
('Rapat RT Bahas Keamanan Lingkungan', 'rapat-rt-keamanan', 'Diundang seluruh warga RT 01 untuk hadir dalam rapat koordinasi keamanan lingkungan.', 'b2c3d4e5-f6a7-8901-2345-67890abcdef0', 'agenda', 'published'),
('Pelatihan UMKM Desa (Draft)', 'pelatihan-umkm-draft', 'Konten draft untuk pelatihan UMKM...', 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 'news', 'draft');

-- 6. FINANCES
INSERT INTO public.finances (year, type, category_name, amount) VALUES
(2024, 'income', 'Dana Desa (DDS)', 800000000),
(2024, 'income', 'Pendapatan Asli Desa (PAD)', 50000000),
(2024, 'expense', 'Pembangunan Infrastruktur', 400000000),
(2024, 'expense', 'Operasional Kantor Desa', 150000000),
(2024, 'financing', 'Sisa Lebih Perhitungan Anggaran (SiLPA) Tahun Lalu', 10000000);

-- End of seed data.
