-- Create a function to handle new user signups
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
BEGIN
  -- Extract metadata safely
  meta_first_name := NEW.raw_user_meta_data->>'first_name';
  meta_last_name := NEW.raw_user_meta_data->>'last_name';
  meta_phone := NEW.raw_user_meta_data->>'phone';
  
  -- Generate a unique username from email
  base_username := split_part(NEW.email, '@', 1);
  final_username := base_username || '_' || substr(md5(random()::text), 1, 4);

  INSERT INTO public.profiles (
    id, 
    username, 
    full_name, 
    phone
  )
  VALUES (
    NEW.id,
    final_username,
    nullif(trim(concat_ws(' ', meta_first_name, meta_last_name)), ''),
    meta_phone
  );

  -- Also create a default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  RETURN NEW;
END;
$$;

-- Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
