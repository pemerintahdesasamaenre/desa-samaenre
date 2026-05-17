-- 1. Create a function to check for either admin or staff role
CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Update policies for village_info
DROP POLICY IF EXISTS "Admins manage village_info" ON public.village_info;
CREATE POLICY "Staff and Admins manage village_info" ON public.village_info 
FOR ALL USING (public.is_staff_or_admin());

-- 3. Update policies for posts
DROP POLICY IF EXISTS "Admins manage posts" ON public.posts;
CREATE POLICY "Staff and Admins manage posts" ON public.posts 
FOR ALL USING (public.is_staff_or_admin());

-- 4. Update policies for categories
DROP POLICY IF EXISTS "Admins manage categories" ON public.categories;
CREATE POLICY "Staff and Admins manage categories" ON public.categories 
FOR ALL USING (public.is_staff_or_admin());

-- 5. Update policies for staff_members
DROP POLICY IF EXISTS "Admins manage staff" ON public.staff_members;
CREATE POLICY "Staff and Admins manage staff" ON public.staff_members 
FOR ALL USING (public.is_staff_or_admin());

-- 6. Update policies for finances
DROP POLICY IF EXISTS "Admins manage finances" ON public.finances;
CREATE POLICY "Staff and Admins manage finances" ON public.finances 
FOR ALL USING (public.is_staff_or_admin());

-- 7. Update activity logs to allow staff to insert logs
DROP POLICY IF EXISTS "Admins can insert logs" ON public.activity_logs;
CREATE POLICY "Staff and Admins can insert logs" ON public.activity_logs 
FOR INSERT WITH CHECK (public.is_staff_or_admin());

-- 8. Ensure staff can read profiles (needed for role checks sometimes)
DROP POLICY IF EXISTS "Admins manage all" ON public.profiles;
CREATE POLICY "Admins manage all profiles" ON public.profiles 
FOR ALL USING (public.is_admin());

CREATE POLICY "Users can view their own profile" ON public.profiles 
FOR SELECT USING (auth.uid() = id OR public.is_staff_or_admin());
