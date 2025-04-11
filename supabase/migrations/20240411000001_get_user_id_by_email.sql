
-- Create a function to get a user ID by email
CREATE OR REPLACE FUNCTION public.get_user_id_by_email(email TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE auth.users.email = email;
  RETURN user_id;
END;
$$;
