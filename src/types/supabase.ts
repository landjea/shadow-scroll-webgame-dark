
// This file helps type-safe Supabase table operations
import { Database } from '@/types/database';

// Define known table names as a union type
export type TableName = keyof Database['public']['Tables'];
