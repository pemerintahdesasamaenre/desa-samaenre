-- Merged Initial Schema
-- This single file contains the complete database schema for the application.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE CREATION

-- Profiles (linked to Supabase auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'admin' NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.profiles IS 'Stores user-specific data, extending the auth.users table.';

-- Categories (for posts, demographics, etc.)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.categories IS 'Generic categorization for different types of content.';

-- Village Info (singleton table)
CREATE TABLE IF NOT EXISTS public.village_info (
  id INT PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL,
  vision TEXT,
  mission JSONB DEFAULT '[]'::jsonb,
  history TEXT,
  contact_info JSONB DEFAULT '{}'::jsonb,
  location JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.village_info IS 'Singleton table to store general village information.';


-- Staff Members (for organizational chart)
CREATE TABLE IF NOT EXISTS public.staff_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  photo_url TEXT,
  order_index INTEGER DEFAULT 0 NOT NULL,
  parent_id UUID REFERENCES public.staff_members(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.staff_members IS 'Stores data about village officials and their hierarchy.';

-- Demographics
CREATE TABLE IF NOT EXISTS public.demographics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.demographics IS 'Stores statistical data about the village population.';

-- Posts (News & Agenda)
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
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.posts IS 'Stores articles for news and agenda items.';

-- Finances (APBDDes)
CREATE TABLE IF NOT EXISTS public.finances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'financing')),
  category_name TEXT NOT NULL,
  amount BIGINT NOT NULL DEFAULT 0,
  note TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.finances IS 'Stores financial data for transparency reports.';

-- 3. FUNCTIONS & TRIGGERS

-- Drop existing triggers and functions to ensure idempotency
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_demographics_updated_at ON public.demographics;
DROP TRIGGER IF EXISTS update_village_info_updated_at ON public.village_info;
DROP TRIGGER IF EXISTS update_finances_updated_at ON public.finances;

DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Function to check for admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
COMMENT ON FUNCTION public.is_admin() IS 'Security-definer function to check if the current user is an admin.';

-- Function to automatically create a profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'admin');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
COMMENT ON FUNCTION public.handle_new_user() IS 'Trigger function to populate a new profile upon user sign-up.';

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to automatically update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Generic trigger function to update the updated_at timestamp on row modification.';

-- Triggers for 'updated_at' timestamp updates
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_demographics_updated_at BEFORE UPDATE ON public.demographics FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_village_info_updated_at BEFORE UPDATE ON public.village_info FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_finances_updated_at BEFORE UPDATE ON public.finances FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- 4. ROW LEVEL SECURITY (RLS)

-- Enable RLS for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.village_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demographics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finances ENABLE ROW LEVEL SECURITY;

-- Policies for 'profiles'
CREATE POLICY "Allow authenticated users to view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow users to update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow admins to manage all profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- Policies for public-read tables
CREATE POLICY "Allow public read access" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.village_info FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.staff_members FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.demographics FOR SELECT USING (true);
CREATE POLICY "Allow public read access on published posts" ON public.posts FOR SELECT USING (status = 'published');
CREATE POLICY "Allow public read access" ON public.finances FOR SELECT USING (true);

-- Policies for admin-write tables
CREATE POLICY "Allow admin to manage categories" ON public.categories FOR ALL USING (public.is_admin());
CREATE POLICY "Allow admin to manage village_info" ON public.village_info FOR ALL USING (public.is_admin());
CREATE POLICY "Allow admin to manage staff_members" ON public.staff_members FOR ALL USING (public.is_admin());
CREATE POLICY "Allow admin to manage demographics" ON public.demographics FOR ALL USING (public.is_admin());
CREATE POLICY "Allow admin to manage posts" ON public.posts FOR ALL USING (public.is_admin());
CREATE POLICY "Allow admin to manage finances" ON public.finances FOR ALL USING (public.is_admin());
