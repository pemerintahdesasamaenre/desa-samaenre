-- Nuclear Clean Script
-- This script will drop all tables, functions, and triggers created by the application.
-- It's designed for a complete database reset.

-- Disable RLS on all tables before dropping them
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.finances DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.demographics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.village_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Drop tables. The 'CASCADE' option will automatically remove dependent objects 
-- like policies, foreign key constraints, etc.
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.finances CASCADE;
DROP TABLE IF EXISTS public.staff_members CASCADE;
DROP TABLE IF EXISTS public.demographics CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.village_info CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Re-enable UUID extension in case it was dropped by cascade
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Final check: The public schema should now be empty of our custom objects.
-- Note: We do not drop the auth.users table as it's managed by Supabase.
