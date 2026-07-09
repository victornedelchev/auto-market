-- Add city column to profiles
ALTER TABLE public.profiles ADD COLUMN city text;

-- Update the trigger function to include city from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  base_username text;
  final_username text;
  meta_first_name text;
  meta_last_name text;
  meta_phone text;
  meta_city text;
BEGIN
  -- Extract metadata safely
  meta_first_name := NEW.raw_user_meta_data->>'first_name';
  meta_last_name := NEW.raw_user_meta_data->>'last_name';
  meta_phone := NEW.raw_user_meta_data->>'phone';
  meta_city := NEW.raw_user_meta_data->>'city';

  -- Generate a unique username from email
  base_username := split_part(NEW.email, '@', 1);
  final_username := base_username || '_' || substr(md5(random()::text), 1, 4);

  INSERT INTO public.profiles (
    id,
    username,
    full_name,
    phone,
    city
  )
  VALUES (
    NEW.id,
    final_username,
    nullif(trim(concat_ws(' ', meta_first_name, meta_last_name)), ''),
    meta_phone,
    meta_city
  );

  -- Also create a default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  RETURN NEW;
END;
$$;
