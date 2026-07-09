-- Create car_images table
CREATE TABLE public.car_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.car_listings(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Index for listing lookups
CREATE INDEX idx_car_images_listing_id ON public.car_images(listing_id);

-- Enable Row Level Security
ALTER TABLE public.car_images ENABLE ROW LEVEL SECURITY;
