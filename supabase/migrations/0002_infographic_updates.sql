-- Migration to add fields for Geographic Info
ALTER TABLE public.village_info 
ADD COLUMN IF NOT EXISTS area_size TEXT,
ADD COLUMN IF NOT EXISTS boundaries JSONB DEFAULT '{"north": "", "south": "", "east": "", "west": ""}'::jsonb,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS header_banner_url TEXT;

COMMENT ON COLUMN public.village_info.area_size IS 'Total area of the village in km2 or hectares.';
COMMENT ON COLUMN public.village_info.boundaries IS 'Descriptive boundaries of the village (North, South, East, West).';
