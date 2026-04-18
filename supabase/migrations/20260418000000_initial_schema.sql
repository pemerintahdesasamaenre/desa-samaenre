-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL, -- 'post', 'demographic', 'finance', 'gallery'
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. DEMOGRAPHICS TABLE
CREATE TABLE IF NOT EXISTS public.demographics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. VILLAGE_INFO TABLE
CREATE TABLE IF NOT EXISTS public.village_info (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  vision TEXT,
  mission JSONB DEFAULT '[]',
  history TEXT,
  contact_info JSONB DEFAULT '{}',
  location JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. STAFF_MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.staff_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  photo_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FUNCTION: is_admin (BREAKS RLS RECURSION)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FUNCTION: Handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'admin');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER: on auth.users created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ENABLE RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demographics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.village_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "categories_read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_admin" ON public.categories FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "demographics_read" ON public.demographics FOR SELECT USING (true);
CREATE POLICY "demographics_admin" ON public.demographics FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "village_read" ON public.village_info FOR SELECT USING (true);
CREATE POLICY "village_admin" ON public.village_info FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "staff_read" ON public.staff_members FOR SELECT USING (true);
CREATE POLICY "staff_admin" ON public.staff_members FOR ALL USING (is_admin()) WITH CHECK (is_admin());
