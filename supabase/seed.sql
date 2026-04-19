-- Consolidated Seed Data (Method: UPSERT)
-- This script initializes or updates the database with baseline data.

-- 1. UPSERT CATEGORIES
INSERT INTO public.categories (id, name, slug, type, description) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Berita Desa', 'berita-desa', 'post', 'Informasi dan berita terbaru seputar desa.'),
('b2c3d4e5-f6a7-8901-2345-67890abcdef0', 'Agenda Kegiatan', 'agenda-kegiatan', 'post', 'Jadwal dan informasi kegiatan yang akan datang.'),
('c3d4e5f6-a7b8-9012-3456-7890abcdef01', 'Populasi', 'populasi', 'demographic', 'Data kependudukan utama.'),
('d4e5f6a7-b8c9-0123-4567-890abcdef012', 'Pendidikan', 'pendidikan', 'demographic', 'Tingkat pendidikan warga.'),
('e5f6a7b8-c9d0-1234-5678-90abcdef0123', 'Pekerjaan', 'pekerjaan', 'demographic', 'Mata pencaharian warga.'),
('f6a7b8c9-d0e1-2345-6789-0123456789ab', 'Dusun', 'dusun', 'demographic', 'Wilayah administratif dusun.'),
('01234567-89ab-cdef-0123-456789abcdef', 'Kelompok Usia', 'kelompok-usia', 'demographic', 'Distribusi penduduk berdasarkan umur.'),
('12345678-90ab-cdef-1234-567890abcdef', 'Status Perkawinan', 'status-perkawinan', 'demographic', 'Data status pernikahan warga.')
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 2. UPSERT VILLAGE INFO
INSERT INTO public.village_info (id, name, vision, mission, history, area_size, boundaries, contact_info) VALUES
(1, 'Samaenre', 
 'Menjadi desa digital yang mandiri, sejahtera, dan berbudaya.', 
 '["Meningkatkan layanan publik berbasis teknologi", "Membangun infrastruktur desa yang berkelanjutan", "Memberdayakan ekonomi kreatif warga", "Melestarikan nilai gotong royong dan budaya lokal"]', 
 'Desa Samaenre memiliki sejarah panjang sebagai pusat pertanian di wilayah Mallawa. Berdiri sejak masa kolonial, desa ini terus berkembang menjadi wilayah yang adaptif terhadap teknologi...', 
 '15.45 km²', 
 '{"north": "Desa Mallawa", "south": "Kecamatan Camba", "east": "Kabupaten Bone", "west": "Hutan Lindung"}',
 '{"email": "kontak@samaenre.desa.id", "phone": "6281234567890", "address": "Jl. Poros Maros-Bone KM. 50, Kec. Mallawa, Kab. Maros", "maps_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63614.623466179924!2d119.79991164855173!3d-4.784787768717349!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbe69042aecc4fb%3A0xef615dd54a9f5b1c!2sSamaenre%2C%20Mallawa%2C%20Maros%20Regency%2C%20South%20Sulawesi!5e0!3m2!1sen!2sid!4v1776570115024!5m2!1sen!2sid"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  vision = EXCLUDED.vision,
  mission = EXCLUDED.mission,
  history = EXCLUDED.history,
  area_size = EXCLUDED.area_size,
  boundaries = EXCLUDED.boundaries,
  contact_info = EXCLUDED.contact_info;

-- 3. UPSERT STAFF MEMBERS
INSERT INTO public.staff_members (id, name, position, order_index, parent_id) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Ahmad Subarjo', 'Kepala Desa', 0, NULL),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Siti Aminah', 'Sekretaris Desa', 1, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Budi Santoso', 'Kaur Pemerintahan', 2, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Dewi Lestari', 'Kaur Keuangan', 3, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Eko Prasetyo', 'Staf Pelayanan', 0, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  order_index = EXCLUDED.order_index,
  parent_id = EXCLUDED.parent_id;

-- 4. UPSERT DEMOGRAPHICS
INSERT INTO public.demographics (category_id, label, value) VALUES
-- Populasi
('c3d4e5f6-a7b8-9012-3456-7890abcdef01', 'Total Penduduk', 4520),
('c3d4e5f6-a7b8-9012-3456-7890abcdef01', 'Kepala Keluarga', 1240),
('c3d4e5f6-a7b8-9012-3456-7890abcdef01', 'Laki-laki', 2280),
('c3d4e5f6-a7b8-9012-3456-7890abcdef01', 'Perempuan', 2240),
-- Dusun
('f6a7b8c9-d0e1-2345-6789-0123456789ab', 'Dusun I', 1200),
('f6a7b8c9-d0e1-2345-6789-0123456789ab', 'Dusun II', 1150),
('f6a7b8c9-d0e1-2345-6789-0123456789ab', 'Dusun III', 1080),
('f6a7b8c9-d0e1-2345-6789-0123456789ab', 'Dusun IV', 1090),
-- Pendidikan
('d4e5f6a7-b8c9-0123-4567-890abcdef012', 'SD / Sederajat', 850),
('d4e5f6a7-b8c9-0123-4567-890abcdef012', 'SMP / Sederajat', 1200),
('d4e5f6a7-b8c9-0123-4567-890abcdef012', 'SMA / Sederajat', 1500),
('d4e5f6a7-b8c9-0123-4567-890abcdef012', 'Diploma / Sarjana', 420),
-- Pekerjaan
('e5f6a7b8-c9d0-1234-5678-90abcdef0123', 'Petani / Pekebun', 1800),
('e5f6a7b8-c9d0-1234-5678-90abcdef0123', 'Wiraswasta', 520),
('e5f6a7b8-c9d0-1234-5678-90abcdef0123', 'Buruh Harian Lepas', 410),
('e5f6a7b8-c9d0-1234-5678-90abcdef0123', 'Karyawan Swasta', 380),
('e5f6a7b8-c9d0-1234-5678-90abcdef0123', 'PNS / TNI / POLRI', 120),
-- Kelompok Usia
('01234567-89ab-cdef-0123-456789abcdef', 'Balita (0-5)', 320),
('01234567-89ab-cdef-0123-456789abcdef', 'Anak (6-12)', 450),
('01234567-89ab-cdef-0123-456789abcdef', 'Remaja (13-18)', 680),
('01234567-89ab-cdef-0123-456789abcdef', 'Dewasa (19-59)', 2500),
('01234567-89ab-cdef-0123-456789abcdef', 'Lansia (60+)', 570),
-- Status Perkawinan
('12345678-90ab-cdef-1234-567890abcdef', 'Belum Kawin', 1500),
('12345678-90ab-cdef-1234-567890abcdef', 'Kawin', 2800),
('12345678-90ab-cdef-1234-567890abcdef', 'Cerai Hidup', 120),
('12345678-90ab-cdef-1234-567890abcdef', 'Cerai Mati', 100)
ON CONFLICT (category_id, label) DO UPDATE SET
  value = EXCLUDED.value;

-- 5. UPSERT POSTS
INSERT INTO public.posts (id, title, slug, content, category_id, type, status) VALUES
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Kerja Bakti Membersihkan Sungai', 'kerja-bakti-sungai', 'Warga Desa Samaenre akan mengadakan kerja bakti pembersihan sungai pada hari Minggu...', 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 'news', 'published'),
('g1eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'Rapat RT Bahas Keamanan Lingkungan', 'rapat-rt-keamanan', 'Diundang seluruh warga RT 01 untuk hadir dalam rapat koordinasi keamanan lingkungan.', 'b2c3d4e5-f6a7-8901-2345-67890abcdef0', 'agenda', 'published')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  status = EXCLUDED.status;

-- 6. UPSERT FINANCES
INSERT INTO public.finances (year, type, category_name, amount) VALUES
(2024, 'income', 'Dana Desa (DDS)', 800000000),
(2024, 'income', 'Pendapatan Asli Desa (PAD)', 50000000),
(2024, 'expense', 'Pembangunan Infrastruktur', 400000000),
(2024, 'expense', 'Operasional Kantor Desa', 150000000),
(2024, 'financing', 'Sisa Lebih Perhitungan Anggaran (SiLPA) Tahun Lalu', 10000000)
ON CONFLICT (id) DO UPDATE SET
  amount = EXCLUDED.amount;
