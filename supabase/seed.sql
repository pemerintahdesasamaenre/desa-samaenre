-- SEED DATA UNTUK PROFIL DESA

-- 1. Insert Categories
INSERT INTO categories (name, slug, type) VALUES 
('Populasi', 'populasi', 'demographic'),
('Pendidikan', 'pendidikan', 'demographic'),
('Pekerjaan', 'pekerjaan', 'demographic'),
('Dusun', 'dusun', 'demographic'),
('Status Perkawinan', 'status-perkawinan', 'demographic'),
('Agama', 'agama', 'demographic');

-- 2. Insert Village Info (Ganti ID jika perlu, atau gunakan ID 1)
INSERT INTO village_info (id, name, vision, mission, history, contact_info) VALUES
(1, 'Desa Digital', 'Terwujudnya Desa yang Mandiri, Sejahtera, dan Berbudaya.', 
'["Meningkatkan pelayanan publik digital", "Mengembangkan ekonomi UMKM", "Membangun infrastruktur merata"]',
'Desa ini memiliki sejarah panjang sejak tahun...',
'{"email": "kontak@desadigital.go.id", "phone": "081234567890", "address": "Jl. Utama No. 01"}');

-- 3. Insert Initial Demographics (Contoh data dari diskusi sebelumnya)
DO $$
DECLARE
    cat_pop_id UUID;
    cat_dusun_id UUID;
    cat_job_id UUID;
BEGIN
    SELECT id INTO cat_pop_id FROM categories WHERE slug = 'populasi';
    SELECT id INTO cat_dusun_id FROM categories WHERE slug = 'dusun';
    SELECT id INTO cat_job_id FROM categories WHERE slug = 'pekerjaan';

    -- Populasi
    INSERT INTO demographics (category_id, label, value) VALUES 
    (cat_pop_id, 'Total Penduduk', 2025),
    (cat_pop_id, 'Kepala Keluarga', 659),
    (cat_pop_id, 'Laki-Laki', 1012),
    (cat_pop_id, 'Perempuan', 1013);

    -- Dusun
    INSERT INTO demographics (category_id, label, value) VALUES 
    (cat_dusun_id, 'Maddenge', 492),
    (cat_dusun_id, 'Satoa', 532),
    (cat_dusun_id, 'Ujung', 1001);

    -- Pekerjaan (Top 5)
    INSERT INTO demographics (category_id, label, value) VALUES 
    (cat_job_id, 'Mengurus Rumah Tangga', 475),
    (cat_job_id, 'Pelajar/Mahasiswa', 422),
    (cat_job_id, 'Belum/Tidak Bekerja', 373),
    (cat_job_id, 'Petani/Pekebun', 321),
    (cat_job_id, 'Wiraswasta', 119);
END $$;
