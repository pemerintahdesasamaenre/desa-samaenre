-- Add logo and banner columns to village_info
ALTER TABLE public.village_info 
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS header_banner_url TEXT;

COMMENT ON COLUMN public.village_info.logo_url IS 'URL for the village logo image.';
COMMENT ON COLUMN public.village_info.header_banner_url IS 'URL for the main homepage banner image.';
