-- SELECT: Anyone can read listings (public marketplace)
CREATE POLICY "car_listings_select_public"
  ON public.car_listings
  FOR SELECT
  USING (true);

-- INSERT: Authenticated users can create listings
CREATE POLICY "car_listings_insert_auth"
  ON public.car_listings
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = seller_id);

-- UPDATE: Only the owner can update
CREATE POLICY "car_listings_update_own"
  ON public.car_listings
  FOR UPDATE
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

-- DELETE: Only the owner can delete
CREATE POLICY "car_listings_delete_own"
  ON public.car_listings
  FOR DELETE
  USING (auth.uid() = seller_id);
