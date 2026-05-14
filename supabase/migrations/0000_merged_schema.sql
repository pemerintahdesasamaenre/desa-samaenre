-- ==========================================
-- 0. EXTENSIONS & INITIAL SETUP
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ==========================================
-- 1. BASIC TABLES (CORE)
-- ==========================================

-- Profiles (linked to Supabase auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'admin' NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS nip TEXT,
ADD COLUMN IF NOT EXISTS position TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Village Info (Singleton)
CREATE TABLE IF NOT EXISTS public.village_info (
  id INT PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL,
  vision TEXT,
  mission JSONB DEFAULT '[]'::jsonb,
  history TEXT,
  contact_info JSONB DEFAULT '{}'::jsonb,
  location JSONB DEFAULT '{}'::jsonb,
  area_size TEXT,
  boundaries JSONB DEFAULT '{"north": "", "south": "", "east": "", "west": ""}'::jsonb,
  logo_url TEXT,
  header_banner_url TEXT,
  former_leaders JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Staff Members
CREATE TABLE IF NOT EXISTS public.staff_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  photo_url TEXT,
  order_index INTEGER DEFAULT 0 NOT NULL,
  org_type TEXT NOT NULL DEFAULT 'pemdes' CHECK (org_type IN ('pemdes', 'bpd')),
  parent_id UUID REFERENCES public.staff_members(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Posts
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('news', 'agenda')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  event_date TIMESTAMP WITH TIME ZONE,
  views INTEGER DEFAULT 0 NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Finances
CREATE TABLE IF NOT EXISTS public.finances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'financing')),
  category_name TEXT NOT NULL,
  amount BIGINT NOT NULL DEFAULT 0,
  note TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ==========================================
-- 2. KEPENDUDUKAN (RESIDENTS) & SECURITY
-- ==========================================

-- Master Table Residents
CREATE TABLE IF NOT EXISTS public.residents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nik_hash TEXT NOT NULL, 
    kk_hash TEXT, -- Deterministic Hash for counting families
    nik_enc TEXT, -- AES Encrypted
    kk_enc TEXT,  -- AES Encrypted
    name_enc TEXT, -- AES Encrypted
    data_year INTEGER NOT NULL,
    birth_place TEXT,
    birth_date DATE,
    gender TEXT CHECK (gender IN ('L', 'P')),
    education TEXT,
    occupation TEXT,
    marital_status TEXT,
    family_relationship TEXT,
    father_name TEXT,
    mother_name TEXT,
    dusun TEXT,
    rt TEXT,
    rw TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT residents_nik_year_key UNIQUE (nik_hash, data_year)
);

-- Activity Logs (General)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    method TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Resident Audit Logs (Detailed Data Changes)
CREATE TABLE IF NOT EXISTS public.resident_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resident_id UUID,
    nik_hash TEXT,
    changed_by UUID REFERENCES auth.users(id),
    operation TEXT,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. ANALYTICS (TRAFFIC)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.page_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_path TEXT NOT NULL UNIQUE,
  views_count BIGINT DEFAULT 0 NOT NULL,
  last_visited TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.daily_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_date DATE NOT NULL UNIQUE DEFAULT CURRENT_DATE,
  views_count BIGINT DEFAULT 0 NOT NULL
);

-- ==========================================
-- 4. FUNCTIONS & TRIGGERS
-- ==========================================

-- Admin Check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- New User Profile Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, nip, position, phone)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'User Baru'), 
    COALESCE(new.raw_user_meta_data->>'role', 'admin'),
    new.raw_user_meta_data->>'nip',
    new.raw_user_meta_data->>'position',
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Auto Update Timestamp Function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_residents_updated_at BEFORE UPDATE ON public.residents FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- LOG RESIDENT CHANGES (AUDIT)
CREATE OR REPLACE FUNCTION public.log_resident_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.resident_audit_logs (resident_id, nik_hash, changed_by, operation, new_data)
        VALUES (NEW.id, NEW.nik_hash, auth.uid(), 'INSERT', to_jsonb(NEW));
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.resident_audit_logs (resident_id, nik_hash, changed_by, operation, old_data, new_data)
        VALUES (NEW.id, NEW.nik_hash, auth.uid(), 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.resident_audit_logs (resident_id, nik_hash, changed_by, operation, old_data)
        VALUES (OLD.id, OLD.nik_hash, auth.uid(), 'DELETE', to_jsonb(OLD));
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_audit_residents AFTER INSERT OR UPDATE OR DELETE ON public.residents FOR EACH ROW EXECUTE PROCEDURE public.log_resident_changes();

-- Cleanup Old Logs Function
CREATE OR REPLACE FUNCTION public.cleanup_old_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM public.activity_logs
    WHERE created_at < (NOW() - INTERVAL '2 months');
    
    DELETE FROM public.resident_audit_logs
    WHERE created_at < (NOW() - INTERVAL '2 months');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 4.5 ANALYTICS FUNCTIONS (NEW)
-- ==========================================

-- Fungsi untuk menghitung pengunjung per halaman
CREATE OR REPLACE FUNCTION public.increment_page_views(path TEXT)
RETURNS void AS $$
BEGIN
  -- Update atau insert ke tabel page_analytics
  INSERT INTO public.page_analytics (page_path, views_count, last_visited)
  VALUES (path, 1, NOW())
  ON CONFLICT (page_path)
  DO UPDATE SET 
    views_count = public.page_analytics.views_count + 1,
    last_visited = NOW();

  -- Update atau insert ke tabel daily_analytics (untuk "Hari Ini")
  INSERT INTO public.daily_analytics (visit_date, views_count)
  VALUES (CURRENT_DATE, 1)
  ON CONFLICT (visit_date)
  DO UPDATE SET views_count = public.daily_analytics.views_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fungsi untuk menghitung pengunjung per berita/post
CREATE OR REPLACE FUNCTION public.increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.posts
  SET views = views + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 5. MATERIALIZED VIEW (TUKANG KESIMPULAN)
-- ==========================================

DROP MATERIALIZED VIEW IF EXISTS public.mv_demographic_stats CASCADE;

CREATE MATERIALIZED VIEW public.mv_demographic_stats AS
WITH normalized_data AS (
    SELECT 
        data_year, gender, kk_enc, birth_date,
        TRIM(REGEXP_REPLACE(dusun, '\d+', '', 'g')) as clean_dusun,
        CASE 
            WHEN education ILIKE '%SD%' OR education ILIKE '%S[TAT.T%' THEN 'SD / Sederajat'
            WHEN education ILIKE '%SMP%' OR education ILIKE '%SLTP%' THEN 'SMP / Sederajat'
            WHEN education ILIKE '%SMA%' OR education ILIKE '%SMK%' OR education ILIKE '%SLTA%' OR education ILIKE '%SLA%' OR education ILIKE '%MAN%' THEN 'SMA / Sederajat'
            WHEN education ILIKE '%S1%' OR education ILIKE '%STRATA%' OR education ILIKE '%SARJANA%' OR education ILIKE '%DIPLOMA%' OR education ILIKE '%D1%' OR education ILIKE '%D2%' OR education ILIKE '%D3%' OR education ILIKE '%D4%' THEN 'Diploma / Sarjana'
            WHEN education ILIKE '%BELUM%' OR education ILIKE '%TIDAK%' OR education ILIKE '%TK%' OR education ILIKE '%PAUD%' THEN 'Belum / Tidak Sekolah'
            ELSE 'Lainnya'
        END as clean_education,
        CASE 
            WHEN occupation ILIKE '%TANI%' OR occupation ILIKE '%KEBUN%' OR occupation ILIKE '%SAWAH%' THEN 'Petani / Pekebun'
            WHEN occupation ILIKE '%PELAJAR%' OR occupation ILIKE '%MAHASISWA%' OR occupation ILIKE '%PEALAJAR%' OR occupation ILIKE '%SISWA%' THEN 'Pelajar / Mahasiswa'
            WHEN occupation ILIKE '%URT%' OR occupation ILIKE '%RUMAH%TANGGA%' OR occupation ILIKE '%IRT%' THEN 'Ibu Rumah Tangga'
            WHEN occupation ILIKE '%ASN%' OR occupation ILIKE '%PNS%' OR occupation ILIKE '%PPPK%' OR occupation ILIKE '%HONOR%' OR occupation ILIKE '%GURU%' OR occupation ILIKE '%TNI%' OR occupation ILIKE '%POLRI%' OR occupation ILIKE '%ABRI%' OR occupation ILIKE '%PERANGKAT%' THEN 'Pegawai / ASN'
            WHEN occupation ILIKE '%SWASTA%' OR occupation ILIKE '%KARYAWAN%' OR occupation ILIKE '%BURUH%' OR occupation ILIKE '%PABRIK%' THEN 'Swasta / Karyawan'
            WHEN occupation ILIKE '%WIRA%' OR occupation ILIKE '%USAHA%' OR occupation ILIKE '%DAGANG%' OR occupation ILIKE '%SOPIR%' OR occupation ILIKE '%TUKANG%' OR occupation ILIKE '%BENGKEL%' THEN 'Wiraswasta / Jasa'
            WHEN occupation ILIKE '%TIDAK%KERJA%' OR occupation ILIKE '%TDK%KERJA%' OR occupation ILIKE '%BELUM%KERJA%' OR occupation ILIKE '%BELUM%BEKRJA%' OR occupation ILIKE '%TIDAK%ADA%' OR occupation ILIKE '%TDK%ADA%' OR occupation ILIKE '%ANAK%' OR occupation ILIKE '%BELUM%SEKOLAH%' OR occupation = 'BELUM' OR occupation = 'TIDAK' THEN 'Tidak / Belum Bekerja'
            ELSE 'Lainnya'
        END as clean_occupation,
        CASE 
            WHEN marital_status ILIKE '%BELUM%' THEN 'Belum Kawin'
            WHEN marital_status ILIKE '%KAWIN%' OR marital_status ILIKE '%SUAMI%' OR marital_status ILIKE '%ISTRI%' OR marital_status ILIKE '%MENIKAH%' OR marital_status ILIKE '%KEPALA%KELUARGA%' OR
                 family_relationship ILIKE '%SUAMI%' OR family_relationship ILIKE '%ISTRI%' OR family_relationship ILIKE '%KEPALA%KELUARGA%' THEN 'Kawin'
            WHEN marital_status ILIKE '%CERAI%HIDUP%' THEN 'Cerai Hidup'
            WHEN marital_status ILIKE '%CERAI%MATI%' OR marital_status ILIKE '%JANDA%' OR marital_status ILIKE '%DUDA%' THEN 'Cerai Mati'
            WHEN family_relationship ILIKE '%ANAK%' AND (marital_status IS NULL OR marital_status = '') THEN 'Belum Kawin'
            ELSE 'Lainnya'
        END as clean_marital_status
    FROM public.residents
),
aggregated_stats AS (
    SELECT data_year, 'population' as category_slug, 'Total Penduduk' as label, COUNT(*) as value, 1 as sort_order FROM normalized_data GROUP BY data_year
    UNION ALL
    SELECT data_year, 'population', 'Laki-laki', COUNT(*), 2 FROM normalized_data WHERE gender = 'L' GROUP BY data_year
    UNION ALL
    SELECT data_year, 'population', 'Perempuan', COUNT(*), 3 FROM normalized_data WHERE gender = 'P' GROUP BY data_year
    UNION ALL
    SELECT data_year, 'population', 'Kepala Keluarga', COUNT(DISTINCT kk_enc), 4 FROM normalized_data GROUP BY data_year
    UNION ALL
    SELECT data_year, 'education', clean_education, COUNT(*), 0 FROM normalized_data GROUP BY data_year, clean_education
    UNION ALL
    SELECT data_year, 'marital_status', clean_marital_status, COUNT(*), 0 FROM normalized_data GROUP BY data_year, clean_marital_status
    UNION ALL
    SELECT data_year, 'hamlets', clean_dusun, COUNT(*), 0 FROM normalized_data WHERE clean_dusun IS NOT NULL AND clean_dusun != '' GROUP BY data_year, clean_dusun
    UNION ALL
    SELECT data_year, 'family_relationship', family_relationship, COUNT(*), 0 FROM public.residents WHERE family_relationship IS NOT NULL AND family_relationship != '' GROUP BY data_year, family_relationship
    UNION ALL
    SELECT 
        data_year, 'age_groups',
        CASE 
            WHEN date_part('year', age(CURRENT_DATE, birth_date)) <= 5 THEN 'Balita (0-5)'
            WHEN date_part('year', age(CURRENT_DATE, birth_date)) <= 12 THEN 'Anak (6-12)'
            WHEN date_part('year', age(CURRENT_DATE, birth_date)) <= 18 THEN 'Remaja (13-18)'
            WHEN date_part('year', age(CURRENT_DATE, birth_date)) <= 59 THEN 'Dewasa (19-59)'
            ELSE 'Lansia (60+)'
        END,
        COUNT(*),
        CASE 
            WHEN date_part('year', age(CURRENT_DATE, birth_date)) <= 5 THEN 1
            WHEN date_part('year', age(CURRENT_DATE, birth_date)) <= 12 THEN 2
            WHEN date_part('year', age(CURRENT_DATE, birth_date)) <= 18 THEN 3
            WHEN date_part('year', age(CURRENT_DATE, birth_date)) <= 59 THEN 4
            ELSE 5
        END
    FROM public.residents WHERE birth_date IS NOT NULL GROUP BY data_year, 3, 5
    UNION ALL
    SELECT data_year, 'occupations', clean_occupation, COUNT(*), 0 FROM normalized_data GROUP BY data_year, clean_occupation
)
SELECT * FROM aggregated_stats;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_stats_unique ON public.mv_demographic_stats(data_year, category_slug, label);

-- Auto-Refresh Function for MV
CREATE OR REPLACE FUNCTION public.refresh_demographic_stats()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_demographic_stats;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_refresh_stats AFTER INSERT OR UPDATE OR DELETE ON public.residents FOR EACH STATEMENT EXECUTE PROCEDURE public.refresh_demographic_stats();

-- ==========================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.village_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resident_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_analytics ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Allow public read access" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.village_info FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.staff_members FOR SELECT USING (true);
CREATE POLICY "Allow public read access on published posts" ON public.posts FOR SELECT USING (status = 'published');
CREATE POLICY "Allow public read access" ON public.finances FOR SELECT USING (true);
CREATE POLICY "Allow public read analytics" ON public.page_analytics FOR SELECT USING (true);
CREATE POLICY "Allow public read daily analytics" ON public.daily_analytics FOR SELECT USING (true);

-- Admin Only Policies
CREATE POLICY "Admins manage all" ON public.profiles FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage village_info" ON public.village_info FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage staff" ON public.staff_members FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage residents" ON public.residents FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage posts" ON public.posts FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage finances" ON public.finances FOR ALL USING (public.is_admin());
CREATE POLICY "Admins view logs" ON public.activity_logs FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins insert logs" ON public.activity_logs FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins view audit" ON public.resident_audit_logs FOR SELECT USING (public.is_admin());
