-- Update staff_members table to support hierarchy
ALTER TABLE public.staff_members 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.staff_members(id) ON DELETE SET NULL;
