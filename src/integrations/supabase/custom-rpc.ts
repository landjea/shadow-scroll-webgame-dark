
import { supabase } from './client';

/**
 * Get a user ID by email address
 * 
 * This function needs a corresponding server-side function in Supabase:
 * 
 * CREATE OR REPLACE FUNCTION public.get_user_id_by_email(email TEXT)
 * RETURNS UUID
 * LANGUAGE plpgsql
 * SECURITY DEFINER
 * AS $$
 * DECLARE
 *   user_id UUID;
 * BEGIN
 *   SELECT id INTO user_id FROM auth.users WHERE auth.users.email = email;
 *   RETURN user_id;
 * END;
 * $$;
 */
export const getUserIdByEmail = async (email: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.rpc('get_user_id_by_email', { email });
    
    if (error) {
      console.error('Error getting user ID by email:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error calling getUserIdByEmail:', error);
    return null;
  }
};
