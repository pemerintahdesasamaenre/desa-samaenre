-- Policy to allow admins to insert logs
CREATE POLICY "Admins can insert logs" ON public.activity_logs 
FOR INSERT WITH CHECK (public.is_admin());

-- Re-verify that user_email and method columns exist (just in case)
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS method TEXT;
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS user_email TEXT;
