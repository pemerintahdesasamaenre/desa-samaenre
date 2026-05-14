-- Seed data khusus untuk Kategori Desa Samaenre
-- Gunakan script ini di SQL Editor Supabase Cloud

DO $$ 
BEGIN
    -- Hapus data kategori lama jika diperlukan
    -- DELETE FROM public.categories;

    -- ==========================================
    -- 0. KATEGORI (CATEGORIES)
    -- ==========================================
    
    -- Kategori Berita & Pengumuman (post)
    INSERT INTO public.categories (name, slug, type, description) VALUES
    ('Berita Desa', 'berita-desa', 'post', 'Informasi seputar kegiatan dan perkembangan terbaru di desa.'),
    ('Pengumuman', 'pengumuman', 'post', 'Pemberitahuan resmi dari pemerintah desa untuk warga.'),
    ('Agenda Kegiatan', 'agenda-kegiatan', 'post', 'Jadwal kegiatan kemasyarakatan, keagamaan, dan pemerintahan.'),
    ('Kesehatan', 'kesehatan', 'post', 'Informasi seputar layanan kesehatan, posyandu, dan kebersihan lingkungan.')
    ON CONFLICT (slug) DO NOTHING;


    -- Kategori Laporan Keuangan (finance)
    INSERT INTO public.categories (name, slug, type, description) VALUES
    ('Dana Desa', 'dana-desa', 'finance', 'Alokasi dan penggunaan Dana Desa (DDS).'),
    ('Alokasi Dana Desa', 'add', 'finance', 'Alokasi dan penggunaan Alokasi Dana Desa (ADD).'),
    ('Pajak & Retribusi', 'pajak-retribusi', 'finance', 'Pendapatan asli desa dari bagi hasil pajak dan retribusi.'),
    ('Bantuan Provinsi', 'bantuan-provinsi', 'finance', 'Laporan dana bantuan keuangan dari pemerintah provinsi.')
    ON CONFLICT (slug) DO NOTHING;


END $$;
