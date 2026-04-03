
CREATE TABLE public.shipping_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region_name text NOT NULL,
  countries text[] NOT NULL DEFAULT '{}',
  currency_code text NOT NULL DEFAULT 'INR',
  markup_percentage numeric NOT NULL DEFAULT 0,
  flat_shipping_fee numeric NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shipping zones viewable by everyone" ON public.shipping_zones FOR SELECT TO public USING (true);
CREATE POLICY "Shipping zones manageable by anyone for now" ON public.shipping_zones FOR ALL TO public USING (true) WITH CHECK (true);

INSERT INTO public.shipping_zones (region_name, countries, currency_code, markup_percentage, flat_shipping_fee, sort_order) VALUES
  ('India', ARRAY['IN'], 'INR', 0, 0, 1),
  ('United States', ARRAY['US'], 'USD', 10, 15, 2),
  ('United Kingdom', ARRAY['GB'], 'GBP', 10, 12, 3),
  ('Europe', ARRAY['DE','FR','IT','ES','NL','BE','AT','PT','IE','FI','GR','SE','DK','PL','CZ','RO','HU'], 'EUR', 8, 10, 4),
  ('Canada', ARRAY['CA'], 'CAD', 10, 15, 5),
  ('Australia', ARRAY['AU'], 'AUD', 12, 18, 6),
  ('Rest of World', ARRAY['*'], 'USD', 15, 20, 99);
