-- Create finances table
CREATE TABLE IF NOT EXISTS public.finances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'financing')),
  category_name TEXT NOT NULL,
  amount BIGINT NOT NULL DEFAULT 0,
  note TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.finances ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "finances_read_public" ON public.finances FOR SELECT USING (true);
CREATE POLICY "finances_admin_all" ON public.finances FOR ALL USING (is_admin()) WITH CHECK (is_admin());
