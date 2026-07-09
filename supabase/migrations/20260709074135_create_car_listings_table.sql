-- Create car_listings table
CREATE TABLE public.car_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL CHECK (year >= 1900 AND year <= 2100),
  mileage integer CHECK (mileage >= 0),
  fuel_type text CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid', 'lpg')),
  transmission text CHECK (transmission IN ('manual', 'automatic')),
  horsepower integer CHECK (horsepower > 0),
  price numeric(12,2) NOT NULL CHECK (price >= 0),
  location text,
  condition text CHECK (condition IN ('new', 'used', 'certified')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_car_listings_seller_id ON public.car_listings(seller_id);
CREATE INDEX idx_car_listings_brand ON public.car_listings(brand);
CREATE INDEX idx_car_listings_status ON public.car_listings(status);
CREATE INDEX idx_car_listings_price ON public.car_listings(price);
CREATE INDEX idx_car_listings_created_at ON public.car_listings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.car_listings ENABLE ROW LEVEL SECURITY;
