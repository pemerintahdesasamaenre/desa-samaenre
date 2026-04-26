-- Add new columns to activity_logs
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS method TEXT;
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Create function for cleanup
CREATE OR REPLACE FUNCTION public.cleanup_old_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM public.activity_logs
    WHERE created_at < (NOW() - INTERVAL '2 months');
    
    DELETE FROM public.resident_audit_logs
    WHERE created_at < (NOW() - INTERVAL '2 months');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: In a real Supabase environment, you would schedule this with pg_cron.
-- For this project, we can call it periodically in the fetch action or use a trigger.
-- Or just rely on the user interface filtering for 2 months.
