-- Seed data untuk Desa Samaenre
-- Gunakan script ini di SQL Editor Supabase Cloud

DO $$ 
DECLARE
    id_kades UUID := gen_random_uuid();
    id_sekdes UUID := gen_random_uuid();
    id_kasi_pem UUID := gen_random_uuid();
    id_kaur_keu UUID := gen_random_uuid();
    id_ketua_bpd UUID := gen_random_uuid();
    id_sek_bpd UUID := gen_random_uuid();
BEGIN
    -- Hapus data lama
    DELETE FROM public.staff_members;

    -- ==========================================
    -- 1. PEMERINTAH DESA (PEMDES)
    -- ==========================================
    INSERT INTO public.staff_members (id, name, position, org_type, order_index, parent_id)
    VALUES (id_kades, 'ANDI MAJJALEKKA', 'KEPALA DESA', 'pemdes', 1, NULL);

    INSERT INTO public.staff_members (id, name, position, org_type, order_index, parent_id)
    VALUES (id_sekdes, 'ABD. RAHIM, S.Kom', 'SEKERTARIS DESA', 'pemdes', 1, id_kades);

    -- Di bawah Sekdes
    INSERT INTO public.staff_members (id, name, position, org_type, order_index, parent_id) VALUES
    (id_kasi_pem, 'AISYA', 'KASI PEMERINTAHAN', 'pemdes', 1, id_sekdes),
    (id_kaur_keu, 'HALIJA', 'KAUR KEUANGAN', 'pemdes', 2, id_sekdes),
    (gen_random_uuid(), 'NURLAELAH, S.H', 'KAUR UMUM', 'pemdes', 3, id_sekdes),
    (gen_random_uuid(), 'ANWAR', 'KASI KESRA', 'pemdes', 4, id_sekdes);

    -- Di bawah Kasi/Kaur
    INSERT INTO public.staff_members (name, position, org_type, order_index, parent_id) VALUES
    ('MURIATI, S.Hut', 'STAF KASI PEMERINTAHAN', 'pemdes', 1, id_kasi_pem),
    ('ARISANDI', 'STAF KASI PEMERINTAHAN', 'pemdes', 2, id_kasi_pem),
    ('REZKI APRIANTI', 'STAF KAUR KEUANGAN', 'pemdes', 1, id_kaur_keu),
    ('WAHAB', 'STAF KASI KESRA', 'pemdes', 1, (SELECT id FROM staff_members WHERE name = 'ANWAR' LIMIT 1));

    -- Kadus (Langsung di bawah Kades)
    INSERT INTO public.staff_members (name, position, org_type, order_index, parent_id) VALUES
    ('ISHAK', 'KADUS REALOLO', 'pemdes', 2, id_kades),
    ('DALLE HIDE', 'KADUS MALEMPO', 'pemdes', 3, id_kades),
    ('FIRDAUS', 'KADUS BONTOSIRING', 'pemdes', 4, id_kades),
    ('MARSUKI', 'KADUS MALLENRENG', 'pemdes', 5, id_kades);

    -- ==========================================
    -- 2. BPD SAMAENRE
    -- ==========================================
    INSERT INTO public.staff_members (id, name, position, org_type, order_index, parent_id)
    VALUES (id_ketua_bpd, 'ABDUL RAHMAN, S.pd', 'KETUA BPD', 'bpd', 1, NULL);

    INSERT INTO public.staff_members (id, name, position, org_type, order_index, parent_id) VALUES
    (gen_random_uuid(), 'Al IMRAN', 'WAKIL KETUA BPD', 'bpd', 1, id_ketua_bpd),
    (id_sek_bpd, 'HJ. SATIA', 'SEKERTARIS', 'bpd', 2, id_ketua_bpd),
    (gen_random_uuid(), 'AKBAR', 'ANGGOTA', 'bpd', 3, id_ketua_bpd),
    (gen_random_uuid(), 'AMBO DALLE', 'ANGGOTA', 'bpd', 4, id_ketua_bpd);

    INSERT INTO public.staff_members (name, position, org_type, order_index, parent_id)
    VALUES ('Nurul AISYA', 'STAFF BPD', 'bpd', 1, id_sek_bpd);

END $$;
