-- Migration: Add org_type to staff_members
-- Run this script in your Supabase SQL Editor

ALTER TABLE public.staff_members 
  ADD COLUMN IF NOT EXISTS org_type TEXT NOT NULL DEFAULT 'pemdes' 
  CHECK (org_type IN ('pemdes', 'bpd'));

-- Update existing staff to pemdes by default (if any exist)
UPDATE public.staff_members SET org_type = 'pemdes' WHERE org_type IS NULL;
