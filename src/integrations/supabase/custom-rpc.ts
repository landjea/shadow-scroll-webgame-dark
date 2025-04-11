
import { supabase } from './client';

/**
 * Get a user's email address by their user ID
 * @param userId The user's ID
 * @returns The user's email address
 */
export const getUserEmail = async (userId: string): Promise<string> => {
  const { data, error } = await supabase.rpc('get_user_email', { user_id: userId });
  
  if (error) {
    console.error('Error fetching user email:', error);
    return `Unknown (${userId.substring(0, 8)})`;
  }
  
  return data || `Unknown (${userId.substring(0, 8)})`;
};

/**
 * Get a user's ID by their email address
 * Note: This requires a custom SQL function to be created in Supabase
 * @param email The user's email address
 * @returns The user's ID or null if not found
 */
export const getUserIdByEmail = async (email: string): Promise<string | null> => {
  try {
    // Fallback to querying the custom function
    const { data, error } = await supabase.rpc('get_user_id_by_email', { email });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting user ID by email:', error);
    return null;
  }
};
