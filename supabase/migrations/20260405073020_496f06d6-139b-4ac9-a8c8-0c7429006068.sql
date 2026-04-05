
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS subtitle text DEFAULT '',
  ADD COLUMN IF NOT EXISTS trust_signals jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS benefit_points text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS variant_prices jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS favourite_variant text DEFAULT '';
